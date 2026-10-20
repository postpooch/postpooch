import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";
import type { PoolClient } from "pg";
import sharp from "sharp";

import { getDbPool } from "@/lib/db/client";
import { R2ImageUploadError } from "@/lib/images/r2";
import { socialTemplatePreviewUrl } from "@/lib/social-templates/preview-url";

import { DummyTemplateError, parseMjmlDocument } from "./mjml-image-urls";
import { rehostMjmlImageAssets } from "./rehost-mjml-assets";
import { renderMjmlPreviewJpeg } from "./render-mjml-preview";

export { DummyTemplateError } from "./mjml-image-urls";

/** Object-key prefix for newsletter template picker thumbnails. */
export const NEWSLETTER_PREVIEW_DIRECTORY = "newsletter/template_previews";

export const MAX_MJML_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const PREVIEW_MAX_EDGE = 1_600;

const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";

export type SeededNewsletterTemplate = {
  id: string;
  previewPath: string;
  previewUrl: string;
  replacedImageCount: number;
  contentChars: number;
};

export type RecentNewsletterTemplate = {
  id: string;
  previewPath: string;
  previewUrl: string | null;
  contentChars: number;
  createdAt: string;
};

type PreparedSlide = {
  width: number;
  height: number;
  webp: Buffer;
};

function stripExtension(fileName: string) {
  return fileName.replace(/\.[a-z0-9]+$/i, "");
}

/**
 * Filename stem for `newsletter/template_previews/[name].webp`.
 * Prefer an explicit name, then the MJML file name.
 */
export function newsletterPreviewFileStem(input: {
  name?: string | null;
  fileName?: string | null;
}) {
  const source =
    input.name?.trim() ||
    stripExtension(input.fileName?.trim() ?? "") ||
    "newsletter-template";

  const slug = source
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return slug || "newsletter-template";
}

export function newsletterPreviewObjectKey(stem: string, attempt = 1) {
  const suffix = attempt <= 1 ? "" : `-${attempt}`;
  return `${NEWSLETTER_PREVIEW_DIRECTORY}/${stem}${suffix}.webp`;
}

