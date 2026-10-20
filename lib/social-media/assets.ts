import "server-only";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import sharp, { type Metadata } from "sharp";

import { getDbPool } from "@/lib/db/client";
import { deleteImageFromR2, uploadImageToR2 } from "@/lib/images/r2";

export const SOCIAL_ASSET_PURPOSES = [
  "headshot", "logo", "office", "listing", "community", "other",
] as const;
export const SOCIAL_ASSET_MAX_BYTES = 20 * 1024 * 1024;
export type SocialAssetPurpose = typeof SOCIAL_ASSET_PURPOSES[number];

export type SocialMediaAsset = {
  id: string;
  purpose: SocialAssetPurpose;
  originalFilename: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  width: number;
  height: number;
  createdAt: string;
};

export class SocialMediaAssetError extends Error {
  constructor(message: string, readonly status = 400, options?: ErrorOptions) {
    super(message, options);
    this.name = "SocialMediaAssetError";
  }
}

function parsePurpose(value: string): SocialAssetPurpose {
  if ((SOCIAL_ASSET_PURPOSES as readonly string[]).includes(value)) {
    return value as SocialAssetPurpose;
  }
  throw new SocialMediaAssetError("Choose a valid image purpose.");
}

function safeFilename(value: string): string {
  const filename = value.trim().slice(0, 255);
  if (!filename) throw new SocialMediaAssetError("The image filename is required.");
  return filename;
}

export async function createSocialMediaAsset(input: {
  profileId: string;
  purpose: string;
  originalFilename: string;
  bytes: Buffer;
}): Promise<SocialMediaAsset> {
  const purpose = parsePurpose(input.purpose);
  const originalFilename = safeFilename(input.originalFilename);
  let metadata: Metadata;
  try {
    metadata = await sharp(input.bytes, { limitInputPixels: 40_000_000, failOn: "error" }).metadata();
  } catch (error) {
    throw new SocialMediaAssetError("The uploaded image could not be decoded safely.", 400, { cause: error });
  }
  if (!metadata.width || !metadata.height || metadata.width > 20_000 || metadata.height > 20_000) {
    throw new SocialMediaAssetError("The uploaded image dimensions are invalid.");
  }
  if (!(metadata.format === "jpeg" || metadata.format === "png" || metadata.format === "webp")) {
    throw new SocialMediaAssetError("Use a JPEG, PNG, or WebP image.");
  }
  const id = randomUUID();
  const uploaded = await uploadImageToR2({
    image: input.bytes,
    directory: `social-media-assets/${input.profileId}/${id}`,
    maxBytes: SOCIAL_ASSET_MAX_BYTES,
  });
  const mimeType = uploaded.contentType;
  if (!(mimeType === "image/jpeg" || mimeType === "image/png" || mimeType === "image/webp")) {
    await deleteImageFromR2({ key: uploaded.key }).catch(() => undefined);
    throw new SocialMediaAssetError("Use a JPEG, PNG, or WebP image.");
  }
  try {
    const result = await getDbPool().query<{
      id: string; purpose: SocialAssetPurpose; original_filename: string; mime_type: SocialMediaAsset["mimeType"];
      width: number; height: number; created_at: Date;
    }>(
      `insert into public.social_media_assets
        (id,profile_id,storage_key,purpose,original_filename,mime_type,width,height)
       values ($1::uuid,$2::uuid,$3,$4,$5,$6,$7,$8)
       returning id,purpose,original_filename,mime_type,width,height,created_at`,
      [id, input.profileId, uploaded.key, purpose, originalFilename, mimeType, metadata.width, metadata.height],
    );
    const row = result.rows[0];
    return { id: row.id, purpose: row.purpose, originalFilename: row.original_filename,
      mimeType: row.mime_type, width: row.width, height: row.height, createdAt: row.created_at.toISOString() };
  } catch (error) {
    await deleteImageFromR2({ key: uploaded.key }).catch(() => undefined);
    throw new SocialMediaAssetError("The uploaded image could not be saved.", 500, { cause: error });
  }
}

export async function listSocialMediaAssets(profileId: string): Promise<SocialMediaAsset[]> {
  const result = await getDbPool().query<{
    id: string; purpose: SocialAssetPurpose; original_filename: string; mime_type: SocialMediaAsset["mimeType"];
    width: number; height: number; created_at: Date;
  }>(
    `select id,purpose,original_filename,mime_type,width,height,created_at
     from public.social_media_assets where profile_id=$1::uuid and deleted_at is null
     order by created_at desc,id desc`, [profileId]);
  return result.rows.map((row) => ({ id: row.id, purpose: row.purpose,
    originalFilename: row.original_filename, mimeType: row.mime_type,
    width: row.width, height: row.height, createdAt: row.created_at.toISOString() }));
}

let readClient: S3Client | undefined;
function getReadClient(): S3Client {
  if (!readClient) {
    readClient = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? "",
      },
    });
  }
  return readClient;
}

export async function loadOwnedAssetBytes(profileId: string, assetId: string): Promise<{
  asset: { id: string; storageKey: string; purpose: SocialAssetPurpose; mimeType: SocialMediaAsset["mimeType"] };
  bytes: Buffer;
} | null> {
  const result = await getDbPool().query<{
    id: string; storage_key: string; purpose: SocialAssetPurpose; mime_type: SocialMediaAsset["mimeType"];
  }>(
    `select id,storage_key,purpose,mime_type from public.social_media_assets
     where id=$1::uuid and profile_id=$2::uuid and deleted_at is null`, [assetId, profileId]);
  const row = result.rows[0];
  if (!row) return null;
  const output = await getReadClient().send(new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET,
    Key: row.storage_key,
  }));
  if (!output.Body || !("transformToByteArray" in output.Body)) {
    throw new SocialMediaAssetError("The stored image could not be read.", 502);
  }
  const bytes = Buffer.from(await output.Body.transformToByteArray());
  return { asset: { id: row.id, storageKey: row.storage_key, purpose: row.purpose, mimeType: row.mime_type }, bytes };
}
