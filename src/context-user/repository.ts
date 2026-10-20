import type { Pool } from "pg";

import { PostingError, toErrorMessage } from "../posting/errors";
import type { Json, MediaRow } from "../posting/types";
import {
  contextSnapshotSchema,
  creativeOutputSchema,
  finalTemporarySatisfactionSchema,
  type ContextSnapshot,
  type CreativeOutput,
  type FinalTemporarySatisfaction,
} from "./contracts";

export type ContextUserRun = {
  id: string;
  scheduleId: string;
  occurrenceAt: string;
  triggerRunId: string | null;
  status: "queued" | "processing" | "published" | "failed";
  zernioRequestId: string;
  zernioPostId: string | null;
  mediaUrls: string[] | null;
  contextSnapshot: ContextSnapshot | null;
  creativeOutput: CreativeOutput | null;
  caption: string | null;
  historySummary: string | null;
  visualQaStatus: "pending" | "needs_revision" | "accepted" | "accepted_with_minor_issues" | "blocked" | null;
  visualRevisionCount: number;
  finalTemporarySatisfaction: FinalTemporarySatisfaction | null;
};

type SnapshotIdentityRow = {
  display_name: string | null;
  professional_title: string | null;
  brokerage_name: string | null;
  target_audience: string | null;
  specialties: string[];
  personal_context: string | null;
  primary_brand_color: string | null;
  secondary_brand_color: string | null;
};

function databaseError(operation: string, error: unknown): PostingError {
  return new PostingError(
    `PostgreSQL ${operation} failed: ${toErrorMessage(error)}`,
    true,
  );
}

function parseStringArray(value: unknown): string[] | null {
  if (value === null) return null;
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }
  throw new PostingError("Posting run contains invalid media_urls", false);
}

export class ContextUserRepository {
  constructor(private readonly pool: Pool) {}

  async getRun(id: string): Promise<ContextUserRun> {
    const result = await this.pool.query<{
      id: string;
      schedule_id: string;
      occurrence_at: string;
      trigger_run_id: string | null;
      status: ContextUserRun["status"];
      zernio_request_id: string;
      zernio_post_id: string | null;
      media_urls: unknown;
      context_snapshot: unknown;
      creative_output: unknown;
      caption: string | null;
      history_summary: string | null;
      visual_qa_status: ContextUserRun["visualQaStatus"];
      visual_revision_count: number;
      final_temporary_satisfaction: unknown;
    }>(
      `select id,schedule_id,occurrence_at::text,trigger_run_id,status,zernio_request_id,
              zernio_post_id,media_urls,context_snapshot,creative_output,caption,
              history_summary,visual_qa_status,visual_revision_count,
              final_temporary_satisfaction
       from public.posting_runs where id=$1::uuid`,
      [id],
    );
    const row = result.rows[0];
    if (!row) throw new PostingError(`Posting run ${id} was not found`, false);
    return {
      id: row.id,
      scheduleId: row.schedule_id,
      occurrenceAt: row.occurrence_at,
      triggerRunId: row.trigger_run_id,
      status: row.status,
      zernioRequestId: row.zernio_request_id,
      zernioPostId: row.zernio_post_id,
      mediaUrls: parseStringArray(row.media_urls),
      contextSnapshot: row.context_snapshot === null
        ? null
        : contextSnapshotSchema.parse(row.context_snapshot),
      creativeOutput: row.creative_output === null
        ? null
        : creativeOutputSchema.parse(row.creative_output),
      caption: row.caption,
      historySummary: row.history_summary,
      visualQaStatus: row.visual_qa_status,
      visualRevisionCount: row.visual_revision_count,
      finalTemporarySatisfaction: row.final_temporary_satisfaction === null
        ? null
        : finalTemporarySatisfactionSchema.parse(row.final_temporary_satisfaction),
    };
  }

