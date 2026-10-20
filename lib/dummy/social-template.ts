import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";
import type { PoolClient } from "pg";
import sharp from "sharp";

import { getDbPool } from "@/lib/db/client";
import {
  R2ImageUploadError,
  uploadImageToR2,
} from "@/lib/images/r2";
import { socialTemplatePreviewUrl } from "@/lib/social-templates/preview-url";

import type { PostingEnvironment } from "@/src/posting/env";
import { PostingError } from "@/src/posting/errors";
import type { Json } from "@/src/posting/types";

import {
  collectFabricImageUrls,
  DummyTemplateError,
  looksLikeFabricJson,
  replaceFabricImageUrls,
  stripFabricCrossOrigin,
} from "./fabric-image-urls";
import { rehostFabricImageAssets } from "./rehost-fabric-assets";

export { DummyTemplateError } from "./fabric-image-urls";

/** Matches the object-key prefix the social editor catalog already documents. */
export const TEMPLATE_PREVIEW_DIRECTORY = "social_media/templete_previews";
export const TEMPLATE_MEDIA_DIRECTORY = "social_media/template_media";

export const MAX_TEMPLATE_IMAGES = 10;
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_TEXT_CHARS = 8_000;
export const MEDIA_MAX_EDGE = 4_096;
export const PREVIEW_MAX_EDGE = 1_600;

const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";
const FABRIC_VERSION = "7.4.0";

export type SeededSocialTemplate = {
  id: string;
  previewPath: string;
  previewUrl: string;
  mediaCount: number;
  editorAccessible: boolean;
  automateAccessible: boolean;
};

export type RecentDummyTemplate = {
  id: string;
  caption: string;
  previewPath: string;
  previewUrl: string | null;
  mediaCount: number;
  editorAccessible: boolean;
  automateAccessible: boolean;
  createdAt: string;
};

type PreparedSlide = {
  width: number;
  height: number;
  webp: Buffer;
};

type PreparedFrame = {
  design: Record<string, unknown>;
  /** Original raster bytes when the upload was an image, not Fabric JSON. */
  rasterBytes: Buffer | null;
  assetBytes: Map<string, Buffer>;
};

function firstLine(value: string | null | undefined) {
  return value?.trim().split(/\r?\n/, 1)[0]?.trim() ?? "";
}

function stripExtension(fileName: string) {
  return fileName.replace(/\.[a-z0-9]+$/i, "");
}

/**
 * Filename stem for `social_media/templete_previews/[name].webp`.
 * Prefer an explicit name, then the caption, then the first file name.
 */
export function previewFileStem(input: {
  name?: string | null;
  caption?: string | null;
  fileName?: string | null;
}) {
  const source =
    input.name?.trim() ||
    firstLine(input.caption) ||
    stripExtension(input.fileName?.trim() ?? "") ||
    "template";

  const slug = source
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return slug || "template";
}

export function previewObjectKey(stem: string, attempt = 1) {
  const suffix = attempt <= 1 ? "" : `-${attempt}`;
  return `${TEMPLATE_PREVIEW_DIRECTORY}/${stem}${suffix}.webp`;
}

export function createTemplateImageDesign(input: {
  src: string;
  width: number;
  height: number;
}) {
  const width = Math.round(input.width);
  const height = Math.round(input.height);

  return {
    version: FABRIC_VERSION,
    objects: [
      {
        type: "Image",
        version: FABRIC_VERSION,
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
        width,
        height,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        opacity: 1,
        visible: true,
        strokeWidth: 0,
        src: input.src,
        crossOrigin: "anonymous",
        filters: [],
        cropX: 0,
        cropY: 0,
      },
    ],
    background: "#FFFFFF",
    width,
    height,
  };
}

function isWebp(bytes: Buffer) {
  return (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  );
}

async function encodeWebp(input: {
  bytes: Buffer;
  maxEdge: number;
  quality: number;
}): Promise<PreparedSlide> {
  try {
    const { data, info } = await sharp(input.bytes, { failOn: "none" })
      .rotate()
      .resize({
        width: input.maxEdge,
        height: input.maxEdge,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: input.quality, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    if (!info.width || !info.height) {
      throw new DummyTemplateError("Could not read that image.", 400);
    }

    return {
      webp: data,
      width: info.width,
      height: info.height,
    };
  } catch (error) {
    if (error instanceof DummyTemplateError) throw error;
    throw new DummyTemplateError(
      "Unsupported image format. Use JPEG, PNG, GIF, WebP, or AVIF.",
      400,
    );
  }
}

export async function createTemplatePreviewWebp(bytes: Buffer) {
  const slide = await encodeWebp({
    bytes,
    maxEdge: PREVIEW_MAX_EDGE,
    quality: 82,
  });
  if (!isWebp(slide.webp)) {
    throw new DummyTemplateError("Could not encode a WebP preview.", 500);
  }
  return slide;
}

export async function createTemplateMediaWebp(bytes: Buffer) {
  return encodeWebp({
    bytes,
    maxEdge: MEDIA_MAX_EDGE,
    quality: 86,
  });
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
    const key = previewObjectKey(input.stem, attempt);
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
          Metadata: { sha256, application: "postpooch-dummy" },
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
    "A template preview with this name already exists too many times. Use a more specific name.",
    409,
  );
}

function normalizeOptionalText(value: string | null | undefined) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_TEXT_CHARS) {
    throw new DummyTemplateError(
      `Text must be ${MAX_TEXT_CHARS.toLocaleString()} characters or fewer.`,
      400,
    );
  }
  return trimmed;
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

