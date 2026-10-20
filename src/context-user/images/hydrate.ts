import type { S3Client } from "@aws-sdk/client-s3";

import type { PostingEnvironment } from "../../posting/env";
import { publicUrlForKey } from "../../posting/r2";
import type { ContextSnapshot, CreativeOutput, HandleMaps } from "../contracts";
import type { ContextUserEnvironment } from "../environment";
import { addCandidate } from "../handle-map";
import type { SelectedDesignImage } from "../design-ai";
import { loadR2Image } from "./storage";

export type ContextReferenceImage = {
  assetId: string;
  bytes: Buffer;
  mimeType: string;
};

export async function hydrateContextLinkedImages(input: {
  snapshot: ContextSnapshot;
  maps: HandleMaps;
  r2: S3Client;
  postingEnvironment: PostingEnvironment;
  contextEnvironment: ContextUserEnvironment;
}): Promise<ContextReferenceImage[]> {
  const references: ContextReferenceImage[] = [];
  for (const asset of input.snapshot.linkedAssets) {
    const image = await loadR2Image({
      client: input.r2,
      environment: input.postingEnvironment,
      storageKey: asset.storageKey,
      maxBytes: input.contextEnvironment.imageMaxBytes,
      modelMaxPixels: input.contextEnvironment.modelImageMaxPixels,
    });
    addCandidate(input.maps, {
      source: "user_asset",
      width: image.width,
      height: image.height,
      mimeType: image.mimeType,
      purpose: asset.purpose,
      modelDescription: `Context-linked realtor ${asset.purpose} image`,
      pixels: image.modelBytes,
      sourceBytes: image.bytes,
      durableSource: { source: "user_asset", assetId: asset.id, storageKey: asset.storageKey },
    });
    references.push({ assetId: asset.id, bytes: image.modelBytes, mimeType: image.mimeType });
  }
  return references;
}

export async function hydrateSelectedDesignImages(input: {
  creative: CreativeOutput;
  r2: S3Client;
  postingEnvironment: PostingEnvironment;
  contextEnvironment: ContextUserEnvironment;
}): Promise<SelectedDesignImage[]> {
  const output: SelectedDesignImage[] = [];
  for (const [index, selected] of input.creative.selectedImages.entries()) {
    const image = await loadR2Image({
      client: input.r2,
      environment: input.postingEnvironment,
      storageKey: selected.storageKey,
      maxBytes: input.contextEnvironment.imageMaxBytes,
      modelMaxPixels: input.contextEnvironment.modelImageMaxPixels,
    });
    output.push({
      handle: `IMAGE_${index + 1}`,
      bytes: image.modelBytes,
      mimeType: image.mimeType,
      publicUrl: publicUrlForKey(input.postingEnvironment.r2PublicBaseUrl, selected.storageKey),
      role: selected.role,
      assetId: selected.source === "user_asset" ? selected.assetId : null,
    });
  }
  return output;
}
