import type { S3Client } from "@aws-sdk/client-s3";

import type { PostingEnvironment } from "../../posting/env";
import { PostingError } from "../../posting/errors";
import { addCandidate } from "../handle-map";
import type { ContextUserEnvironment } from "../environment";
import type { HandleMaps, ImageCandidate } from "../contracts";
import { ContextUserRepository } from "../repository";
import { downloadExternalImage, loadR2Image } from "../images/storage";
import type { ImageDiscoveryService } from "./image-discovery";

export class BoundedImageTools {
  private calls = 0;

  constructor(private readonly dependencies: {
    repository: ContextUserRepository;
    r2: S3Client;
    postingEnvironment: PostingEnvironment;
    contextEnvironment: ContextUserEnvironment;
    imageDiscovery: ImageDiscoveryService;
    profileId: string;
    maps: HandleMaps;
  }) {}

  get callsUsed(): number { return this.calls; }

  private useCall(): void {
    if (this.calls >= this.dependencies.contextEnvironment.imageToolCallLimit) {
      throw new PostingError("The six-call image-tool budget is exhausted", false);
    }
    this.calls += 1;
  }

  async getUserImages(input: {
    purposes?: string[];
    limit?: number;
  }): Promise<ImageCandidate[]> {
    this.useCall();
    const assets = await this.dependencies.repository.listUserAssets({
      profileId: this.dependencies.profileId,
      purposes: input.purposes,
      limit: Math.min(10, Math.max(1, input.limit ?? 6)),
    });
    const candidates: ImageCandidate[] = [];
    for (const asset of assets) {
      const image = await loadR2Image({
        client: this.dependencies.r2,
        environment: this.dependencies.postingEnvironment,
        storageKey: asset.storageKey,
        maxBytes: this.dependencies.contextEnvironment.imageMaxBytes,
        modelMaxPixels: this.dependencies.contextEnvironment.modelImageMaxPixels,
      });
      candidates.push(addCandidate(this.dependencies.maps, {
        source: "user_asset",
        width: image.width,
        height: image.height,
        mimeType: image.mimeType,
        purpose: asset.purpose,
        modelDescription: `Realtor-owned ${asset.purpose} image`,
        pixels: image.modelBytes,
        sourceBytes: image.bytes,
        durableSource: { source: "user_asset", assetId: asset.id, storageKey: asset.storageKey },
      }));
    }
    return candidates;
  }

  async findImages(input: {
    query: string;
    orientation?: "landscape" | "portrait" | "square";
    limit?: number;
  }): Promise<ImageCandidate[]> {
    this.useCall();
    const results = await this.dependencies.imageDiscovery.findImages({
      query: input.query,
      orientation: input.orientation,
      maxPhotos: Math.min(10, Math.max(1, input.limit ?? 6)),
    });
    const candidates: ImageCandidate[] = [];
    for (const result of results) {
      const image = await downloadExternalImage({
        url: result.downloadUrl,
        maxBytes: this.dependencies.contextEnvironment.imageMaxBytes,
        modelMaxPixels: this.dependencies.contextEnvironment.modelImageMaxPixels,
        allowedHosts: result.downloadAllowedHosts,
      });
      candidates.push(addCandidate(this.dependencies.maps, {
        source: "discovered_image",
        width: image.width,
        height: image.height,
        mimeType: image.mimeType,
        modelDescription: result.description,
        pixels: image.modelBytes,
        sourceBytes: image.bytes,
        durableSource: {
          source: "discovered_image",
          provider: result.provider,
          downloadUrl: result.downloadUrl,
          providerAssetId: result.providerAssetId,
          providerPageUrl: result.providerPageUrl,
          creatorName: result.creatorName,
          creatorUrl: result.creatorUrl,
        },
      }));
    }
    return candidates;
  }
}
