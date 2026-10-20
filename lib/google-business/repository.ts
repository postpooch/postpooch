import type { Pool, PoolClient } from "pg";

import { getDbPool } from "@/lib/db/client";
import { normalizeRegularHours } from "@/lib/google-business/hours";
import {
  formatStorefrontAddress,
  googleBusinessMediaId,
  normalizeAdditionalPhones,
  normalizeAttributes,
  normalizeCategories,
  normalizeMediaCategory,
  normalizeOpenInfo,
  normalizePlaceActions,
  normalizeServiceArea,
  normalizeServices,
  normalizeSpecialHours,
  normalizeStorefrontAddress,
} from "@/lib/google-business/profile";
import type {
  GoogleBusinessDashboard,
  GoogleBusinessLocation,
  GoogleBusinessLocationPatch,
  GoogleBusinessPhoto,
  ProviderLocationSummary,
  ProviderSyncSnapshot,
} from "@/lib/google-business/types";

type Db = Pool | PoolClient;

function asNumber(value: unknown, fallback = 0) {
  const result = Number(value);
  return Number.isFinite(result) ? result : fallback;
}

function mapLocation(row: Record<string, unknown>): GoogleBusinessLocation {
  const storefrontAddress = normalizeStorefrontAddress(row.storefront_address);
  return {
    id: String(row.id),
    connectionId: String(row.connection_id),
    zernioLocationId: String(row.zernio_location_id),
    googleAccountId: row.google_account_id ? String(row.google_account_id) : null,
    title: String(row.title || "Google Business location"),
    formattedAddress: row.formatted_address ? String(row.formatted_address) : formatStorefrontAddress(storefrontAddress),
    storefrontAddress,
    primaryPhone: row.primary_phone ? String(row.primary_phone) : null,
    additionalPhones: normalizeAdditionalPhones(row.additional_phones),
    websiteUri: row.website_uri ? String(row.website_uri) : null,
    description: row.description ? String(row.description) : null,
    categories: normalizeCategories(row.categories),
    regularHours: normalizeRegularHours(row.regular_hours),
    specialHours: normalizeSpecialHours(row.special_hours),
    services: normalizeServices(row.services),
    openInfo: normalizeOpenInfo(row.open_info),
    serviceArea: normalizeServiceArea(row.service_area),
    attributes: normalizeAttributes(row.attributes),
    placeActions: normalizePlaceActions(row.place_actions),
    placeId: row.place_id ? String(row.place_id) : null,
    mapsUri: row.maps_uri ? String(row.maps_uri) : null,
    reviewUrl: row.review_url ? String(row.review_url) : null,
    isVerified: Boolean(row.is_verified),
    averageRating: row.average_rating === null ? null : asNumber(row.average_rating),
    reviewCount: asNumber(row.review_count),
    isSelected: Boolean(row.is_selected),
    syncStatus: row.sync_status as GoogleBusinessLocation["syncStatus"],
    syncError: row.sync_error ? String(row.sync_error) : null,
    lastSyncedAt: row.last_synced_at ? String(row.last_synced_at) : null,
  };
}

function mapPhoto(row: Record<string, unknown>): GoogleBusinessPhoto {
  const providerMediaId = row.provider_media_id ? googleBusinessMediaId(String(row.provider_media_id)) : null;
  return {
    id: String(row.id),
    providerMediaId,
    url: String(row.url ?? row.path ?? ""),
    category: normalizeMediaCategory(row.category ?? row.media_category),
  };
}

export type OwnedSyncTarget = {
  id: string;
  profileId: string;
  connectionId: string;
  zernioAccountId: string;
  zernioLocationId: string;
  googleAccountId: string | null;
  isSelected: boolean;
  mutationVersion: number;
};

export class GoogleBusinessRepository {
  constructor(private readonly db: Db = getDbPool()) {}

