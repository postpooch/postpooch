import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  type PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";

const DEFAULT_DIRECTORY = "images";
const DEFAULT_MAX_BYTES = 20 * 1024 * 1024;
const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";

type ImageSource = ArrayBuffer | Blob | Buffer | Uint8Array;

type SupportedImage = {
  contentType:
    | "image/avif"
    | "image/gif"
    | "image/jpeg"
    | "image/png"
    | "image/webp";
  extension: "avif" | "gif" | "jpg" | "png" | "webp";
};

export type R2ImageStorageConfig = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string;
};

export type UploadImageInput = {
  /**
   * Binary image data. The format is detected from the bytes; client-supplied
   * filenames and MIME types are intentionally not trusted.
   */
  image: ImageSource;
  /** Object-key directory. Defaults to "images". */
  directory?: string;
  /** Upload limit in bytes. Defaults to 20 MiB. */
  maxBytes?: number;
};

export type UploadedImage = {
  key: string;
  url: string;
  contentType: SupportedImage["contentType"];
  bytes: number;
  sha256: string;
  etag?: string;
  /** True when an identical content-addressed object already existed. */
  alreadyExisted: boolean;
};

export type DeleteImageInput = {
  /**
   * Object key returned by uploadImageToR2. Public URLs are rejected so a
   * caller cannot delete an object outside this module's key layout.
   */
  key: string;
};

export type DeletedImage = {
  key: string;
};

export class R2ImageError extends Error {
  constructor(
    message: string,
    options?: {
      cause?: unknown;
    },
  ) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class R2ImageUploadError extends R2ImageError {}

export class R2ImageDeleteError extends R2ImageError {}

function requiredConfigValue(name: string, value: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new R2ImageUploadError(`${name} is required.`);
  }
  return normalized;
}

function validateConfig(config: R2ImageStorageConfig): R2ImageStorageConfig {
  const accountId = requiredConfigValue("R2 account ID", config.accountId);
  const accessKeyId = requiredConfigValue(
    "R2 access key ID",
    config.accessKeyId,
  );
  const secretAccessKey = requiredConfigValue(
    "R2 secret access key",
    config.secretAccessKey,
  );
  const bucket = requiredConfigValue("R2 bucket", config.bucket);
  const publicBaseUrl = requiredConfigValue(
    "R2 public base URL",
    config.publicBaseUrl,
  );

  if (!/^[a-f0-9]{32}$/i.test(accountId)) {
    throw new R2ImageUploadError("R2 account ID must be 32 hexadecimal characters.");
  }

  let publicUrl: URL;
  try {
    publicUrl = new URL(publicBaseUrl);
  } catch {
    throw new R2ImageUploadError("R2 public base URL must be a valid URL.");
  }

  if (publicUrl.protocol !== "https:") {
    throw new R2ImageUploadError("R2 public base URL must use HTTPS.");
  }

  if (publicUrl.search || publicUrl.hash) {
    throw new R2ImageUploadError(
      "R2 public base URL cannot contain a query string or fragment.",
    );
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: publicUrl.toString().replace(/\/+$/, ""),
  };
}

function getConfigFromEnvironment(): R2ImageStorageConfig {
  return validateConfig({
    accountId: process.env.CLOUDFLARE_R2_ACCOUNT_ID ?? "",
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? "",
    bucket: process.env.CLOUDFLARE_R2_BUCKET ?? "",
    publicBaseUrl: process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL ?? "",
  });
}

function createR2Client(config: R2ImageStorageConfig): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    maxAttempts: 3,
    // R2 does not support the AWS SDK's default CRC32 request/response mode.
    // Upload integrity is still verified below with R2-supported Content-MD5.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
}

async function toBuffer(source: ImageSource): Promise<Buffer> {
  if (Buffer.isBuffer(source)) {
    return source;
  }
  if (source instanceof Blob) {
    return Buffer.from(await source.arrayBuffer());
  }
  if (source instanceof ArrayBuffer) {
    return Buffer.from(source);
  }
  return Buffer.from(source.buffer, source.byteOffset, source.byteLength);
}

function startsWith(bytes: Buffer, signature: readonly number[]): boolean {
  return (
    bytes.length >= signature.length &&
    signature.every((value, index) => bytes[index] === value)
  );
}

