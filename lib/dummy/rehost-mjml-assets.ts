import { R2ImageUploadError, uploadImageToR2 } from "@/lib/images/r2";

import {
  collectMjmlImageUrls,
  DummyTemplateError,
  replaceMjmlImageUrls,
} from "./mjml-image-urls";
import {
  fetchFabricImageBytes,
  isAlreadyOnOurR2,
} from "./rehost-fabric-assets";

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

export const NEWSLETTER_INNER_ASSET_DIRECTORY =
  "postpooch-images/newsletter/media_inner_assets";

const MAX_INNER_ASSETS = 60;

export type RehostMjmlImageAssetsInput = {
  mjml: string;
  publicBaseUrl: string;
  cache?: Map<string, string>;
  bytesCache?: Map<string, Buffer>;
  fetchImage?: (url: string) => Promise<Buffer>;
  uploadImage?: (bytes: Buffer) => Promise<{ url: string }>;
};

export type RehostMjmlImageAssetsResult = {
  mjml: string;
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

async function defaultUpload(bytes: Buffer) {
  return uploadImageToR2({
    image: bytes,
    directory: NEWSLETTER_INNER_ASSET_DIRECTORY,
    maxBytes: MAX_IMAGE_BYTES,
  });
}

export async function rehostMjmlImageAssets(
  input: RehostMjmlImageAssetsInput,
): Promise<RehostMjmlImageAssetsResult> {
  const publicBaseUrl = requiredPublicBaseUrl(input.publicBaseUrl);
  const urls = collectMjmlImageUrls(input.mjml);
  if (urls.length > MAX_INNER_ASSETS) {
    throw new DummyTemplateError(
      `An MJML template can reference at most ${MAX_INNER_ASSETS} images.`,
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
    mjml: replaceMjmlImageUrls(input.mjml, cache),
    replacedCount,
    firstFetchedImage,
    assetBytes: bytesCache,
  };
}