  async getDashboard(profileId: string): Promise<GoogleBusinessDashboard> {
    const connectionResult = await this.db.query(
      `select id, status, needs_reconnection, last_synced_at::text
         from public.google_business_connections
        where profile_id = $1
        order by (status = 'active') desc, created_at desc
        limit 1`,
      [profileId],
    );
    const connection = connectionResult.rows[0];
    if (!connection) {
      return { connection: null, locations: [], selectedLocationId: null, reviews: [], metrics: [], keywords: [], photos: [] };
    }

    const locationsResult = await this.db.query(
      `select location.*,
              location.last_synced_at::text,
              connection.profile_id
         from public.google_business_locations as location
         join public.google_business_connections as connection on connection.id = location.connection_id
        where connection.profile_id = $1 and location.is_available
        order by location.is_selected desc, location.title asc`,
      [profileId],
    );
    const locations = locationsResult.rows.map(mapLocation);
    const selected = locations.find((location) => location.isSelected) ?? locations[0] ?? null;
    if (!selected) {
      return {
        connection: {
          id: connection.id,
          status: connection.status,
          needsReconnection: connection.needs_reconnection,
          lastSyncedAt: connection.last_synced_at ?? null,
        },
        locations,
        selectedLocationId: null,
        reviews: [], metrics: [], keywords: [], photos: [],
      };
    }

    const [reviews, metrics, keywords, photos] = await Promise.all([
      this.db.query(
        `select id, provider_review_id, reviewer_name, reviewer_photo_url, rating,
                comment, reply_comment, provider_created_at::text
           from public.google_business_reviews
          where location_id = $1
          order by provider_created_at desc nulls last, created_at desc
          limit 12`,
        [selected.id],
      ),
      this.db.query(
        `select metric_date::text as date, metric_name as name, metric_value as value
           from public.google_business_metrics
          where location_id = $1 and metric_date >= current_date - 90
          order by metric_date asc`,
        [selected.id],
      ),
      this.db.query(
        `select period_end::text as month, keyword, impressions
           from public.google_business_search_keywords
          where location_id = $1 and period_end >= date_trunc('month', current_date) - interval '12 months'
          order by period_end desc, impressions desc
          limit 30`,
        [selected.id],
      ),
      this.db.query(
        `select id, path as url, media_category as category, provider_media_id
           from public.images
          where google_business_location_id = $1 and source = 'zernio' and path is not null
          order by
            case media_category
              when 'COVER' then 0
              when 'PROFILE' then 1
              when 'LOGO' then 2
              else 3
            end,
            created_at desc
          limit 100`,
        [selected.id],
      ),
    ]);

    return {
      connection: {
        id: connection.id,
        status: connection.status,
        needsReconnection: connection.needs_reconnection,
        lastSyncedAt: connection.last_synced_at ?? null,
      },
      locations,
      selectedLocationId: selected.id,
      reviews: reviews.rows.map((row) => ({
        id: row.id,
        providerReviewId: row.provider_review_id,
        reviewerName: row.reviewer_name,
        reviewerPhotoUrl: row.reviewer_photo_url,
        rating: asNumber(row.rating),
        comment: row.comment,
        replyComment: row.reply_comment,
        providerCreatedAt: row.provider_created_at,
      })),
      metrics: metrics.rows.map((row) => ({ date: row.date, name: row.name, value: asNumber(row.value) })),
      keywords: keywords.rows.map((row) => ({ month: row.month, keyword: row.keyword, impressions: asNumber(row.impressions) })),
      photos: photos.rows.map(mapPhoto),
    };
  }

