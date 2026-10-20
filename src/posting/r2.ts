import { PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";

import type { PostingEnvironment } from "./env";
import type { MediaRow, UploadedMedia } from "./types";

export function objectKeyForMedia(input: {
  scheduleId: string;
  occurrenceAt: string;
  media: MediaRow;
  contentHash: string;
}): string {
  const occurrenceMillis = new Date(input.occurrenceAt).getTime();
  return [
    "posts",
    input.scheduleId,
    String(occurrenceMillis),
    `${input.media.display_order}-${input.media.id}-${input.contentHash.slice(0, 32)}.jpg`,
  ].join("/");
}

export function sha256(value: Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export function publicUrlForKey(baseUrl: string, key: string): string {
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${baseUrl.replace(/\/+$/, "")}/${encodedKey}`;
}

export async function uploadJpegToR2(input: {
  client: S3Client;
  environment: PostingEnvironment;
  key: string;
  jpeg: Buffer;
}): Promise<UploadedMedia> {
  await input.client.send(
    new PutObjectCommand({
      Bucket: input.environment.r2Bucket,
      Key: input.key,
      Body: input.jpeg,
      ContentType: "image/jpeg",
      ContentLength: input.jpeg.byteLength,
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: {
        application: "postpooch",
      },
    }),
  );

  return {
    key: input.key,
    url: publicUrlForKey(input.environment.r2PublicBaseUrl, input.key),
  };
}