  async listUserAssets(input: {
    profileId: string;
    purposes?: string[];
    limit: number;
  }): Promise<ContextSnapshot["linkedAssets"]> {
    const result = await this.pool.query<{
      id: string; storage_key: string; purpose: ContextSnapshot["linkedAssets"][number]["purpose"];
      mime_type: ContextSnapshot["linkedAssets"][number]["mimeType"]; width: number; height: number;
    }>(
      `select id,storage_key,purpose,mime_type,width,height
       from public.social_media_assets
       where profile_id=$1::uuid and deleted_at is null
         and ($2::text[] is null or purpose=any($2::text[]))
       order by created_at desc,id desc limit $3`,
      [input.profileId, input.purposes?.length ? input.purposes : null, input.limit],
    );
    return result.rows.map((row) => ({
      id: row.id, storageKey: row.storage_key, purpose: row.purpose,
      mimeType: row.mime_type, width: row.width, height: row.height,
    }));
  }

  async freezeContextSnapshot(postingRunId: string): Promise<ContextSnapshot> {
    const client = await this.pool.connect();
    try {
      await client.query("begin isolation level repeatable read");
      const ownerResult = await client.query<{
        profile_id: string;
        occurrence_at: string;
        context_snapshot: unknown;
      }>(
        `select s.profile_id,pr.occurrence_at::text,pr.context_snapshot
         from public.posting_runs pr
         join public.schedules s on s.id=pr.schedule_id
         where pr.id=$1::uuid
         for update of pr`,
        [postingRunId],
      );
      const owner = ownerResult.rows[0];
      if (!owner?.profile_id) {
        throw new PostingError("Posting occurrence has no trusted profile", false);
      }
      if (owner.context_snapshot !== null) {
        const existing = contextSnapshotSchema.parse(owner.context_snapshot);
        await client.query("commit");
        return existing;
      }

      const [stateResult, identityResult, marketsResult, preferenceResult,
        frequencyResult, temporaryResult, linksResult, historyResult] = await Promise.all([
        client.query<{ revision: string; time_zone: string }>(
          `select revision::text,time_zone from public.social_media_context_states
           where profile_id=$1::uuid`, [owner.profile_id]),
        client.query<SnapshotIdentityRow>(
          `select display_name,professional_title,brokerage_name,target_audience,
                  specialties,personal_context,primary_brand_color,secondary_brand_color
           from public.social_media_identities where profile_id=$1::uuid`, [owner.profile_id]),
        client.query<{ city_name: string; state_code: string; color: string | null }>(
          `select c.city_name,c.state_code,c.color
           from public.social_media_identities_cities_connections x
           join public.social_media_cities c on c.id=x.city_id
           where x.profile_id=$1::uuid order by x.created_at,x.id`, [owner.profile_id]),
        client.query<{ id: string; instruction: string }>(
          `select id,instruction from public.social_media_preferences
           where profile_id=$1::uuid order by created_at,id`, [owner.profile_id]),
        client.query<{ id: string; instruction: string }>(
          `select id,instruction from public.social_media_frequency_based_instructions
           where profile_id=$1::uuid order by created_at,id`, [owner.profile_id]),
        client.query<{
          id: string; instruction: string; instruction_type: "counter" | "date_range";
          remaining_posts: number | null; starts_at: string | null; ends_at: string | null;
          source_time_zone: string; source_note_id: string;
        }>(
          `select id,instruction,instruction_type,remaining_posts,starts_at::text,ends_at::text,
                  source_time_zone,source_note_id
           from public.social_media_temporary_instructions
           where profile_id=$1::uuid and (
             (instruction_type='counter' and remaining_posts>0)
             or (instruction_type='date_range' and starts_at <= $2::timestamptz and $2::timestamptz < ends_at)
           ) order by created_at,id`, [owner.profile_id, owner.occurrence_at]),
        client.query<{
          context_type: "preference" | "frequency" | "temporary";
          context_id: string; asset_id: string; storage_key: string; purpose: ContextSnapshot["linkedAssets"][number]["purpose"];
          mime_type: ContextSnapshot["linkedAssets"][number]["mimeType"]; width: number; height: number; deleted_at: string | null;
        }>(
          `select links.context_type,links.context_id,a.id asset_id,a.storage_key,a.purpose,
                  a.mime_type,a.width,a.height,a.deleted_at::text
           from (
             select 'preference'::text context_type,preference_id context_id,asset_id,profile_id
             from public.social_media_preference_assets where profile_id=$1::uuid
             union all
             select 'frequency',frequency_instruction_id,asset_id,profile_id
             from public.social_media_frequency_instruction_assets where profile_id=$1::uuid
             union all
             select 'temporary',temporary_instruction_id,asset_id,profile_id
             from public.social_media_temporary_instruction_assets where profile_id=$1::uuid
           ) links
           join public.social_media_assets a on a.id=links.asset_id and a.profile_id=links.profile_id`, [owner.profile_id]),
        client.query<{ published_at: string; summary: string }>(
          `select published_at::text,summary from public.social_media_past_posts
           where profile_id=$1::uuid order by published_at desc limit 16`, [owner.profile_id]),
      ]);

      const state = stateResult.rows[0];
      if (!state) throw new PostingError("Profile context state is missing", false);
      const identity = identityResult.rows[0] ?? {
        display_name: null, professional_title: null, brokerage_name: null,
        target_audience: null, specialties: [], personal_context: null,
        primary_brand_color: null, secondary_brand_color: null,
      };
      const preferenceIds = new Set(preferenceResult.rows.map((row) => row.id));
      const frequencyIds = new Set(frequencyResult.rows.map((row) => row.id));
      const temporaryIds = new Set(temporaryResult.rows.map((row) => row.id));
      const includedLinks = linksResult.rows.filter((row) =>
        (row.context_type === "preference" && preferenceIds.has(row.context_id)) ||
        (row.context_type === "frequency" && frequencyIds.has(row.context_id)) ||
        (row.context_type === "temporary" && temporaryIds.has(row.context_id))
      );
      if (includedLinks.some((row) => row.deleted_at !== null)) {
        throw new PostingError("Active context references a retired asset", false);
      }
      const refs = (type: typeof includedLinks[number]["context_type"], id: string) =>
        includedLinks.filter((row) => row.context_type === type && row.context_id === id)
          .map((row) => row.asset_id);
      const assetsById = new Map(includedLinks.map((row) => [row.asset_id, row]));

      const snapshot = contextSnapshotSchema.parse({
        schemaVersion: "social-context-snapshot.v1",
        ownerProfileId: owner.profile_id,
        occurrenceAt: new Date(owner.occurrence_at).toISOString(),
        contextRevision: Number(state.revision),
        canonicalTimeZone: state.time_zone,
        identity: {
          displayName: identity.display_name,
          professionalTitle: identity.professional_title,
          brokerageName: identity.brokerage_name,
          markets: marketsResult.rows.map((row) => ({
            cityName: row.city_name, stateCode: row.state_code, color: row.color,
          })),
          targetAudience: identity.target_audience,
          specialties: identity.specialties,
          personalContext: identity.personal_context,
          primaryBrandColor: identity.primary_brand_color,
          secondaryBrandColor: identity.secondary_brand_color,
        },
        preferences: preferenceResult.rows.map((row) => ({
          id: row.id, instruction: row.instruction, assetRefs: refs("preference", row.id),
        })),
        frequencyInstructions: frequencyResult.rows.map((row) => ({
          id: row.id, instruction: row.instruction, assetRefs: refs("frequency", row.id),
        })),
        activeTemporaryInstructions: temporaryResult.rows.map((row) => ({
          id: row.id, instruction: row.instruction, instructionType: row.instruction_type,
          remainingPostsAtSnapshot: row.remaining_posts,
          startsAt: row.starts_at ? new Date(row.starts_at).toISOString() : null,
          endsAt: row.ends_at ? new Date(row.ends_at).toISOString() : null,
          sourceTimeZone: row.source_time_zone, sourceNoteId: row.source_note_id,
          assetRefs: refs("temporary", row.id),
        })),
        linkedAssets: [...assetsById.values()].map((row) => ({
          id: row.asset_id, storageKey: row.storage_key, purpose: row.purpose,
          mimeType: row.mime_type, width: row.width, height: row.height,
        })),
        recentPublishedPosts: historyResult.rows.map((row) => ({
          publishedAt: new Date(row.published_at).toISOString(), summary: row.summary,
        })),
      });

      const saved = await client.query(
        `update public.posting_runs set context_snapshot=$1::jsonb,updated_at=now()
         where id=$2::uuid and context_snapshot is null`,
        [JSON.stringify(snapshot), postingRunId],
      );
      if (saved.rowCount !== 1) throw new PostingError("Context snapshot write lost its occurrence lock", true);
      await client.query("commit");
      return snapshot;
    } catch (error) {
      await client.query("rollback").catch(() => undefined);
      if (error instanceof PostingError) throw error;
      throw databaseError("context snapshot", error);
    } finally {
      client.release();
    }
  }