function dummyFabricRenderEnvironment(
  publicBaseUrl: string,
): PostingEnvironment {
  let host: string;
  try {
    host = new URL(publicBaseUrl).hostname.toLowerCase();
  } catch {
    throw new DummyTemplateError("R2 public base URL is not valid.", 500);
  }

  return {
    databaseUrl: "postgresql://127.0.0.1/unused",
    zernioApiKey: "unused",
    r2AccountId: "unused",
    r2AccessKeyId: "unused",
    r2SecretAccessKey: "unused",
    r2Bucket: "unused",
    r2PublicBaseUrl: publicBaseUrl,
    fabricDefaultWidth: 1080,
    fabricDefaultHeight: 1350,
    fabricMaxJsonBytes: 50_000_000,
    fabricMaxPixels: 16_777_216,
    fabricMaxObjects: 1_000,
    fabricRenderTimeoutMs: 30_000,
    fabricJpegQuality: 0.92,
    fabricJpegBackground: "#ffffff",
    fabricAllowedImageHosts: [host],
    postingLeaseSeconds: 300,
  };
}

async function documentWithInlinedImages(
  document: Record<string, unknown>,
  assetBytes: ReadonlyMap<string, Buffer>,
) {
  const clone = stripFabricCrossOrigin(structuredClone(document));
  const urls = collectFabricImageUrls(clone);
  const mapping = new Map<string, string>();

  for (const url of urls) {
    if (url.startsWith("data:")) continue;
    const bytes = assetBytes.get(url);
    if (!bytes) {
      throw new DummyTemplateError(
        "Could not render a preview because a Fabric image was missing.",
        500,
      );
    }
    try {
      const jpeg = await sharp(bytes, { failOn: "none" })
        .jpeg({ quality: 85 })
        .toBuffer();
      mapping.set(url, `data:image/jpeg;base64,${jpeg.toString("base64")}`);
    } catch {
      throw new DummyTemplateError(
        "Could not decode a Fabric image while rendering the preview.",
        400,
      );
    }
  }

  return replaceFabricImageUrls(clone, mapping);
}

/**
 * Rasterize the composed Fabric canvas for `templates.preview_path`.
 * Clones the document so font normalization cannot mutate stored JSON.
 * Remote Image `src` values are inlined from already-downloaded bytes so
 * Node canvas does not depend on R2 CORS.
 */
export async function renderSeededFabricPreview(
  document: Record<string, unknown>,
  publicBaseUrl: string,
  assetBytes: ReadonlyMap<string, Buffer> = new Map(),
): Promise<Buffer> {
  const { renderFabricJpeg } = await import("@/src/posting/fabric-renderer");
  try {
    const jpeg = await renderFabricJpeg(
      (await documentWithInlinedImages(document, assetBytes)) as Json,
      dummyFabricRenderEnvironment(publicBaseUrl),
    );
    if (jpeg.byteLength < 32 || jpeg[0] !== 0xff || jpeg[1] !== 0xd8) {
      throw new DummyTemplateError(
        "Could not render a preview of that Fabric canvas.",
        500,
      );
    }
    return jpeg;
  } catch (error) {
    if (error instanceof DummyTemplateError) throw error;
    const message =
      error instanceof PostingError || error instanceof Error
        ? error.message
        : "Fabric rendering failed";
    throw new DummyTemplateError(
      `Could not render a preview of that Fabric canvas. ${message}`,
      error instanceof PostingError ? 400 : 500,
    );
  }
}

function parseFabricDocument(bytes: Buffer): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(bytes.toString("utf8").replace(/^\uFEFF/, ""));
  } catch {
    throw new DummyTemplateError(
      "That JSON file is not valid Fabric canvas data.",
      400,
    );
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new DummyTemplateError(
      "Fabric JSON must be an object with an objects array.",
      400,
    );
  }
  const document = parsed as Record<string, unknown>;
  if (!Array.isArray(document.objects)) {
    throw new DummyTemplateError(
      "Fabric JSON must include an objects array.",
      400,
    );
  }
  return document;
}

