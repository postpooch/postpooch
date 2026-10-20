import { GetObjectCommand, PutObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";

import type { PostingEnvironment } from "../../posting/env";
import { PostingError } from "../../posting/errors";
import { publicUrlForKey } from "../../posting/r2";
import { validateImageBytes, type ValidatedImage } from "./validate";

async function bodyToBuffer(body: unknown): Promise<Buffer> {
  if (body && typeof body === "object" && "transformToByteArray" in body) {
    return Buffer.from(await (body as { transformToByteArray(): Promise<Uint8Array> }).transformToByteArray());
  }
  throw new PostingError("R2 returned an unreadable image body", true);
}

export async function loadR2Image(input: {
  client: S3Client;
  environment: PostingEnvironment;
  storageKey: string;
  maxBytes: number;
  modelMaxPixels: number;
}): Promise<ValidatedImage> {
  try {
    const output = await input.client.send(new GetObjectCommand({
      Bucket: input.environment.r2Bucket,
      Key: input.storageKey,
    }));
    return await validateImageBytes(await bodyToBuffer(output.Body), {
      maxBytes: input.maxBytes,
      modelMaxPixels: input.modelMaxPixels,
    });
  } catch (error) {
    if (error instanceof PostingError) throw error;
    throw new PostingError("Could not load realtor image from R2", true, { cause: error });
  }
}

export async function downloadExternalImage(input: {
  url: string;
  maxBytes: number;
  modelMaxPixels: number;
  fetcher?: typeof fetch;
  allowedHosts?: readonly string[];
}): Promise<ValidatedImage> {
  const url = new URL(input.url);
  if (url.protocol !== "https:") throw new PostingError("External image must use HTTPS", false);
  const allowedHosts = new Set(input.allowedHosts?.map((host) => host.toLowerCase()) ?? []);
  if (allowedHosts.size && !allowedHosts.has(url.hostname.toLowerCase())) {
    throw new PostingError("External image host is not allowed", false);
  }
  const response = await (input.fetcher ?? fetch)(url, { signal: AbortSignal.timeout(30_000) });
  if (allowedHosts.size && !allowedHosts.has(new URL(response.url || url).hostname.toLowerCase())) {
    throw new PostingError("External image redirected to an untrusted host", false);
  }
  if (!response.ok) {
    throw new PostingError(`External image returned HTTP ${response.status}`, response.status >= 500 || response.status === 429);
  }
  const length = Number(response.headers.get("content-length") ?? "0");
  if (length > input.maxBytes) throw new PostingError("External image exceeds byte limit", false);
  const bytes = Buffer.from(await response.arrayBuffer());
  return validateImageBytes(bytes, { maxBytes: input.maxBytes, modelMaxPixels: input.modelMaxPixels });
}

export async function materializeDiscoveredImage(input: {
  client: S3Client;
  environment: PostingEnvironment;
  postingRunId: string;
  provider: string;
  providerAssetId: string;
  image: ValidatedImage;
}): Promise<{ storageKey: string; publicUrl: string }> {
  const hash = createHash("sha256").update(input.image.bytes).digest("hex");
  const extension = input.image.mimeType === "image/png" ? "png" : input.image.mimeType === "image/webp" ? "webp" : "jpg";
  const safeProviderId = input.providerAssetId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 100);
  const safeProvider = input.provider.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 100);
  const storageKey = `posting-runs/${input.postingRunId}/discovered-images/${safeProvider}-${safeProviderId}-${hash.slice(0, 32)}.${extension}`;
  await input.client.send(new PutObjectCommand({
    Bucket: input.environment.r2Bucket,
    Key: storageKey,
    Body: input.image.bytes,
    ContentType: input.image.mimeType,
    ContentLength: input.image.bytes.length,
    CacheControl: "public, max-age=31536000, immutable",
    Metadata: { application: "postpooch", source: "discovered_image", provider: safeProvider, sha256: hash },
  }));
  return { storageKey, publicUrl: publicUrlForKey(input.environment.r2PublicBaseUrl, storageKey) };
}