  async saveCreative(input: {
    postingRunId: string; triggerRunId: string; creative: CreativeOutput;
    caption: string; historySummary: string;
  }): Promise<void> {
    const result = await this.pool.query(
      `update public.posting_runs
       set creative_output=$1::jsonb,caption=$2,history_summary=$3,
           visual_qa_status='pending',updated_at=now()
       where id=$4::uuid and trigger_run_id=$5 and status='processing'
         and creative_output is null`,
      [JSON.stringify(input.creative), input.caption, input.historySummary,
        input.postingRunId, input.triggerRunId],
    );
    if (result.rowCount !== 1) {
      const current = await this.getRun(input.postingRunId);
      if (!current.creativeOutput) throw new PostingError("Creative output was not persisted", true);
    }
  }

  async getMedia(postingRunId: string): Promise<MediaRow[]> {
    const result = await this.pool.query<MediaRow>(
      `select id,created_at::text,schedule_id,image_design,display_order,
              template_id,post_project_id,posting_run_id
       from public.media where posting_run_id=$1::uuid
       order by display_order,created_at,id`, [postingRunId]);
    return result.rows;
  }

  async replaceMedia(input: {
    postingRunId: string;
    triggerRunId: string;
    slides: Array<{ displayOrder: number; fabricJson: Record<string, unknown> }>;
    revisionCount: number;
    revisionPending: boolean;
  }): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const fenced = await client.query(
        `select 1 from public.posting_runs
         where id=$1::uuid and trigger_run_id=$2 and status='processing'
         for update`,
        [input.postingRunId, input.triggerRunId],
      );
      if (fenced.rowCount !== 1) throw new PostingError("Posting-run media write lost its occurrence lease", true);
      await client.query("delete from public.media where posting_run_id=$1::uuid", [input.postingRunId]);
      for (const slide of input.slides) {
        await client.query(
          `insert into public.media (posting_run_id,display_order,image_design)
           values ($1::uuid,$2,$3::jsonb)`,
          [input.postingRunId, slide.displayOrder, JSON.stringify(slide.fabricJson)],
        );
      }
      if (input.revisionPending) {
        const revised = await client.query(
          `update public.posting_runs set visual_revision_count=$1,
             visual_qa_status='needs_revision',final_temporary_satisfaction=null,updated_at=now()
           where id=$2::uuid and trigger_run_id=$3 and status='processing'
             and visual_revision_count < $1`,
          [input.revisionCount, input.postingRunId, input.triggerRunId],
        );
        if (revised.rowCount !== 1) {
          throw new PostingError("Visual revision count was not advanced with its design", true);
        }
      }
      await client.query("commit");
    } catch (error) {
      await client.query("rollback").catch(() => undefined);
      throw databaseError("posting-run media replacement", error);
    } finally { client.release(); }
  }

  async saveFinalQa(input: {
    postingRunId: string; status: "accepted" | "accepted_with_minor_issues" | "blocked";
    satisfaction: FinalTemporarySatisfaction | null;
    triggerRunId: string;
  }): Promise<void> {
    const result = await this.pool.query(
      `update public.posting_runs set visual_qa_status=$1,
         final_temporary_satisfaction=$2::jsonb,updated_at=now()
       where id=$3::uuid and trigger_run_id=$4 and status='processing'`,
      [input.status, input.satisfaction ? JSON.stringify(input.satisfaction) : null,
        input.postingRunId, input.triggerRunId],
    );
    if (result.rowCount !== 1) throw new PostingError("Final visual QA was not persisted", true);
  }

  async finalize(postingRunId: string): Promise<boolean> {
    const result = await this.pool.query<{ finalize_context_user_post: boolean }>(
      `select public.finalize_context_user_post($1::uuid)`, [postingRunId]);
    return result.rows[0]?.finalize_context_user_post ?? false;
  }
}

export function mediaDesign(row: MediaRow): Json {
  if (!row.image_design) throw new PostingError(`Media ${row.id} has no Fabric design`, false);
  return row.image_design;
}
