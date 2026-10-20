import type {
  AccountsListResponse,
  GetConnectUrlResponse,
  GetGmbLocationsResponse,
  GetGmbAttributeMetadataResponse,
  GetGoogleBusinessAttributesResponse,
  GetGoogleBusinessLocationDetailsResponse,
  GetGoogleBusinessPerformanceResponse,
  GetGoogleBusinessReviewsResponse,
  GetGoogleBusinessSearchKeywordsResponse,
  GetWebhookSettingsResponse,
  ListGoogleBusinessMediaResponse,
  ListGoogleBusinessPlaceActionsResponse,
  CreateGoogleBusinessMediaResponse,
  CreateWebhookSettingsResponse,
  SocialAccount,
  UpdateGmbLocationResponse,
  UpdateGoogleBusinessLocationDetailsData,
  UpdateGoogleBusinessLocationDetailsResponse,
  UpdateWebhookSettingsResponse,
} from "@zernio/node";

import { normalizeRegularHours } from "@/lib/google-business/hours";
import {
  attributeKey,
  formatStorefrontAddress,
  googleBusinessMediaId,
  hasLocationDetailsPatch,
  normalizeAttributes,
  normalizeCategories,
  normalizeOpenInfo,
  normalizePlaceActions,
  normalizeServiceArea,
  normalizeServices,
  normalizeSpecialHours,
  normalizeStorefrontAddress,
  normalizeAdditionalPhones,
} from "@/lib/google-business/profile";
import type {
  GoogleBusinessAttribute,
  GoogleBusinessLocationPatch,
  GoogleBusinessPhoto,
  GoogleBusinessPhotoPatch,
  GoogleBusinessPlaceAction,
  ProviderKeyword,
  ProviderLocationDetails,
  ProviderLocationSummary,
  ProviderMedia,
  ProviderMetric,
  ProviderRateLimit,
  ProviderReview,
} from "@/lib/google-business/types";
import { getZernioClient } from "@/lib/zernio/client";

type ZernioResult<T> = {
  data?: T;
  error?: unknown;
  response: Response;
};

type LocationDetailsUpdateBody = UpdateGoogleBusinessLocationDetailsData["body"] & {
  title?: string;
  storefrontAddress?: Record<string, unknown>;
  openInfo?: { status: string };
  serviceArea?: Record<string, unknown>;
};

function numberHeader(headers: Headers, name: string) {
  const raw = headers.get(name);
  if (raw === null || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function rateLimitFrom(response: Response): ProviderRateLimit {
  return {
    limit: numberHeader(response.headers, "x-ratelimit-limit"),
    remaining: numberHeader(response.headers, "x-ratelimit-remaining"),
    resetAt: numberHeader(response.headers, "x-ratelimit-reset"),
    retryAfterSeconds: numberHeader(response.headers, "retry-after"),
  };
}

function providerMessage(error: unknown) {
  if (!error || typeof error !== "object") return "Zernio could not complete the request.";
  const record = error as Record<string, unknown>;
  const candidate = record.error ?? record.message;
  return typeof candidate === "string" && candidate.trim()
    ? candidate
    : "Zernio could not complete the request.";
}

export class GoogleBusinessProviderError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly retryAfterSeconds: number | null,
  ) {
    super(message);
    this.name = "GoogleBusinessProviderError";
  }

  get retryable() {
    return this.status === 408 || this.status === 429 || this.status >= 500;
  }
}

function unwrap<T>(result: ZernioResult<T>): { data: T; rateLimit: ProviderRateLimit } {
  if (result.error || !result.data) {
    const rateLimit = rateLimitFrom(result.response);
    throw new GoogleBusinessProviderError(
      providerMessage(result.error),
      result.response.status || 502,
      rateLimit.retryAfterSeconds,
    );
  }
  return { data: result.data, rateLimit: rateLimitFrom(result.response) };
}