function isWebp(bytes: Buffer) {
  return (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

async function encodePreviewWebp(bytes: Buffer): Promise<PreparedSlide> {
  try {
    const { data, info } = await sharp(bytes, { failOn: "none" })
      .rotate()
      .resize({
        width: PREVIEW_MAX_EDGE,
        height: PREVIEW_MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    if (!info.width || !info.height) {
      throw new DummyTemplateError("Could not read that preview image.", 400);
    }

    return {
      webp: data,
      width: info.width,
      height: info.height,
    };
  } catch (error) {
    if (error instanceof DummyTemplateError) throw error;
    throw new DummyTemplateError(
      "Unsupported preview image. Use JPEG, PNG, GIF, WebP, or AVIF.",
      400,
    );
  }
}

export async function createNewsletterPreviewWebp(bytes: Buffer) {
  const slide = await encodePreviewWebp(bytes);
  if (!isWebp(slide.webp)) {
    throw new DummyTemplateError("Could not encode a WebP preview.", 500);
  }
  return slide;
}

function requiredEnv(name: string, value: string | undefined) {
  const normalized = value?.trim() ?? "";
  if (!normalized) {
    throw new R2ImageUploadError(`${name} is required.`);
  }
  return normalized;
}

function r2PublicBaseUrl() {
  const publicBaseUrl = requiredEnv(
    "R2 public base URL",
    process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL,
  );
  return publicBaseUrl.replace(/\/+$/, "");
}

function createPreviewR2Client() {
  const accountId = requiredEnv(
    "R2 account ID",
    process.env.CLOUDFLARE_R2_ACCOUNT_ID,
  );
  const accessKeyId = requiredEnv(
    "R2 access key ID",
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  );
  const secretAccessKey = requiredEnv(
    "R2 secret access key",
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  );
  const bucket = requiredEnv("R2 bucket", process.env.CLOUDFLARE_R2_BUCKET);
  const publicBaseUrl = r2PublicBaseUrl();

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    maxAttempts: 3,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  return { client, bucket, publicBaseUrl };
}

function isPreconditionFailure(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const candidate = error as {
    name?: unknown;
    $metadata?: { httpStatusCode?: unknown };
  };
  return (
    candidate.name === "PreconditionFailed" ||
    candidate.$metadata?.httpStatusCode === 412
  );
}

function publicUrlForKey(baseUrl: string, key: string) {
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${baseUrl}/${encodedKey}`;
}

async function putPreviewWebp(input: {
  bytes: Buffer;
  stem: string;
}): Promise<{ key: string; url: string }> {
  const { client, bucket, publicBaseUrl } = createPreviewR2Client();
  const contentMd5 = createHash("md5").update(input.bytes).digest("base64");
  const sha256 = createHash("sha256").update(input.bytes).digest("hex");

  for (let attempt = 1; attempt <= 40; attempt += 1) {
    const key = newsletterPreviewObjectKey(input.stem, attempt);
    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: input.bytes,
          ContentType: "image/webp",
          ContentLength: input.bytes.byteLength,
          ContentMD5: contentMd5,
          ContentDisposition: "inline",
          CacheControl: IMMUTABLE_CACHE_CONTROL,
          IfNoneMatch: "*",
          Metadata: { sha256, application: "postpooch-dummy-newsletter" },
        }),
      );
      return { key, url: publicUrlForKey(publicBaseUrl, key) };
    } catch (error) {
      if (isPreconditionFailure(error)) continue;
      throw new R2ImageUploadError("Failed to upload image to R2.", {
        cause: error,
      });
    }
  }

  throw new DummyTemplateError(
    "A newsletter preview with this name already exists too many times. Use a more specific name.",
    409,
  );
}

async function withTransaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await getDbPool().connect();
  try {
    await client.query("begin");
    const result = await work(client);
    await client.query("commit");
    return result;
  } catch (error) {
    try {
      await client.query("rollback");
    } catch {
      // Preserve the original failure; the pool discards broken connections.
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function seedNewsletterTemplate(input: {
  mjmlBytes: Buffer;
  name?: string | null;
  previewImage?: Buffer | null;
  firstFileName?: string | null;
}): Promise<SeededNewsletterTemplate> {
  if (input.mjmlBytes.byteLength === 0) {
    throw new DummyTemplateError("MJML files cannot be empty.", 400);
  }
  if (input.mjmlBytes.byteLength > MAX_MJML_BYTES) {
    throw new DummyTemplateError(
      "MJML files must be 5 MB or smaller.",
      413,
    );
  }
  if (
    input.previewImage &&
    input.previewImage.byteLength > MAX_IMAGE_BYTES
  ) {
    throw new DummyTemplateError("Preview images must be 20 MB or smaller.", 413);
  }

  const rawMjml = parseMjmlDocument(input.mjmlBytes);
  const publicBaseUrl = r2PublicBaseUrl();
  const assetCache = new Map<string, string>();
  const bytesCache = new Map<string, Buffer>();

  const rehosted = await rehostMjmlImageAssets({
    mjml: rawMjml,
    publicBaseUrl,
    cache: assetCache,
    bytesCache,
  });

  const previewSource =
    input.previewImage && input.previewImage.byteLength > 0
      ? input.previewImage
      : await renderMjmlPreviewJpeg(rehosted.mjml, rehosted.assetBytes);

  const stem = newsletterPreviewFileStem({
    name: input.name,
    fileName: input.firstFileName,
  });
  const preview = await createNewsletterPreviewWebp(previewSource);
  const previewUpload = await putPreviewWebp({
    bytes: preview.webp,
    stem,
  });

  const template = await withTransaction(async (client) => {
    const inserted = await client.query<{ id: string }>(
      `
        insert into public.newsletter_templates (
          content,
          preview_img_path
        )
        values ($1, $2)
        returning id
      `,
      [rehosted.mjml, previewUpload.key],
    );
    const row = inserted.rows[0];
    if (!row) {
      throw new DummyTemplateError(
        "Newsletter template insert did not return a row.",
        500,
      );
    }
    return row;
  });

  return {
    id: template.id,
    previewPath: previewUpload.key,
    previewUrl: previewUpload.url,
    replacedImageCount: rehosted.replacedCount,
    contentChars: rehosted.mjml.length,
  };
}

export async function listRecentNewsletterTemplates(limit = 24) {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 48);
  const result = await getDbPool().query<{
    id: string;
    preview_img_path: string | null;
    content: string | null;
    created_at: string;
  }>(
    `
      select
        t.id,
        t.preview_img_path,
        t.content,
        t.created_at::text as created_at
      from public.newsletter_templates as t
      order by t.created_at desc, t.id desc
      limit $1
    `,
    [safeLimit],
  );

  let publicBaseUrl = "";
  try {
    publicBaseUrl = r2PublicBaseUrl();
  } catch {
    publicBaseUrl = "";
  }

  return result.rows.map((row): RecentNewsletterTemplate => {
    const previewPath = row.preview_img_path?.trim() ?? "";
    return {
      id: row.id,
      previewPath,
      previewUrl: publicBaseUrl
        ? socialTemplatePreviewUrl(publicBaseUrl, previewPath)
        : null,
      contentChars: row.content?.length ?? 0,
      createdAt: row.created_at,
    };
  });
}
