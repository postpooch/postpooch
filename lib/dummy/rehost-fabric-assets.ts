import { R2ImageUploadError, uploadImageToR2 } from "@/lib/images/r2";

import {
  collectFabricImageUrls,
  DummyTemplateError,
  replaceFabricImageUrls,
} from "./fabric-image-urls";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

export const INNER_ASSET_DIRECTORY =
  "postpooch-images/social_media/media_inner_assets";

const FETCH_TIMEOUT_MS = 20_000;
const MAX_INNER_ASSETS = 40;

export type RehostFabricImageAssetsInput = {
  document: Record<string, unknown>;
  publicBaseUrl: string;
  cache?: Map<string, string>;
  bytesCache?: Map<string, Buffer>;
  fetchImage?: (url: string) => Promise<Buffer>;
  uploadImage?: (bytes: Buffer) => Promise<{ url: string }>;
};

export type RehostFabricImageAssetsResult = {
  document: Record<string, unknown>;
  replacedCount: number;
  firstFetchedImage: Buffer | null;
  assetBytes: Map<string, Buffer>;
};

function requiredPublicBaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) {
    throw new R2ImageUploadError("R2 public base URL is required.");
  }
  return trimmed;
}

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) {
    return false;
  }
  const [a, b] = parts;
  if (a === undefined || b === undefined) return false;
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31)
  );
}

export function isBlockedAssetHost(hostname: string) {
  const host = hostname.trim().toLowerCase().replace(/\.$/, "");
  if (!host) return true;
  if (host === "localhost" || host.endsWith(".localhost") || host === "::1") {
    return true;
  }
  if (host === "metadata.google.internal") return true;
  return isPrivateIpv4(host);
}

export function isAlreadyOnOurR2(url: string, publicBaseUrl: string) {
  const ours = hostnameOf(requiredPublicBaseUrl(publicBaseUrl));
  const theirs = hostnameOf(url);
  return Boolean(ours && theirs && ours === theirs);
}

function decodeDataImage(url: string) {
  const comma = url.indexOf(",");
  if (comma < 0) {
    throw new DummyTemplateError("Inline Fabric image data is not valid.", 400);
  }
  try {
    return Buffer.from(url.slice(comma + 1), "base64");
  } catch {
    throw new DummyTemplateError("Inline Fabric image data is not valid.", 400);
  }
}

export async function fetchFabricImageBytes(url: string): Promise<Buffer> {
  const trimmed = url.trim();
  if (/^data:image\//i.test(trimmed)) {
    const bytes = decodeDataImage(trimmed);
    if (bytes.byteLength === 0) {
      throw new DummyTemplateError("A Fabric image asset was empty.", 400);
    }
    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      throw new DummyTemplateError("Images must be 20 MB or smaller.", 413);
    }
    return bytes;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new DummyTemplateError(
      "A Fabric image used a URL that is not valid.",
      400,
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new DummyTemplateError(
      "Fabric image assets must use HTTP(S) or data:image URLs.",
      400,
    );
  }
  if (isBlockedAssetHost(parsed.hostname)) {
    throw new DummyTemplateError(
      "Fabric image assets cannot be loaded from a private host.",
      400,
    );
  }

  let response: Response;
  try {
    response = await fetch(parsed, {
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif,*/*;q=0.8",
        "User-Agent": "PostPoochTemplateSeeder/1.0",
      },
    });
  } catch {
    throw new DummyTemplateError(
      `Could not download a Fabric image from ${parsed.hostname}.`,
      502,
    );
  }

  if (!response.ok) {
    throw new DummyTemplateError(
      `Could not download a Fabric image from ${parsed.hostname} (${response.status}).`,
      502,
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength === 0) {
    throw new DummyTemplateError("A Fabric image asset was empty.", 400);
  }
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new DummyTemplateError("Images must be 20 MB or smaller.", 413);
  }
  return bytes;
}

async function defaultUpload(bytes: Buffer) {
  return uploadImageToR2({
    image: bytes,
    directory: INNER_ASSET_DIRECTORY,
    maxBytes: MAX_IMAGE_BYTES,
  });
}

export async function rehostFabricImageAssets(
  input: RehostFabricImageAssetsInput,
): Promise<RehostFabricImageAssetsResult> {
  const publicBaseUrl = requiredPublicBaseUrl(input.publicBaseUrl);
  const urls = collectFabricImageUrls(input.document);
  if (urls.length > MAX_INNER_ASSETS) {
    throw new DummyTemplateError(
      `A frame can reference at most ${MAX_INNER_ASSETS} images.`,
      400,
    );
  }

  const cache = input.cache ?? new Map<string, string>();
  const bytesCache = input.bytesCache ?? new Map<string, Buffer>();
  const fetchImage = input.fetchImage ?? fetchFabricImageBytes;
  const uploadImage = input.uploadImage ?? defaultUpload;
  let firstFetchedImage: Buffer | null = null;
  let replacedCount = 0;

  for (const original of urls) {
    if (isAlreadyOnOurR2(original, publicBaseUrl)) {
      if (!bytesCache.has(original)) {
        bytesCache.set(original, await fetchImage(original));
      }
      continue;
    }

    const cached = cache.get(original);
    if (cached) {
      const bytes = bytesCache.get(original) ?? bytesCache.get(cached);
      if (bytes) {
        bytesCache.set(original, bytes);
        bytesCache.set(cached, bytes);
      }
      replacedCount += 1;
      continue;
    }

    const bytes = await fetchImage(original);
    if (!firstFetchedImage) firstFetchedImage = bytes;
    const uploaded = await uploadImage(bytes);
    cache.set(original, uploaded.url);
    bytesCache.set(original, bytes);
    bytesCache.set(uploaded.url, bytes);
    replacedCount += 1;
  }

  return {
    document: replaceFabricImageUrls(input.document, cache),
    replacedCount,
    firstFetchedImage,
    assetBytes: bytesCache,
  };
}
