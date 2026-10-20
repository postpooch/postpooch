import sharp, { type Metadata } from "sharp";

import { PostingError } from "../../posting/errors";

export type ValidatedImage = {
  bytes: Buffer;
  modelBytes: Buffer;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  width: number;
  height: number;
};

function mimeFromFormat(format?: string): ValidatedImage["mimeType"] {
  if (format === "jpeg") return "image/jpeg";
  if (format === "png") return "image/png";
  if (format === "webp") return "image/webp";
  throw new PostingError("Image must be JPEG, PNG, or WebP", false);
}

export async function validateImageBytes(
  bytes: Buffer,
  limits: { maxBytes: number; modelMaxPixels: number },
): Promise<ValidatedImage> {
  if (!bytes.length || bytes.length > limits.maxBytes) {
    throw new PostingError(`Image bytes must be between 1 and ${limits.maxBytes}`, false);
  }
  let metadata: Metadata;
  try {
    metadata = await sharp(bytes, { limitInputPixels: 40_000_000, failOn: "error" }).metadata();
  } catch (error) {
    throw new PostingError("Image bytes could not be decoded safely", false, { cause: error });
  }
  if (!metadata.width || !metadata.height) throw new PostingError("Image dimensions are missing", false);
  const mimeType = mimeFromFormat(metadata.format);
  const scale = Math.min(1, Math.sqrt(limits.modelMaxPixels / (metadata.width * metadata.height)));
  const modelBytes = scale < 1
    ? await sharp(bytes).resize({
        width: Math.max(1, Math.floor(metadata.width * scale)),
        height: Math.max(1, Math.floor(metadata.height * scale)),
        fit: "inside",
        withoutEnlargement: true,
      }).jpeg({ quality: 85 }).toBuffer()
    : bytes;
  return { bytes, modelBytes, mimeType, width: metadata.width, height: metadata.height };
}

export function imageDataUrl(bytes: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}