function cleanString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export class ZernioGoogleBusinessProvider {
  private readonly client = getZernioClient();

  async startConnection(input: { profileId: string; redirectUrl: string }) {
    const result = await this.client.connect.getConnectUrl({
      path: { platform: "googlebusiness" },
      query: { profileId: input.profileId, redirect_url: input.redirectUrl },
    });
    const { data } = unwrap<GetConnectUrlResponse>(result);
    if (!data.authUrl) throw new GoogleBusinessProviderError("Zernio did not return a connection URL.", 502, null);
    return data.authUrl;
  }

  async ensureReviewWebhook(input: { url: string; secret: string }) {
    const listed = unwrap<GetWebhookSettingsResponse>(await this.client.webhooks.getWebhookSettings());
    const existing = listed.data.webhooks?.find((webhook) => webhook.name === "PostPooch Google Business");
    const body = {
      name: "PostPooch Google Business",
      url: input.url,
      secret: input.secret,
      events: ["review.new", "review.updated"] as const,
      isActive: true,
    };
    if (existing?._id) {
      unwrap<UpdateWebhookSettingsResponse>(await this.client.webhooks.updateWebhookSettings({
        body: { _id: existing._id, ...body, events: [...body.events] },
      }));
      return existing._id;
    }
    const created = unwrap<CreateWebhookSettingsResponse>(await this.client.webhooks.createWebhookSettings({
      body: { ...body, events: [...body.events] },
    }));
    return created.data.webhook?._id ?? null;
  }

  async verifyAccount(input: { profileId: string; accountId: string }) {
    const result = await this.client.accounts.listAccounts({ query: { profileId: input.profileId } });
    const { data } = unwrap<AccountsListResponse>(result);
    const account = data.accounts?.find(
      (item: SocialAccount) => item._id === input.accountId && item.platform === "googlebusiness",
    );
    if (!account) return null;
    return {
      id: account._id,
      displayName: account.displayName ?? account.username ?? null,
      needsReconnection: account.needsReconnection ?? false,
      active: account.isActive,
    };
  }

  async listLocations(accountId: string) {
    const result = await this.client.connect.getGmbLocations({
      path: { accountId },
      query: { limit: 500 },
    });
    const { data, rateLimit } = unwrap<GetGmbLocationsResponse>(result);
    const locations: ProviderLocationSummary[] = (data.locations ?? [])
      .filter((item) => Boolean(item.id))
      .map((item) => ({
        id: item.id!,
        name: item.name?.trim() || "Google Business location",
        accountId: cleanString(item.accountId),
        accountName: cleanString(item.accountName),
        address: cleanString(item.address),
        category: cleanString(item.category),
        websiteUrl: cleanString(item.websiteUrl),
        storeCode: cleanString(item.storeCode),
        selected: item.id === data.selectedLocationId,
      }));
    return { locations, hasMore: data.hasMore ?? false, rateLimit };
  }

  async selectLocation(input: { accountId: string; locationId: string; googleAccountId: string | null }) {
    const result = await this.client.connect.updateGmbLocation({
      path: { accountId: input.accountId },
      body: {
        selectedLocationId: input.locationId,
        ...(input.googleAccountId ? { googleAccountId: input.googleAccountId } : {}),
      },
    });
    return unwrap<UpdateGmbLocationResponse>(result).rateLimit;
  }

  async getLocationDetails(accountId: string, locationId: string) {
    const result = await this.client.gmblocationdetails.getGoogleBusinessLocationDetails({
      path: { accountId },
      query: {
        locationId,
        readMask: "title,phoneNumbers,categories,storefrontAddress,websiteUri,regularHours,specialHours,serviceArea,serviceItems,profile,openInfo,metadata,moreHours",
      },
    });
    const { data, rateLimit } = unwrap<GetGoogleBusinessLocationDetailsResponse>(result);
    const raw = data as GetGoogleBusinessLocationDetailsResponse & {
      storefrontAddress?: unknown;
      openInfo?: unknown;
      serviceArea?: unknown;
      moreHours?: unknown;
    };
    const storefrontAddress = normalizeStorefrontAddress(raw.storefrontAddress);
    const details: ProviderLocationDetails = {
      title: data.title?.trim() || data.location?.name?.trim() || "Google Business location",
      formattedAddress: formatStorefrontAddress(storefrontAddress),
      storefrontAddress,
      primaryPhone: cleanString(data.phoneNumbers?.primaryPhone),
      additionalPhones: normalizeAdditionalPhones(data.phoneNumbers?.additionalPhones),
      websiteUri: cleanString(data.websiteUri),
      description: cleanString(data.profile?.description),
      categories: normalizeCategories(data.categories),
      regularHours: normalizeRegularHours(data.regularHours),
      specialHours: normalizeSpecialHours(data.specialHours),
      services: normalizeServices(data.serviceItems),
      openInfo: normalizeOpenInfo(raw.openInfo),
      serviceArea: normalizeServiceArea(raw.serviceArea),
      moreHours: Array.isArray(raw.moreHours) ? raw.moreHours : [],
      placeId: cleanString(data.location?.placeId),
      mapsUri: cleanString(data.location?.mapsUri),
      reviewUrl: cleanString(data.location?.reviewUrl),
      isVerified: data.location?.isVerified ?? false,
    };
    return { details, rateLimit };
  }

  async updateLocation(accountId: string, locationId: string, patch: GoogleBusinessLocationPatch) {
    if (!hasLocationDetailsPatch(patch)) return { limit: null, remaining: null, resetAt: null, retryAfterSeconds: null };
    const updateMask: string[] = [];
    const body: LocationDetailsUpdateBody = { updateMask: "" };
    if (patch.title !== undefined) {
      updateMask.push("title");
      body.title = patch.title;
    }
    if (patch.storefrontAddress !== undefined) {
      updateMask.push("storefrontAddress");
      body.storefrontAddress = patch.storefrontAddress ?? { regionCode: "US" };
    }
    if (patch.description !== undefined) {
      updateMask.push("profile.description");
      body.profile = { description: patch.description };
    }
    if (patch.websiteUri !== undefined) {
      updateMask.push("websiteUri");
      body.websiteUri = patch.websiteUri;
    }
    if (patch.primaryPhone !== undefined || patch.additionalPhones !== undefined) {
      updateMask.push("phoneNumbers");
      body.phoneNumbers = {
        primaryPhone: patch.primaryPhone ?? "",
        additionalPhones: patch.additionalPhones ?? [],
      };
    }
    if (patch.regularHours !== undefined) {
      updateMask.push("regularHours");
      body.regularHours = normalizeRegularHours(patch.regularHours);
    }
    if (patch.specialHours !== undefined) {
      updateMask.push("specialHours");
      body.specialHours = normalizeSpecialHours(patch.specialHours);
    }
    if (patch.services !== undefined) {
      updateMask.push("serviceItems");
      body.serviceItems = normalizeServices(patch.services);
    }
    if (patch.openInfo !== undefined) {
      updateMask.push("openInfo");
      body.openInfo = { status: patch.openInfo.status };
    }
    if (patch.serviceArea !== undefined) {
      updateMask.push("serviceArea");
      body.serviceArea = patch.serviceArea as Record<string, unknown>;
    }
    body.updateMask = updateMask.join(",");
    const result = await this.client.gmblocationdetails.updateGoogleBusinessLocationDetails({
      path: { accountId },
      query: { locationId },
      body,
    });
    const { data, rateLimit } = unwrap<UpdateGoogleBusinessLocationDetailsResponse>(result);
    if (!data.success) throw new GoogleBusinessProviderError("Google did not confirm the update.", 502, null);
    return rateLimit;
  }

  async getAttributes(accountId: string, locationId: string) {
    const listed = await this.client.gmbattributes.getGoogleBusinessAttributes({
      path: { accountId },
      query: { locationId },
    });
    const { data, rateLimit } = unwrap<GetGoogleBusinessAttributesResponse>(listed);
    return { attributes: normalizeAttributes(data.attributes), rateLimit };
  }

  async getAttributeMetadata(accountId: string, locationId: string) {
    const result = await this.client.gmbattributes.getGmbAttributeMetadata({
      path: { accountId },
      query: { locationId, pageSize: 200 },
    });
    const { data, rateLimit } = unwrap<GetGmbAttributeMetadataResponse>(result);
    const labels = new Map<string, { displayName: string | null; groupDisplayName: string | null; valueType: string | null }>();
    for (const item of data.attributeMetadata ?? []) {
      const name = cleanString(item.parent);
      if (!name) continue;
      labels.set(attributeKey(name), {
        displayName: cleanString(item.displayName),
        groupDisplayName: cleanString(item.groupDisplayName),
        valueType: cleanString(item.valueType),
      });
    }
    return { labels, rateLimit };
  }

  async updateAttributes(accountId: string, locationId: string, attributes: GoogleBusinessAttribute[]) {
    if (!attributes.length) return { limit: null, remaining: null, resetAt: null, retryAfterSeconds: null };
    const result = await this.client.gmbattributes.updateGoogleBusinessAttributes({
      path: { accountId },
      query: { locationId },
      body: {
        attributeMask: attributes.map((item) => item.name).join(","),
        attributes: attributes.map((item) => ({
          name: item.name,
          valueType: item.valueType as "BOOL" | "ENUM" | "URL" | "REPEATED_ENUM" | "ATTRIBUTE_VALUE_TYPE_UNSPECIFIED",
          values: item.values,
          repeatedEnumValue: item.repeatedEnumValue,
        })),
      },
    });
    return unwrap(result).rateLimit;
  }

  async getPlaceActions(accountId: string, locationId: string) {
    const result = await this.client.gmbplaceactions.listGoogleBusinessPlaceActions({
      path: { accountId },
      query: { locationId, pageSize: 20 },
    });
    const { data, rateLimit } = unwrap<ListGoogleBusinessPlaceActionsResponse>(result);
    return { placeActions: normalizePlaceActions(data.placeActionLinks), rateLimit };
  }

  async reconcilePlaceActions(
    accountId: string,
    locationId: string,
    current: GoogleBusinessPlaceAction[],
    next: GoogleBusinessPlaceAction[],
  ) {
    let rateLimit: ProviderRateLimit = { limit: null, remaining: null, resetAt: null, retryAfterSeconds: null };
    const nextNames = new Set(next.map((item) => item.name).filter((name): name is string => Boolean(name)));
    for (const action of current) {
      if (!action.name || nextNames.has(action.name)) continue;
      const deleted = await this.client.gmbplaceactions.deleteGoogleBusinessPlaceAction({
        path: { accountId },
        query: { locationId, name: action.name },
      });
      rateLimit = unwrap(deleted).rateLimit;
    }
    for (const action of next) {
      if (action.name) {
        const existing = current.find((item) => item.name === action.name);
        if (existing && existing.uri === action.uri && existing.placeActionType === action.placeActionType) continue;
        const updated = await this.client.gmbplaceactions.updateGoogleBusinessPlaceAction({
          path: { accountId },
          query: { locationId },
          body: { name: action.name, uri: action.uri, placeActionType: action.placeActionType },
        });
        rateLimit = unwrap(updated).rateLimit;
        continue;
      }
      const created = await this.client.gmbplaceactions.createGoogleBusinessPlaceAction({
        path: { accountId },
        query: { locationId },
        body: { uri: action.uri, placeActionType: action.placeActionType },
      });
      rateLimit = unwrap(created).rateLimit;
    }
    return rateLimit;
  }

  async getReviews(accountId: string, locationId: string) {
    const result = await this.client.accounts.getGoogleBusinessReviews({
      path: { accountId },
      query: { locationId, pageSize: 50 },
    });
    const { data, rateLimit } = unwrap<GetGoogleBusinessReviewsResponse>(result);
    const reviews: ProviderReview[] = (data.reviews ?? [])
      .filter((review) => Boolean(review.id))
      .map((review) => ({
        id: review.id!,
        resourceName: cleanString(review.name),
        reviewerName: review.reviewer?.displayName?.trim() || "Google user",
        reviewerPhotoUrl: cleanString(review.reviewer?.profilePhotoUrl),
        isAnonymous: review.reviewer?.isAnonymous ?? false,
        rating: Math.min(5, Math.max(1, review.rating ?? 1)),
        comment: cleanString(review.comment),
        replyComment: cleanString(review.reviewReply?.comment),
        replyUpdatedAt: cleanString(review.reviewReply?.updateTime),
        createdAt: cleanString(review.createTime),
        updatedAt: cleanString(review.updateTime),
      }));
    return {
      reviews,
      averageRating: data.averageRating ?? null,
      reviewCount: data.totalReviewCount ?? reviews.length,
      rateLimit,
    };
  }

  async getPerformance(accountId: string, startDate: string, endDate: string) {
    const result = await this.client.analytics.getGoogleBusinessPerformance({
      query: { accountId, startDate, endDate },
    });
    const { data, rateLimit } = unwrap<GetGoogleBusinessPerformanceResponse>(result);
    const metrics: ProviderMetric[] = [];
    for (const [name, series] of Object.entries(data.metrics ?? {})) {
      for (const point of series.values ?? []) {
        if (point.date && Number.isFinite(point.value)) metrics.push({ date: point.date, name, value: point.value! });
      }
    }
    return { metrics, rateLimit };
  }

  async getSearchKeywords(accountId: string, startMonth: string, endMonth: string) {
    const result = await this.client.analytics.getGoogleBusinessSearchKeywords({
      query: { accountId, startMonth, endMonth },
    });
    const { data, rateLimit } = unwrap<GetGoogleBusinessSearchKeywordsResponse>(result);
    const periodStart = `${data.monthRange?.startMonth ?? startMonth}-01`;
    const periodEnd = `${data.monthRange?.endMonth ?? endMonth}-01`;
    const keywords: ProviderKeyword[] = (data.keywords ?? [])
      .filter((item) => Boolean(item.keyword))
      .map((item) => ({ periodStart, periodEnd, keyword: item.keyword!, impressions: item.impressions ?? 0 }));
    return { keywords, rateLimit };
  }

  async getMedia(accountId: string, locationId: string) {
    const media: ProviderMedia[] = [];
    let rateLimit: ProviderRateLimit = { limit: null, remaining: null, resetAt: null, retryAfterSeconds: null };
    let pageToken: string | undefined;
    let complete = true;
    for (let page = 0; page < 20; page++) {
      const result = await this.client.gmbmedia.listGoogleBusinessMedia({
        path: { accountId },
        query: pageToken
          ? { locationId, pageSize: 100, pageToken }
          : { locationId, pageSize: 100 },
      });
      const { data, rateLimit: pageLimit } = unwrap<ListGoogleBusinessMediaResponse>(result);
      rateLimit = pageLimit;
      const record = data as ListGoogleBusinessMediaResponse & { mediaItems?: Array<Record<string, unknown>>; media?: Array<Record<string, unknown>> };
      const items = record.mediaItems ?? record.media ?? [];
      for (const item of items) {
        const id = googleBusinessMediaId(cleanString(item.name ?? item.id) ?? "");
        const url = cleanString(item.googleUrl ?? item.url ?? item.thumbnailUrl);
        if (!id || !url) continue;
        const association = item.locationAssociation;
        const category = cleanString(
          association && typeof association === "object" && !Array.isArray(association)
            ? (association as { category?: unknown }).category
            : item.category,
        );
        media.push({
          id,
          url,
          category,
          width: typeof item.widthPixels === "number" ? item.widthPixels : null,
          height: typeof item.heightPixels === "number" ? item.heightPixels : null,
        });
      }
      pageToken = cleanString(record.nextPageToken) ?? undefined;
      if (!pageToken) break;
      if (page === 19) complete = false;
    }
    return { media, complete, rateLimit };
  }

  async reconcileMedia(
    accountId: string,
    locationId: string,
    current: GoogleBusinessPhoto[],
    next: GoogleBusinessPhotoPatch[],
  ) {
    let rateLimit: ProviderRateLimit = { limit: null, remaining: null, resetAt: null, retryAfterSeconds: null };
    const persisted: Array<{ providerMediaId: string; url: string; category: string | null }> = [];
    const nextIds = new Set(
      next
        .map((photo) => photo.providerMediaId)
        .filter((id): id is string => Boolean(id))
        .map(googleBusinessMediaId),
    );

    for (const photo of current) {
      const id = photo.providerMediaId ? googleBusinessMediaId(photo.providerMediaId) : null;
      if (!id || nextIds.has(id)) continue;
      const deleted = await this.client.gmbmedia.deleteGoogleBusinessMedia({
        path: { accountId },
        query: { locationId, mediaId: id },
      });
      rateLimit = unwrap(deleted).rateLimit;
    }

    for (const photo of next) {
      const id = photo.providerMediaId ? googleBusinessMediaId(photo.providerMediaId) : null;
      const existing = id
        ? current.find((item) => item.providerMediaId && googleBusinessMediaId(item.providerMediaId) === id)
        : undefined;
      if (existing && existing.url === photo.url && (existing.category ?? "ADDITIONAL") === photo.category) {
        persisted.push({
          providerMediaId: id!,
          url: existing.url,
          category: existing.category ?? photo.category,
        });
        continue;
      }
      if (existing && id) {
        const deleted = await this.client.gmbmedia.deleteGoogleBusinessMedia({
          path: { accountId },
          query: { locationId, mediaId: id },
        });
        rateLimit = unwrap(deleted).rateLimit;
      }
      const created = await this.client.gmbmedia.createGoogleBusinessMedia({
        path: { accountId },
        query: { locationId },
        body: {
          sourceUrl: photo.url,
          mediaFormat: "PHOTO",
          category: photo.category,
        },
      });
      const { data, rateLimit: createdLimit } = unwrap<CreateGoogleBusinessMediaResponse>(created);
      rateLimit = createdLimit;
      const createdId = data.name ? googleBusinessMediaId(data.name) : "";
      if (!createdId) {
        throw new GoogleBusinessProviderError("Google did not return a photo ID.", 502, null);
      }
      persisted.push({
        providerMediaId: createdId,
        url: cleanString(data.googleUrl) ?? photo.url,
        category: photo.category,
      });
    }

    return { photos: persisted, rateLimit };
  }
}
