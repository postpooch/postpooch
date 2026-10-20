import type { WebhookPayloadReviewNew, WebhookPayloadReviewUpdated } from "@zernio/node";

import { GoogleBusinessRepository } from "@/lib/google-business/repository";
import type {
  GoogleBusinessLocationPatch,
  ProviderRateLimit,
  ProviderSyncSnapshot,
} from "@/lib/google-business/types";
import { R2ImageUploadError, uploadImageToR2 } from "@/lib/images/r2";
import {
  GoogleBusinessProviderError,
  ZernioGoogleBusinessProvider,
} from "@/lib/google-business/zernio-provider";

export class GoogleBusinessAccessError extends Error {
  constructor() {
    super("That Google Business location is not available to this account.");
    this.name = "GoogleBusinessAccessError";
  }
}

const MAX_GOOGLE_BUSINESS_PHOTO_BYTES = 12 * 1024 * 1024;

export type GoogleBusinessPacer = (rateLimit: ProviderRateLimit) => Promise<void>;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isoMonth(date: Date) {
  return date.toISOString().slice(0, 7);
}

export function googleBusinessCallbackUrl(request: Request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) throw new Error("Unable to determine the application URL.");
  const protocol = request.headers.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}/dashboard/google_business/connect/callback`;
}

export function googleBusinessWebhookUrl(request: Request) {
  return new URL("/api/google_business/webhook", googleBusinessCallbackUrl(request)).toString();
}

export class GoogleBusinessService {
  constructor(
    private readonly repository = new GoogleBusinessRepository(),
    private readonly provider = new ZernioGoogleBusinessProvider(),
  ) {}

  getDashboard(profileId: string) {
    return this.repository.getDashboard(profileId);
  }

  startConnection(profileId: string, redirectUrl: string) {
    return this.provider.startConnection({ profileId, redirectUrl });
  }

  async ensureReviewWebhook(url: string) {
    const secret = process.env.ZERNIO_WEBHOOK_SECRET?.trim();
    if (!secret) return false;
    await this.provider.ensureReviewWebhook({ url, secret });
    return true;
  }

  async completeConnection(input: { profileId: string; zernioProfileId: string; accountId: string }) {
    const account = await this.provider.verifyAccount({ profileId: input.zernioProfileId, accountId: input.accountId });
    if (!account || !account.active) throw new GoogleBusinessAccessError();
    const { locations } = await this.provider.listLocations(input.accountId);
    if (!locations.length) throw new Error("No Google Business Profile locations were returned for this account.");
    const connectionId = await this.repository.upsertConnection({
      profileId: input.profileId,
      zernioProfileId: input.zernioProfileId,
      zernioAccountId: input.accountId,
      accountName: account.displayName,
      needsReconnection: account.needsReconnection,
      locations,
    });
    const dashboard = await this.repository.getDashboard(input.profileId);
    return { connectionId, selectedLocationId: dashboard.selectedLocationId };
  }

  async updateLocation(profileId: string, locationId: string, patch: GoogleBusinessLocationPatch) {
    const target = await this.repository.getOwnedTarget(profileId, locationId);
    if (!target) throw new GoogleBusinessAccessError();
    const current = await this.repository.getOwnedLocation(profileId, locationId);
    if (!current) throw new GoogleBusinessAccessError();
    await this.provider.updateLocation(target.zernioAccountId, target.zernioLocationId, patch);
    if (patch.attributes) {
      await this.provider.updateAttributes(target.zernioAccountId, target.zernioLocationId, patch.attributes);
    }
    if (patch.placeActions) {
      await this.provider.reconcilePlaceActions(
        target.zernioAccountId,
        target.zernioLocationId,
        current.placeActions,
        patch.placeActions,
      );
    }
    if (patch.photos) {
      const currentPhotos = await this.repository.listLocationPhotos(locationId);
      const reconciled = await this.provider.reconcileMedia(
        target.zernioAccountId,
        target.zernioLocationId,
        currentPhotos,
        patch.photos,
      );
      const location = await this.repository.applyUserPatch(profileId, locationId, patch);
      if (!location) throw new GoogleBusinessAccessError();
      await this.repository.replaceLocationPhotos(locationId, reconciled.photos);
      return { location, photos: await this.repository.listLocationPhotos(locationId) };
    }
    const location = await this.repository.applyUserPatch(profileId, locationId, patch);
    if (!location) throw new GoogleBusinessAccessError();
    return { location, photos: await this.repository.listLocationPhotos(locationId) };
  }

  async uploadLocationPhoto(profileId: string, locationId: string, image: File) {
    const target = await this.repository.getOwnedTarget(profileId, locationId);
    if (!target) throw new GoogleBusinessAccessError();
    try {
      return await uploadImageToR2({
        image,
        directory: `google-business/${locationId}`,
        maxBytes: MAX_GOOGLE_BUSINESS_PHOTO_BYTES,
      });
    } catch (error) {
      if (error instanceof R2ImageUploadError) throw error;
      throw new R2ImageUploadError("Failed to upload image to R2.", { cause: error });
    }
  }

  async selectLocation(profileId: string, locationId: string) {
    const target = await this.repository.getOwnedTarget(profileId, locationId);
    if (!target) throw new GoogleBusinessAccessError();
    await this.provider.selectLocation({
      accountId: target.zernioAccountId,
      locationId: target.zernioLocationId,
      googleAccountId: target.googleAccountId,
    });
    if (!(await this.repository.selectLocation(profileId, locationId))) throw new GoogleBusinessAccessError();
  }

  async syncLocation(locationId: string, pace: GoogleBusinessPacer) {
    const target = await this.repository.getSyncTarget(locationId);
    if (!target) return { status: "missing" as const };
    const mutationVersion = await this.repository.markSyncStarted(locationId);
    if (mutationVersion === null) return { status: "missing" as const };
    try {
      const snapshot = await this.getSnapshot(target.zernioAccountId, target.zernioLocationId, target.isSelected, pace);
      const current = await this.repository.persistSnapshot(target, mutationVersion, snapshot);
      return { status: current ? "synced" as const : "stale" as const, analyticsAvailable: snapshot.analyticsAvailable };
    } catch (error) {
      await this.repository.markSyncFailed(locationId, error instanceof Error ? error.message : "Unknown sync error");
      throw error;
    }
  }

  private async paced<T extends { rateLimit: ProviderRateLimit }>(operation: () => Promise<T>, pace: GoogleBusinessPacer) {
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const result = await operation();
        await pace(result.rateLimit);
        return result;
      } catch (error) {
        if (!(error instanceof GoogleBusinessProviderError) || !error.retryable || attempt === 4) throw error;
        await pace({ limit: null, remaining: 0, resetAt: null, retryAfterSeconds: error.retryAfterSeconds ?? Math.min(60, 2 ** attempt) });
      }
    }
    throw new Error("Zernio retry loop ended unexpectedly.");
  }

  private async getSnapshot(accountId: string, locationId: string, includeAnalytics: boolean, pace: GoogleBusinessPacer): Promise<ProviderSyncSnapshot> {
    const details = await this.paced(() => this.provider.getLocationDetails(accountId, locationId), pace);
    const reviews = await this.paced(() => this.provider.getReviews(accountId, locationId), pace);
    const media = await this.paced(() => this.provider.getMedia(accountId, locationId), pace);
    const extras = await this.loadProfileExtras(accountId, locationId, pace);
    const metrics: ProviderSyncSnapshot["metrics"] = [];
    const keywords: ProviderSyncSnapshot["keywords"] = [];
    let analyticsAvailable = includeAnalytics;
    if (includeAnalytics) {
      const end = new Date();
      const start = new Date(end);
      start.setUTCDate(start.getUTCDate() - 90);
      const startMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - 11, 1));
      try {
        const performance = await this.paced(() => this.provider.getPerformance(accountId, isoDate(start), isoDate(end)), pace);
        metrics.push(...performance.metrics);
        const search = await this.paced(() => this.provider.getSearchKeywords(accountId, isoMonth(startMonth), isoMonth(end)), pace);
        keywords.push(...search.keywords);
      } catch (error) {
        if (error instanceof GoogleBusinessProviderError && (error.status === 402 || error.status === 403)) {
          analyticsAvailable = false;
        } else {
          throw error;
        }
      }
    }
    return {
      details: details.details,
      reviews: reviews.reviews,
      averageRating: reviews.averageRating,
      reviewCount: reviews.reviewCount,
      metrics,
      keywords,
      media: media.media,
      mediaComplete: media.complete,
      attributes: extras.attributes,
      placeActions: extras.placeActions,
      analyticsAvailable,
    };
  }

  private async loadProfileExtras(accountId: string, locationId: string, pace: GoogleBusinessPacer) {
    let attributes: ProviderSyncSnapshot["attributes"] = [];
    let placeActions: ProviderSyncSnapshot["placeActions"] = [];
    try {
      const listed = await this.paced(() => this.provider.getAttributes(accountId, locationId), pace);
      attributes = listed.attributes;
      try {
        const metadata = await this.paced(() => this.provider.getAttributeMetadata(accountId, locationId), pace);
        for (const attribute of attributes) {
          const meta = metadata.labels.get(attribute.name);
          if (!meta) continue;
          attribute.displayName = meta.displayName;
          attribute.groupDisplayName = meta.groupDisplayName;
          if (meta.valueType) attribute.valueType = meta.valueType;
        }
      } catch (error) {
        if (!(error instanceof GoogleBusinessProviderError) || error.status < 400 || error.status >= 500) throw error;
      }
    } catch (error) {
      if (!(error instanceof GoogleBusinessProviderError) || (error.status !== 402 && error.status !== 403 && error.status !== 404)) {
        throw error;
      }
    }
    try {
      const listed = await this.paced(() => this.provider.getPlaceActions(accountId, locationId), pace);
      placeActions = listed.placeActions;
    } catch (error) {
      if (!(error instanceof GoogleBusinessProviderError) || (error.status !== 403 && error.status !== 404)) throw error;
    }
    return { attributes, placeActions };
  }

  processReviewWebhook(payload: WebhookPayloadReviewNew | WebhookPayloadReviewUpdated) {
    return this.repository.processReviewWebhook({
      id: payload.id,
      event: payload.event,
      accountId: payload.account.accountId ?? payload.account.id,
      timestamp: payload.timestamp,
      review: payload.review,
      raw: payload,
    });
  }
}