function detectImage(bytes: Buffer): SupportedImage | undefined {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { contentType: "image/png", extension: "png" };
  }

  const header = bytes.subarray(0, 32).toString("ascii");
  if (header.startsWith("GIF87a") || header.startsWith("GIF89a")) {
    return { contentType: "image/gif", extension: "gif" };
  }
  if (header.startsWith("RIFF") && header.slice(8, 12) === "WEBP") {
    return { contentType: "image/webp", extension: "webp" };
  }
  if (
    header.slice(4, 8) === "ftyp" &&
    (header.slice(8, 12) === "avif" ||
      header.slice(8, 12) === "avis" ||
      header.slice(16).includes("avif") ||
      header.slice(16).includes("avis"))
  ) {
    return { contentType: "image/avif", extension: "avif" };
  }

  return undefined;
}

function normalizeDirectory(value: string | undefined): string {
  const directory = value?.trim().replace(/^\/+|\/+$/g, "") || DEFAULT_DIRECTORY;
  const segments = directory.split("/");

  if (
    directory.length > 256 ||
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(segment),
    )
  ) {
    throw new R2ImageUploadError(
      "Image directory must contain only safe path segments (letters, numbers, '.', '_', and '-').",
    );
  }

  return segments.join("/");
}

function validateMaxBytes(value: number | undefined): number {
  const maxBytes = value ?? DEFAULT_MAX_BYTES;
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    throw new R2ImageUploadError("maxBytes must be a positive safe integer.");
  }
  return maxBytes;
}