  async upsertConnection(input: {
    profileId: string;
    zernioProfileId: string;
    zernioAccountId: string;
    accountName: string | null;
    needsReconnection: boolean;
    locations: ProviderLocationSummary[];
  }) {
    const client = await getDbPool().connect();
    try {
      await client.query("begin");
      const connectionResult = await client.query<{ id: string }>(
        `insert into public.google_business_connections
           (profile_id, zernio_profile_id, zernio_account_id, provider_account_name, status, needs_reconnection)
         values ($1, $2, $3, $4, 'active', $5)
         on conflict (profile_id, zernio_account_id) do update set
           zernio_profile_id = excluded.zernio_profile_id,
           provider_account_name = excluded.provider_account_name,
           status = 'active', needs_reconnection = excluded.needs_reconnection,
           sync_error = null
         returning id`,
        [input.profileId, input.zernioProfileId, input.zernioAccountId, input.accountName, input.needsReconnection],
      );
      const connectionId = connectionResult.rows[0].id;
      const selectedId = input.locations.find((location) => location.selected)?.id ?? input.locations[0]?.id;
      await client.query(
        `update public.google_business_locations set is_available = false, is_selected = false where connection_id = $1`,
        [connectionId],
      );
      for (const location of input.locations) {
        const categories = location.category
          ? { primaryCategory: { displayName: location.category } }
          : {};
        await client.query(
          `insert into public.google_business_locations
             (connection_id, zernio_location_id, google_account_id, google_location_name,
              store_code, title, formatted_address, website_uri, categories, is_selected, is_available)
           values ($1, $2, $3, $4, $5, $4, $6, $7, $8::jsonb, $9, true)
           on conflict (connection_id, zernio_location_id) do update set
             google_account_id = excluded.google_account_id,
             google_location_name = excluded.google_location_name,
             store_code = excluded.store_code,
             title = case when google_business_locations.last_synced_at is null then excluded.title else google_business_locations.title end,
             formatted_address = coalesce(excluded.formatted_address, google_business_locations.formatted_address),
             website_uri = coalesce(excluded.website_uri, google_business_locations.website_uri),
             categories = case when google_business_locations.last_synced_at is null then excluded.categories else google_business_locations.categories end,
             is_selected = excluded.is_selected, is_available = true`,
          [connectionId, location.id, location.accountId, location.name, location.storeCode, location.address, location.websiteUrl, JSON.stringify(categories), location.id === selectedId],
        );
      }
      await client.query("commit");
      return connectionId;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async getOwnedLocation(profileId: string, locationId: string): Promise<GoogleBusinessLocation | null> {
    const result = await this.db.query(
      `select location.*
         from public.google_business_locations as location
         join public.google_business_connections as connection on connection.id = location.connection_id
        where location.id = $1 and connection.profile_id = $2 and location.is_available
        limit 1`,
      [locationId, profileId],
    );
    return result.rows[0] ? mapLocation(result.rows[0]) : null;
  }

  async listLocationPhotos(locationId: string): Promise<GoogleBusinessPhoto[]> {
    const result = await this.db.query(
      `select id, path as url, media_category as category, provider_media_id
         from public.images
        where google_business_location_id = $1 and source = 'zernio' and path is not null
        order by
          case media_category
            when 'COVER' then 0
            when 'PROFILE' then 1
            when 'LOGO' then 2
            else 3
          end,
          created_at desc
        limit 100`,
      [locationId],
    );
    return result.rows.map(mapPhoto);
  }

  async replaceLocationPhotos(
    locationId: string,
    photos: Array<{ providerMediaId: string; url: string; category: string | null }>,
  ) {
    const ids = photos.map((photo) => photo.providerMediaId);
    if (!ids.length) {
      await this.db.query(
        `delete from public.images
          where google_business_location_id = $1 and source = 'zernio'`,
        [locationId],
      );
      return;
    }
    for (const photo of photos) {
      await this.db.query(
        `insert into public.images (google_business_location_id, provider_media_id, path, media_category, source)
         values ($1,$2,$3,$4,'zernio')
         on conflict (google_business_location_id, provider_media_id) where google_business_location_id is not null and provider_media_id is not null
         do update set path=excluded.path, media_category=excluded.media_category, updated_at=now()`,
        [locationId, photo.providerMediaId, photo.url, photo.category],
      );
    }
    await this.db.query(
      `delete from public.images
        where google_business_location_id = $1 and source = 'zernio'
          and provider_media_id <> all($2::text[])`,
      [locationId, ids],
    );
  }

  async getOwnedTarget(profileId: string, locationId: string): Promise<OwnedSyncTarget | null> {
    const result = await this.db.query(
      `select location.id, connection.profile_id, connection.id as connection_id,
              connection.zernio_account_id, location.zernio_location_id,
              location.google_account_id, location.is_selected, location.mutation_version
         from public.google_business_locations as location
         join public.google_business_connections as connection on connection.id = location.connection_id
        where location.id = $1 and connection.profile_id = $2 and location.is_available
        limit 1`,
      [locationId, profileId],
    );
    return result.rows[0] ? this.mapTarget(result.rows[0]) : null;
  }

  async getSyncTarget(locationId: string): Promise<OwnedSyncTarget | null> {
    const result = await this.db.query(
      `select location.id, connection.profile_id, connection.id as connection_id,
              connection.zernio_account_id, location.zernio_location_id,
              location.google_account_id, location.is_selected, location.mutation_version
         from public.google_business_locations as location
         join public.google_business_connections as connection on connection.id = location.connection_id
        where location.id = $1 and location.is_available and connection.status = 'active'
        limit 1`,
      [locationId],
    );
    return result.rows[0] ? this.mapTarget(result.rows[0]) : null;
  }

  private mapTarget(row: Record<string, unknown>): OwnedSyncTarget {
    return {
      id: String(row.id), profileId: String(row.profile_id), connectionId: String(row.connection_id),
      zernioAccountId: String(row.zernio_account_id), zernioLocationId: String(row.zernio_location_id),
      googleAccountId: row.google_account_id ? String(row.google_account_id) : null,
      isSelected: Boolean(row.is_selected), mutationVersion: asNumber(row.mutation_version),
    };
  }

  async listSyncLocationIds(afterId: string | null, limit: number) {
    const result = await this.db.query<{ id: string }>(
      `select location.id
         from public.google_business_locations as location
         join public.google_business_connections as connection on connection.id = location.connection_id
        where location.is_available and connection.status = 'active'
          and ($1::uuid is null or location.id > $1::uuid)
        order by location.id asc
        limit $2`,
      [afterId, limit],
    );
    return result.rows.map((row) => row.id);
  }

  async markSyncStarted(locationId: string) {
    const result = await this.db.query<{ mutation_version: string }>(
      `update public.google_business_locations
          set sync_status = 'syncing', sync_error = null, last_sync_started_at = now()
        where id = $1
        returning mutation_version`,
      [locationId],
    );
    return result.rows[0] ? asNumber(result.rows[0].mutation_version) : null;
  }

  async markSyncFailed(locationId: string, message: string) {
    await this.db.query(
      `update public.google_business_locations set sync_status = 'failed', sync_error = left($2, 1000) where id = $1`,
      [locationId, message],
    );
  }

  async applyUserPatch(profileId: string, locationId: string, patch: GoogleBusinessLocationPatch) {
    const formattedAddress = patch.storefrontAddress === undefined
      ? undefined
      : formatStorefrontAddress(patch.storefrontAddress);
    const result = await this.db.query(
      `update public.google_business_locations as location set
          title = case when $3::boolean then $4 else title end,
          storefront_address = case when $5::boolean then $6::jsonb else storefront_address end,
          formatted_address = case when $7::boolean then $8 else formatted_address end,
          description = case when $9::boolean then $10 else description end,
          website_uri = case when $11::boolean then nullif($12, '') else website_uri end,
          primary_phone = case when $13::boolean then nullif($14, '') else primary_phone end,
          additional_phones = case when $15::boolean then $16::jsonb else additional_phones end,
          regular_hours = case when $17::boolean then $18::jsonb else regular_hours end,
          special_hours = case when $19::boolean then $20::jsonb else special_hours end,
          services = case when $21::boolean then $22::jsonb else services end,
          open_info = case when $23::boolean then $24::jsonb else open_info end,
          service_area = case when $25::boolean then $26::jsonb else service_area end,
          attributes = case when $27::boolean then $28::jsonb else attributes end,
          place_actions = case when $29::boolean then $30::jsonb else place_actions end,
          mutation_version = mutation_version + 1,
          last_mutated_at = now(), sync_error = null
        from public.google_business_connections as connection
       where location.id = $1 and location.connection_id = connection.id and connection.profile_id = $2
       returning location.*`,
      [
        locationId, profileId,
        patch.title !== undefined, patch.title ?? null,
        patch.storefrontAddress !== undefined, patch.storefrontAddress ? JSON.stringify(patch.storefrontAddress) : null,
        formattedAddress !== undefined, formattedAddress ?? null,
        patch.description !== undefined, patch.description ?? null,
        patch.websiteUri !== undefined, patch.websiteUri ?? null,
        patch.primaryPhone !== undefined, patch.primaryPhone ?? null,
        patch.additionalPhones !== undefined, JSON.stringify(patch.additionalPhones ?? []),
        patch.regularHours !== undefined, JSON.stringify(normalizeRegularHours(patch.regularHours)),
        patch.specialHours !== undefined, JSON.stringify(normalizeSpecialHours(patch.specialHours)),
        patch.services !== undefined, JSON.stringify(normalizeServices(patch.services)),
        patch.openInfo !== undefined, JSON.stringify(normalizeOpenInfo(patch.openInfo)),
        patch.serviceArea !== undefined, JSON.stringify(normalizeServiceArea(patch.serviceArea)),
        patch.attributes !== undefined, JSON.stringify(normalizeAttributes(patch.attributes)),
        patch.placeActions !== undefined, JSON.stringify(normalizePlaceActions(patch.placeActions)),
      ],
    );
    return result.rows[0] ? mapLocation(result.rows[0]) : null;
  }

  async selectLocation(profileId: string, locationId: string) {
    const client = await getDbPool().connect();
    try {
      await client.query("begin");
      const target = await client.query<{ connection_id: string }>(
        `select location.connection_id
           from public.google_business_locations as location
           join public.google_business_connections as connection on connection.id = location.connection_id
          where location.id = $1 and connection.profile_id = $2 and location.is_available
          for update`,
        [locationId, profileId],
      );
      if (!target.rows[0]) { await client.query("rollback"); return false; }
      await client.query(`update public.google_business_locations set is_selected = (id = $2) where connection_id = $1`, [target.rows[0].connection_id, locationId]);
      await client.query("commit");
      return true;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally { client.release(); }
  }

  async persistSnapshot(target: OwnedSyncTarget, expectedMutationVersion: number, snapshot: ProviderSyncSnapshot) {
    const client = await getDbPool().connect();
    try {
      await client.query("begin");
      const updated = await client.query(
        `update public.google_business_locations set
            title = $3, formatted_address = coalesce($4, formatted_address), storefront_address = $5::jsonb,
            primary_phone = $6, additional_phones = $7::jsonb, website_uri = $8, description = $9,
            categories = $10::jsonb, regular_hours = $11::jsonb, special_hours = $12::jsonb,
            services = $13::jsonb, open_info = $14::jsonb, service_area = $15::jsonb, more_hours = $16::jsonb,
            attributes = $17::jsonb, place_actions = $18::jsonb,
            place_id = $19, maps_uri = $20, review_url = $21,
            is_verified = $22, average_rating = $23, review_count = $24,
            sync_status = 'synced', sync_error = null, last_synced_at = now()
          where id = $1 and mutation_version = $2`,
        [target.id, expectedMutationVersion, snapshot.details.title, snapshot.details.formattedAddress,
          snapshot.details.storefrontAddress ? JSON.stringify(snapshot.details.storefrontAddress) : null,
          snapshot.details.primaryPhone, JSON.stringify(snapshot.details.additionalPhones), snapshot.details.websiteUri,
          snapshot.details.description, JSON.stringify(snapshot.details.categories), JSON.stringify(snapshot.details.regularHours),
          JSON.stringify(snapshot.details.specialHours), JSON.stringify(snapshot.details.services),
          JSON.stringify(snapshot.details.openInfo), JSON.stringify(snapshot.details.serviceArea),
          JSON.stringify(snapshot.details.moreHours), JSON.stringify(snapshot.attributes), JSON.stringify(snapshot.placeActions),
          snapshot.details.placeId, snapshot.details.mapsUri, snapshot.details.reviewUrl, snapshot.details.isVerified,
          snapshot.averageRating, snapshot.reviewCount],
      );
      if (updated.rowCount === 0) {
        await client.query(`update public.google_business_locations set sync_status = 'pending', sync_error = null where id = $1`, [target.id]);
      }

      for (const review of snapshot.reviews) {
        await client.query(
          `insert into public.google_business_reviews
             (location_id, provider_review_id, provider_resource_name, reviewer_name, reviewer_photo_url,
              is_anonymous, rating, comment, reply_comment, reply_updated_at, provider_created_at, provider_updated_at, synced_at)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,now())
           on conflict (location_id, provider_review_id) do update set
             provider_resource_name=excluded.provider_resource_name, reviewer_name=excluded.reviewer_name,
             reviewer_photo_url=excluded.reviewer_photo_url, is_anonymous=excluded.is_anonymous,
             rating=excluded.rating, comment=excluded.comment, reply_comment=excluded.reply_comment,
             reply_updated_at=excluded.reply_updated_at, provider_updated_at=excluded.provider_updated_at, synced_at=now()`,
          [target.id, review.id, review.resourceName, review.reviewerName, review.reviewerPhotoUrl, review.isAnonymous,
            review.rating, review.comment, review.replyComment, review.replyUpdatedAt, review.createdAt, review.updatedAt],
        );
      }
      for (const metric of snapshot.metrics) {
        await client.query(
          `insert into public.google_business_metrics (location_id, metric_date, metric_name, metric_value, synced_at)
           values ($1,$2,$3,$4,now()) on conflict (location_id, metric_date, metric_name) do update
           set metric_value=excluded.metric_value, synced_at=now()`,
          [target.id, metric.date, metric.name, metric.value],
        );
      }
      for (const keyword of snapshot.keywords) {
        await client.query(
          `insert into public.google_business_search_keywords (location_id, period_start, period_end, keyword, impressions, synced_at)
           values ($1,$2,$3,$4,$5,now()) on conflict (location_id, period_start, period_end, keyword) do update
           set impressions=excluded.impressions, synced_at=now()`,
          [target.id, keyword.periodStart, keyword.periodEnd, keyword.keyword, keyword.impressions],
        );
      }
      if ((updated.rowCount ?? 0) > 0) {
        for (const media of snapshot.media) {
          await client.query(
            `insert into public.images (google_business_location_id, provider_media_id, path, media_category, source, width, height)
             values ($1,$2,$3,$4,'zernio',$5,$6)
             on conflict (google_business_location_id, provider_media_id) where google_business_location_id is not null and provider_media_id is not null
             do update set path=excluded.path, media_category=excluded.media_category, width=excluded.width, height=excluded.height, updated_at=now()`,
            [target.id, googleBusinessMediaId(media.id), media.url, media.category, media.width, media.height],
          );
        }
        const mediaIds = snapshot.media.map((item) => googleBusinessMediaId(item.id));
        if (snapshot.mediaComplete) {
          if (mediaIds.length) {
            await client.query(
              `delete from public.images
                where google_business_location_id = $1 and source = 'zernio'
                  and provider_media_id <> all($2::text[])
                  and updated_at < now() - interval '6 hours'`,
              [target.id, mediaIds],
            );
          } else {
            await client.query(
              `delete from public.images
                where google_business_location_id = $1 and source = 'zernio'
                  and updated_at < now() - interval '6 hours'`,
              [target.id],
            );
          }
        }
      }
      if (target.isSelected) {
        await client.query(
          `update public.google_business_connections set sync_status='synced', sync_error=null, last_synced_at=now() where id=$1`,
          [target.connectionId],
        );
      }
      await client.query("commit");
      return (updated.rowCount ?? 0) > 0;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally { client.release(); }
  }

  async processReviewWebhook(payload: {
    id: string; event: string; accountId: string; timestamp: string;
    review: { id: string; rating: number; text: string; reviewer: { id: string | null; name: string; profileImage: string | null }; createdAt: string; hasReply: boolean; reply?: { text: string; createdAt: string } };
    raw: unknown;
  }) {
    const client = await getDbPool().connect();
    try {
      await client.query("begin");
      const claimed = await client.query(
        `insert into public.google_business_webhook_events (event_id, event_type, zernio_account_id, payload)
         values ($1,$2,$3,$4::jsonb) on conflict do nothing returning event_id`,
        [payload.id, payload.event, payload.accountId, JSON.stringify(payload.raw)],
      );
      if (!claimed.rowCount) { await client.query("rollback"); return "duplicate" as const; }
      const match = payload.review.id.match(/locations\/([^/]+)\/reviews\/([^/]+)$/);
      const providerReviewId = match?.[2] ?? payload.review.id.split("/").at(-1)!;
      const providerLocationId = match?.[1] ?? null;
      const location = await client.query<{ id: string }>(
        `select location.id from public.google_business_locations as location
         join public.google_business_connections as connection on connection.id=location.connection_id
         where connection.zernio_account_id=$1 and ($2::text is null or location.zernio_location_id=$2 or location.zernio_location_id like '%/' || $2)
         order by location.is_selected desc limit 1`,
        [payload.accountId, providerLocationId],
      );
      if (!location.rows[0]) throw new Error("Webhook account/location is not registered.");
      await client.query(
        `insert into public.google_business_reviews
          (location_id, provider_review_id, provider_resource_name, reviewer_name, reviewer_photo_url,
           is_anonymous, rating, comment, reply_comment, reply_updated_at, provider_created_at, provider_updated_at, synced_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,now())
         on conflict (location_id, provider_review_id) do update set
           reviewer_name=excluded.reviewer_name, reviewer_photo_url=excluded.reviewer_photo_url,
           is_anonymous=excluded.is_anonymous, rating=excluded.rating, comment=excluded.comment,
           reply_comment=excluded.reply_comment, reply_updated_at=excluded.reply_updated_at,
           provider_updated_at=excluded.provider_updated_at, synced_at=now()`,
        [location.rows[0].id, providerReviewId, payload.review.id, payload.review.reviewer.name || "Google user",
          payload.review.reviewer.profileImage, payload.review.reviewer.id === null, payload.review.rating,
          payload.review.text || null, payload.review.hasReply ? payload.review.reply?.text ?? null : null,
          payload.review.reply?.createdAt ?? null, payload.review.createdAt, payload.timestamp],
      );
      await client.query(`update public.google_business_webhook_events set processed_at=now() where event_id=$1`, [payload.id]);
      await client.query("commit");
      return "processed" as const;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally { client.release(); }
  }
}