async function prepareFrameDesign(
  bytes: Buffer,
  cache: Map<string, string>,
  bytesCache: Map<string, Buffer>,
  publicBaseUrl: string,
): Promise<PreparedFrame> {
  if (looksLikeFabricJson(bytes)) {
    const rehosted = await rehostFabricImageAssets({
      document: parseFabricDocument(bytes),
      publicBaseUrl,
      cache,
      bytesCache,
    });
    return {
      design: rehosted.document,
      rasterBytes: null,
      assetBytes: rehosted.assetBytes,
    };
  }

  const slide = await createTemplateMediaWebp(bytes);
  const uploaded = await uploadImageToR2({
    image: slide.webp,
    directory: TEMPLATE_MEDIA_DIRECTORY,
    maxBytes: MAX_IMAGE_BYTES,
  });
  const wrapped = createTemplateImageDesign({
    src: uploaded.url,
    width: slide.width,
    height: slide.height,
  });
  const rehosted = await rehostFabricImageAssets({
    document: wrapped,
    publicBaseUrl,
    cache,
    bytesCache,
  });
  return {
    design: rehosted.document,
    rasterBytes: bytes,
    assetBytes: rehosted.assetBytes,
  };
}

export async function seedSocialTemplate(input: {
  images: Buffer[];
  name?: string | null;
  text?: string | null;
  aiPrompt?: string | null;
  editorAccessible: boolean;
  automateAccessible: boolean;
  firstFileName?: string | null;
}): Promise<SeededSocialTemplate> {
  if (input.images.length === 0) {
    throw new DummyTemplateError("Choose at least one image or Fabric JSON frame.", 400);
  }
  if (input.images.length > MAX_TEMPLATE_IMAGES) {
    throw new DummyTemplateError(
      `Templates can have at most ${MAX_TEMPLATE_IMAGES} images.`,
      400,
    );
  }

  for (const image of input.images) {
    if (image.byteLength === 0) {
      throw new DummyTemplateError("Frames cannot be empty.", 400);
    }
    if (image.byteLength > MAX_IMAGE_BYTES) {
      throw new DummyTemplateError(
        "Images must be 20 MB or smaller.",
        413,
      );
    }
  }

  const text = normalizeOptionalText(input.text);
  const aiPrompt = normalizeOptionalText(input.aiPrompt);
  const stem = previewFileStem({
    name: input.name,
    caption: text,
    fileName: input.firstFileName,
  });
  const publicBaseUrl = r2PublicBaseUrl();
  const assetCache = new Map<string, string>();
  const bytesCache = new Map<string, Buffer>();

  const frames: PreparedFrame[] = [];
  for (const bytes of input.images) {
    frames.push(
      await prepareFrameDesign(bytes, assetCache, bytesCache, publicBaseUrl),
    );
  }

  const firstFrame = frames[0];
  if (!firstFrame) {
    throw new DummyTemplateError("Choose at least one image or Fabric JSON frame.", 400);
  }

  const previewSource =
    firstFrame.rasterBytes ??
    (await renderSeededFabricPreview(
      firstFrame.design,
      publicBaseUrl,
      firstFrame.assetBytes,
    ));
  const preview = await createTemplatePreviewWebp(previewSource);

  const previewUpload = await putPreviewWebp({
    bytes: preview.webp,
    stem,
  });

  const template = await withTransaction(async (client) => {
    const inserted = await client.query<{ id: string }>(
      `
        insert into public.templates (
          text,
          ai_prompt,
          automate_accessible,
          editor_accessible,
          preview_path
        )
        values ($1, $2, $3, $4, $5)
        returning id
      `,
      [
        text,
        aiPrompt,
        input.automateAccessible,
        input.editorAccessible,
        previewUpload.key,
      ],
    );
    const row = inserted.rows[0];
    if (!row) {
      throw new DummyTemplateError("Template insert did not return a row.", 500);
    }

    for (const [index, frame] of frames.entries()) {
      await client.query(
        `
          insert into public.media (template_id, display_order, image_design)
          values ($1::uuid, $2, $3::jsonb)
        `,
        [row.id, index + 1, JSON.stringify(frame.design)],
      );
    }

    return row;
  });

  return {
    id: template.id,
    previewPath: previewUpload.key,
    previewUrl: previewUpload.url,
    mediaCount: frames.length,
    editorAccessible: input.editorAccessible,
    automateAccessible: input.automateAccessible,
  };
}

export async function listRecentDummyTemplates(limit = 24) {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 48);
  const result = await getDbPool().query<{
    id: string;
    text: string | null;
    preview_path: string | null;
    editor_accessible: boolean | null;
    automate_accessible: boolean | null;
    created_at: string;
    media_count: number;
  }>(
    `
      select
        t.id,
        t.text,
        t.preview_path,
        t.editor_accessible,
        t.automate_accessible,
        t.created_at::text as created_at,
        (
          select count(*)::int
          from public.media as m
          where m.template_id = t.id
        ) as media_count
      from public.templates as t
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

  return result.rows.map((row): RecentDummyTemplate => {
    const previewPath = row.preview_path?.trim() ?? "";
    return {
      id: row.id,
      caption: row.text?.trim() ?? "",
      previewPath,
      previewUrl: publicBaseUrl
        ? socialTemplatePreviewUrl(publicBaseUrl, previewPath)
        : null,
      mediaCount: row.media_count,
      editorAccessible: row.editor_accessible === true,
      automateAccessible: row.automate_accessible === true,
      createdAt: row.created_at,
    };
  });
}