function publicUrlForKey(baseUrl: string, key: string): string {
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${baseUrl}/${encodedKey}`;
}

const MANAGED_IMAGE_KEY_PATTERN =
  /^((?:[a-zA-Z0-9][a-zA-Z0-9._-]*\/)+)([a-f0-9]{2})\/([a-f0-9]{64})\.(avif|gif|jpg|png|webp)$/;

/**
 * Accepts only keys this module can mint: `{directory}/{ab}/{sha256}.{ext}`.
 * Arbitrary bucket keys, path traversal, and public URLs are rejected.
 */
function normalizeImageObjectKey(value: string): string {
  if (typeof value !== "string") {
    throw new R2ImageDeleteError("Image key is required.");
  }

  const key = value.trim();
  if (!key) {
    throw new R2ImageDeleteError("Image key is required.");
  }

  if (/^https?:\/\//i.test(key)) {
    throw new R2ImageDeleteError(
      "Pass the object key returned by upload, not the public URL.",
    );
  }

  if (
    key.length > 1024 ||
    key.startsWith("/") ||
    key.includes("\\") ||
    key.includes("\0") ||
    key.includes("..")
  ) {
    throw new R2ImageDeleteError(
      "Image key is not a valid content-addressed R2 image key.",
    );
  }

  const match = MANAGED_IMAGE_KEY_PATTERN.exec(key);
  const directoryWithSlash = match?.[1];
  const shard = match?.[2];
  const sha256 = match?.[3];

  if (!directoryWithSlash || !shard || !sha256) {
    throw new R2ImageDeleteError(
      "Image key is not a valid content-addressed R2 image key.",
    );
  }

  const directory = directoryWithSlash.slice(0, -1);
  if (directory.length > 256 || shard !== sha256.slice(0, 2)) {
    throw new R2ImageDeleteError(
      "Image key is not a valid content-addressed R2 image key.",
    );
  }

  return key;
}

function isPreconditionFailure(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as {
    name?: unknown;
    $metadata?: { httpStatusCode?: unknown };
  };
  return (
    candidate.name === "PreconditionFailed" ||
    candidate.$metadata?.httpStatusCode === 412
  );
}

function resultFromUpload(
  output: PutObjectCommandOutput | undefined,
  input: {
    key: string;
    baseUrl: string;
    image: SupportedImage;
    bytes: number;
    sha256: string;
    alreadyExisted: boolean;
  },
): UploadedImage {
  return {
    key: input.key,
    url: publicUrlForKey(input.baseUrl, input.key),
    contentType: input.image.contentType,
    bytes: input.bytes,
    sha256: input.sha256,
    etag: output?.ETag,
    alreadyExisted: input.alreadyExisted,
  };
}

/**
 * Creates an isolated uploader, useful when configuration or the S3 client is
 * supplied by dependency injection.
 */
export function createR2ImageUploader(
  suppliedConfig: R2ImageStorageConfig,
  suppliedClient?: S3Client,
): (input: UploadImageInput) => Promise<UploadedImage> {
  const config = validateConfig(suppliedConfig);
  const client = suppliedClient ?? createR2Client(config);

  return async (input: UploadImageInput): Promise<UploadedImage> => {
    const maxBytes = validateMaxBytes(input.maxBytes);
    const bytes = await toBuffer(input.image);

    if (bytes.byteLength === 0) {
      throw new R2ImageUploadError("Image cannot be empty.");
    }
    if (bytes.byteLength > maxBytes) {
      throw new R2ImageUploadError(
        `Image is ${bytes.byteLength} bytes; the maximum is ${maxBytes} bytes.`,
      );
    }

    const image = detectImage(bytes);
    if (!image) {
      throw new R2ImageUploadError(
        "Unsupported image format. Use JPEG, PNG, GIF, WebP, or AVIF.",
      );
    }

    const directory = normalizeDirectory(input.directory);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const contentMd5 = createHash("md5").update(bytes).digest("base64");
    const key = `${directory}/${sha256.slice(0, 2)}/${sha256}.${image.extension}`;

    try {
      const output = await client.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: key,
          Body: bytes,
          ContentType: image.contentType,
          ContentLength: bytes.byteLength,
          ContentMD5: contentMd5,
          ContentDisposition: "inline",
          CacheControl: IMMUTABLE_CACHE_CONTROL,
          IfNoneMatch: "*",
          Metadata: {
            sha256,
          },
        }),
      );

      return resultFromUpload(output, {
        key,
        baseUrl: config.publicBaseUrl,
        image,
        bytes: bytes.byteLength,
        sha256,
        alreadyExisted: false,
      });
    } catch (error) {
      // The full SHA-256 key makes an existing object the same logical image.
      // Treat R2's conditional-write rejection as an idempotent success.
      if (isPreconditionFailure(error)) {
        return resultFromUpload(undefined, {
          key,
          baseUrl: config.publicBaseUrl,
          image,
          bytes: bytes.byteLength,
          sha256,
          alreadyExisted: true,
        });
      }

      throw new R2ImageUploadError("Failed to upload image to R2.", {
        cause: error,
      });
    }
  };
}

type EnvironmentR2 = {
  config: R2ImageStorageConfig;
  client: S3Client;
};

let environmentR2: EnvironmentR2 | undefined;
let environmentUploader:
  | ((input: UploadImageInput) => Promise<UploadedImage>)
  | undefined;
let environmentDeleter:
  | ((input: DeleteImageInput) => Promise<DeletedImage>)
  | undefined;

function getEnvironmentR2(): EnvironmentR2 {
  if (!environmentR2) {
    const config = getConfigFromEnvironment();
    environmentR2 = {
      config,
      client: createR2Client(config),
    };
  }
  return environmentR2;
}

/**
 * Uploads a validated image using the project's CLOUDFLARE_R2_* environment
 * variables. This function is server-only because it reads secret credentials.
 */
export async function uploadImageToR2(
  input: UploadImageInput,
): Promise<UploadedImage> {
  if (!environmentUploader) {
    const { config, client } = getEnvironmentR2();
    environmentUploader = createR2ImageUploader(config, client);
  }
  return environmentUploader(input);
}

/**
 * Creates an isolated deleter, useful when configuration or the S3 client is
 * supplied by dependency injection.
 */
export function createR2ImageDeleter(
  suppliedConfig: R2ImageStorageConfig,
  suppliedClient?: S3Client,
): (input: DeleteImageInput) => Promise<DeletedImage> {
  const config = validateConfig(suppliedConfig);
  const client = suppliedClient ?? createR2Client(config);

  return async (input: DeleteImageInput): Promise<DeletedImage> => {
    const key = normalizeImageObjectKey(input.key);

    try {
      // DeleteObject is idempotent on R2/S3: a missing key still succeeds.
      // Do not HeadObject first; that adds a race and an extra billed request.
      await client.send(
        new DeleteObjectCommand({
          Bucket: config.bucket,
          Key: key,
        }),
      );
    } catch (error) {
      throw new R2ImageDeleteError("Failed to delete image from R2.", {
        cause: error,
      });
    }

    return { key };
  };
}

/**
 * Deletes a previously uploaded image using the project's CLOUDFLARE_R2_*
 * environment variables. This function is server-only because it reads secret
 * credentials. Identical content shares one object, so deleting it removes
 * that image for every reference.
 */
export async function deleteImageFromR2(
  input: DeleteImageInput,
): Promise<DeletedImage> {
  if (!environmentDeleter) {
    const { config, client } = getEnvironmentR2();
    environmentDeleter = createR2ImageDeleter(config, client);
  }
  return environmentDeleter(input);
}
