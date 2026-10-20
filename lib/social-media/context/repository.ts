import "server-only";

import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";

import { getDbPool } from "@/lib/db/client";
import { identityColumnsByField } from "@/lib/social-media/context/identity-registry";
import type { MutationPlan } from "@/lib/social-media/context/contracts";
import type { NoteClassification } from "@/lib/social-media/context/classification-policy";
import type {
  ContextBuilderResult,
  ContextSnapshot,
  IdentityValues,
  OutcomeInput,
  ProcessingClaim,
  ValidatedOperation,
} from "@/lib/social-media/context/types";

type Queryable = Pick<Pool | PoolClient, "query">;

const EMPTY_IDENTITY: IdentityValues = {
  display_name: null,
  professional_title: null,
  brokerage_name: null,
  target_audience: null,
  specialties: [],
  personal_context: null,
  primary_brand_color: null,
  secondary_brand_color: null,
};

const IDENTITY_COLUMNS = [
  "display_name",
  "professional_title",
  "brokerage_name",
  "target_audience",
  "specialties",
  "personal_context",
  "primary_brand_color",
  "secondary_brand_color",
] as const;

export type ProfileSaveInput = {
  identity: IdentityValues;
  cityIds: string[];
  timeZone: string;
};

export class IdempotencyKeyReusedError extends Error {
  readonly code = "IDEMPOTENCY_KEY_REUSED";
  constructor() {
    super("This submission key was already used for different note text.");
    this.name = "IdempotencyKeyReusedError";
  }
}

export class ProcessingAttemptSupersededError extends Error {
  readonly code = "PROCESSING_ATTEMPT_SUPERSEDED";
  constructor() {
    super("This processing attempt no longer owns the note lease.");
    this.name = "ProcessingAttemptSupersededError";
  }
}

export class ContextRecordNotFoundError extends Error {
  constructor(message = "That context record could not be found.") {
    super(message);
    this.name = "ContextRecordNotFoundError";
  }
}

export class ContextRetryNotAllowedError extends Error {
  constructor() {
    super("Only conflicted or infrastructure-failed notes can be retried.");
    this.name = "ContextRetryNotAllowedError";
  }
}

function asNumber(value: string | number): number {
  return typeof value === "number" ? value : Number.parseInt(value, 10);
}

function jsonbParameter(value: unknown): string | null {
  return value === undefined ? null : JSON.stringify(value);
}

export function canonicalizeNote(note: string): string {
  return note.normalize("NFC").trim();
}

async function withTransaction<T>(pool: Pool, work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("begin");
    const result = await work(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

export class SocialMediaContextRepository {
  constructor(
    readonly profileId: string,
    private readonly pool: Pool = getDbPool(),
  ) {}

  async ensureContextState(db: Queryable = this.pool): Promise<void> {
    await db.query(
      `insert into public.social_media_context_states (profile_id, revision)
       values ($1, 0)
       on conflict (profile_id) do nothing`,
      [this.profileId],
    );
  }

  async getSnapshot(): Promise<ContextSnapshot> {
    await this.ensureContextState();
    return withTransaction(this.pool, async (client) => {
      await client.query("set transaction isolation level repeatable read read only");
      const state = await client.query<{ revision: string; time_zone: string }>(
        `select revision, time_zone from public.social_media_context_states where profile_id = $1`,
        [this.profileId],
      );
      const identityResult = await client.query<Record<string, unknown> & { id: string }>(
        `select id, ${IDENTITY_COLUMNS.join(", ")}
         from public.social_media_identities where profile_id = $1 limit 1`,
        [this.profileId],
      );
      const markets = await client.query<{
        id: string; city_id: string; city_name: string; state_code: string; color: string | null;
      }>(
        `select connection.id, city.id as city_id, city.city_name, city.state_code, city.color
         from public.social_media_identities_cities_connections connection
         join public.social_media_cities city on city.id = connection.city_id
         where connection.profile_id = $1
         order by connection.created_at, connection.id`,
        [this.profileId],
      );
      const preferences = await client.query<{ id: string; instruction: string }>(
        `select id, instruction from public.social_media_preferences
         where profile_id = $1 order by created_at, id`,
        [this.profileId],
      );
      const frequency = await client.query<{ id: string; instruction: string }>(
        `select id, instruction from public.social_media_frequency_based_instructions
         where profile_id = $1 order by created_at, id`,
        [this.profileId],
      );
      const temporary = await client.query<{
        id: string; instruction: string; instruction_type: "counter" | "date_range";
        remaining_posts: number | null; starts_at: Date | null; ends_at: Date | null;
      }>(
        `select id, instruction, instruction_type, remaining_posts, starts_at, ends_at
         from public.social_media_temporary_instructions
         where profile_id = $1 order by created_at, id`,
        [this.profileId],
      );
      const identityRow = identityResult.rows[0];
      const identity = identityRow ? {
        display_name: identityRow.display_name as string | null,
        professional_title: identityRow.professional_title as string | null,
        brokerage_name: identityRow.brokerage_name as string | null,
        target_audience: identityRow.target_audience as string | null,
        specialties: (identityRow.specialties as string[]) ?? [],
        personal_context: identityRow.personal_context as string | null,
        primary_brand_color: identityRow.primary_brand_color as string | null,
        secondary_brand_color: identityRow.secondary_brand_color as string | null,
      } : { ...EMPTY_IDENTITY };

      return {
        revision: asNumber(state.rows[0].revision),
        timeZone: state.rows[0].time_zone,
        identityId: identityRow?.id ?? null,
        identity,
        markets: markets.rows.map((row) => ({ id: row.id, cityId: row.city_id, cityName: row.city_name, stateCode: row.state_code, color: row.color })),
        preferences: preferences.rows.map((row) => ({ id: row.id, text: row.instruction })),
        frequencyInstructions: frequency.rows.map((row) => ({ id: row.id, text: row.instruction })),
        temporaryInstructions: temporary.rows.map((row) => ({
          id: row.id,
          instruction: row.instruction,
          instructionType: row.instruction_type,
          remainingPosts: row.remaining_posts,
          startsAt: row.starts_at?.toISOString() ?? null,
          endsAt: row.ends_at?.toISOString() ?? null,
        })),
      };
    });
  }

  async saveProfile(input: ProfileSaveInput): Promise<{ revision: number; changed: boolean }> {
    return withTransaction(this.pool, async (client) => {
      await this.ensureContextState(client);
      const state = await client.query<{ revision: string; time_zone: string }>(
        `select revision, time_zone from public.social_media_context_states
         where profile_id = $1 for update`,
        [this.profileId],
      );
      const cityIds = [...new Set(input.cityIds)];
      if (cityIds.length !== input.cityIds.length || cityIds.length > 20) throw new Error("Invalid city selection.");
      if (cityIds.length) {
        const valid = await client.query<{ id: string }>(
          `select id from public.social_media_cities where id = any($1::uuid[])`,
          [cityIds],
        );
        if (valid.rowCount !== cityIds.length) throw new ContextRecordNotFoundError("One or more selected cities do not exist.");
      }
      const identityResult = await client.query<Record<string, unknown> & { id: string }>(
        `select id, ${IDENTITY_COLUMNS.join(", ")} from public.social_media_identities
         where profile_id = $1 for update`,
        [this.profileId],
      );
      const currentIdentity = identityResult.rows[0];
      const currentCities = await client.query<{ city_id: string }>(
        `select city_id from public.social_media_identities_cities_connections
         where profile_id = $1 order by city_id`,
        [this.profileId],
      );
      const scalarChanged = IDENTITY_COLUMNS.some((column) =>
        JSON.stringify(currentIdentity?.[column] ?? EMPTY_IDENTITY[column]) !== JSON.stringify(input.identity[column]),
      );
      const currentCityIds = currentCities.rows.map((row) => row.city_id).sort();
      const citiesChanged = JSON.stringify(currentCityIds) !== JSON.stringify([...cityIds].sort());
      const timeZoneChanged = state.rows[0].time_zone !== input.timeZone;
      const changed = scalarChanged || citiesChanged || timeZoneChanged;
      if (!changed) return { revision: asNumber(state.rows[0].revision), changed: false };

      let identityId = currentIdentity?.id;
      if (!identityId) {
        const inserted = await client.query<{ id: string }>(
          `insert into public.social_media_identities
            (profile_id, display_name, professional_title, brokerage_name, target_audience,
             specialties, personal_context, primary_brand_color, secondary_brand_color)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`,
          [this.profileId, input.identity.display_name, input.identity.professional_title,
            input.identity.brokerage_name, input.identity.target_audience, input.identity.specialties,
            input.identity.personal_context, input.identity.primary_brand_color, input.identity.secondary_brand_color],
        );
        identityId = inserted.rows[0].id;
      } else if (scalarChanged) {
        await client.query(
          `update public.social_media_identities set
             display_name=$1, professional_title=$2, brokerage_name=$3, target_audience=$4,
             specialties=$5, personal_context=$6, primary_brand_color=$7, secondary_brand_color=$8,
             updated_at=now()
           where id=$9 and profile_id=$10`,
          [input.identity.display_name, input.identity.professional_title, input.identity.brokerage_name,
            input.identity.target_audience, input.identity.specialties, input.identity.personal_context,
            input.identity.primary_brand_color, input.identity.secondary_brand_color, identityId, this.profileId],
        );
      }
      if (citiesChanged) {
        await client.query(
          `delete from public.social_media_identities_cities_connections
           where profile_id=$1 and not (city_id = any($2::uuid[]))`,
          [this.profileId, cityIds],
        );
        if (cityIds.length) {
          await client.query(
            `insert into public.social_media_identities_cities_connections (profile_id, identity_id, city_id)
             select $1, $2, city_id from unnest($3::uuid[]) city_id
             on conflict (identity_id, city_id) do nothing`,
            [this.profileId, identityId, cityIds],
          );
        }
      }
      const revision = await client.query<{ revision: string }>(
        `update public.social_media_context_states
         set revision=revision+1, time_zone=$2, updated_at=now()
         where profile_id=$1 returning revision`,
        [this.profileId, input.timeZone],
      );
      return { revision: asNumber(revision.rows[0].revision), changed: true };
    });
  }

  async resolveExactCity(cityName: string, stateCode: string) {
    const result = await this.pool.query<{ id: string; city_name: string; state_code: string }>(
      `select id, city_name, state_code from public.social_media_cities
       where lower(city_name)=lower($1) and upper(state_code)=upper($2) order by id limit 2`,
      [cityName.trim(), stateCode.trim()],
    );
    return result.rows.map((row) => ({ id: row.id, cityName: row.city_name, stateCode: row.state_code }));
  }

  async connectCity(cityId: string): Promise<{ changed: boolean; revision: number }> {
    return withTransaction(this.pool, async (client) => {
      await this.ensureContextState(client);
      const state = await client.query<{ revision: string }>(
        `select revision from public.social_media_context_states where profile_id=$1 for update`, [this.profileId]);
      const city = await client.query(`select id from public.social_media_cities where id=$1`, [cityId]);
      if (!city.rowCount) throw new ContextRecordNotFoundError("That city could not be found.");
      const identity = await this.ensureIdentity(client);
      const inserted = await client.query(
        `insert into public.social_media_identities_cities_connections (profile_id, identity_id, city_id)
         values ($1,$2,$3) on conflict (identity_id,city_id) do nothing returning id`,
        [this.profileId, identity, cityId],
      );
      if (!inserted.rowCount) return { changed: false, revision: asNumber(state.rows[0].revision) };
      const revision = await this.bumpRevision(client);
      return { changed: true, revision };
    });
  }

  async disconnectCity(cityId: string): Promise<{ removed: boolean; revision: number | null }> {
    return withTransaction(this.pool, async (client) => {
      await this.ensureContextState(client);
      await client.query(`select revision from public.social_media_context_states where profile_id=$1 for update`, [this.profileId]);
      const deleted = await client.query(
        `delete from public.social_media_identities_cities_connections
         where profile_id=$1 and city_id=$2 returning id`, [this.profileId, cityId]);
      if (!deleted.rowCount) return { removed: false, revision: null };
      return { removed: true, revision: await this.bumpRevision(client) };
    });
  }

  private async ensureIdentity(client: PoolClient): Promise<string> {
    const existing = await client.query<{ id: string }>(
      `select id from public.social_media_identities where profile_id=$1`, [this.profileId]);
    if (existing.rows[0]) return existing.rows[0].id;
    const inserted = await client.query<{ id: string }>(
      `insert into public.social_media_identities (profile_id) values ($1) returning id`, [this.profileId]);
    return inserted.rows[0].id;
  }

  private async bumpRevision(client: PoolClient): Promise<number> {
    const result = await client.query<{ revision: string }>(
      `update public.social_media_context_states set revision=revision+1, updated_at=now()
       where profile_id=$1 returning revision`, [this.profileId]);
    return asNumber(result.rows[0].revision);
  }

  async createNote(noteText: string, submissionKey: string, assetIds: string[] = []): Promise<{
    noteId: string; created: boolean; processingStatus: "pending" | "processing" | "finished";
    outcome: ContextBuilderResult | null;
  }> {
    const note = canonicalizeNote(noteText);
    const canonicalAssetIds = [...new Set(assetIds)].sort();
    if (canonicalAssetIds.length !== assetIds.length || canonicalAssetIds.length > 10) {
      throw new Error("Note attachments must be unique and limited to ten images.");
    }
    return withTransaction(this.pool, async (client) => {
      if (canonicalAssetIds.length) {
        const owned = await client.query<{ id: string }>(
          `select id from public.social_media_assets
           where profile_id=$1 and id=any($2::uuid[]) and deleted_at is null`,
          [this.profileId, canonicalAssetIds],
        );
        if (owned.rowCount !== canonicalAssetIds.length) throw new ContextRecordNotFoundError("One or more attached images are unavailable.");
      }
      const inserted = await client.query<{ id: string }>(
        `insert into public.social_media_notes (profile_id,note,submission_key)
         values ($1,$2,$3) on conflict (profile_id,submission_key) do nothing returning id`,
        [this.profileId, note, submissionKey],
      );
      let noteId = inserted.rows[0]?.id;
      const created = Boolean(noteId);
      if (!noteId) {
        const existing = await client.query<{ id: string; note: string }>(
          `select id,note from public.social_media_notes where profile_id=$1 and submission_key=$2`,
          [this.profileId, submissionKey],
        );
        if (!existing.rows[0] || existing.rows[0].note !== note) throw new IdempotencyKeyReusedError();
        noteId = existing.rows[0].id;
      }
      if (created) {
        await client.query(
          `insert into public.social_media_note_processing (note_id,profile_id) values ($1,$2)`,
          [noteId, this.profileId],
        );
        for (const assetId of canonicalAssetIds) {
          await client.query(
            `insert into public.social_media_note_assets (profile_id,note_id,asset_id)
             values ($1,$2,$3::uuid)`, [this.profileId, noteId, assetId]);
        }
      } else {
        const existingAssets = await client.query<{ asset_id: string }>(
          `select asset_id from public.social_media_note_assets
           where profile_id=$1 and note_id=$2 order by asset_id`, [this.profileId, noteId]);
        if (JSON.stringify(existingAssets.rows.map((row) => row.asset_id)) !== JSON.stringify(canonicalAssetIds)) {
          throw new IdempotencyKeyReusedError();
        }
      }
      const processing = await client.query<{ status: "pending" | "processing" | "finished" }>(
        `select status from public.social_media_note_processing where note_id=$1 and profile_id=$2`,
        [noteId, this.profileId],
      );
      const outcome = await this.getLatestOutcome(noteId, client);
      return { noteId, created, processingStatus: processing.rows[0].status, outcome };
    });
  }

  async claimNote(noteId: string, allowFinishedRetry = false): Promise<ProcessingClaim | null> {
    const leaseToken = randomUUID();
    const result = await this.pool.query<{ attempt_count: number }>(
      `update public.social_media_note_processing
       set status='processing', attempt_count=attempt_count+1, lease_token=$3,
           lease_expires_at=now()+interval '2 minutes', updated_at=now()
       where note_id=$1 and profile_id=$2 and attempt_count < 10
         and (status='pending' or (status='processing' and lease_expires_at <= now())
              or ($4::boolean and status='finished'))
       returning attempt_count`,
      [noteId, this.profileId, leaseToken, allowFinishedRetry],
    );
    if (!result.rows[0]) return null;
    return { noteId, leaseToken, attemptNumber: result.rows[0].attempt_count };
  }

  async finishWithoutMutation(claim: ProcessingClaim, outcome: OutcomeInput): Promise<ContextBuilderResult> {
    return withTransaction(this.pool, async (client) => {
      await this.assertFence(client, claim);
      await client.query(
        `insert into public.social_media_note_outcomes
          (profile_id,note_id,attempt_number,result_state,snapshot_revision,classification,mutation_plan,reason_code,detail)
         values ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8,$9::jsonb)`,
        [this.profileId, claim.noteId, claim.attemptNumber, outcome.state, outcome.snapshotRevision,
          jsonbParameter(outcome.classification), jsonbParameter(outcome.mutationPlan),
          outcome.reasonCode ?? null, JSON.stringify(outcome.detail ?? {})],
      );
      await this.finishProcessing(client, claim);
      return {
        state: outcome.state,
        noteId: claim.noteId,
        attemptNumber: claim.attemptNumber,
        snapshotRevision: outcome.snapshotRevision,
        committedRevision: null,
        reasonCode: outcome.reasonCode ?? null,
      };
    });
  }

  async applyPlan(args: {
    claim: ProcessingClaim;
    snapshot: ContextSnapshot;
    operations: ValidatedOperation[];
    classification: NoteClassification;
    mutationPlan: MutationPlan;
    sourceNoteText: string;
  }): Promise<ContextBuilderResult> {
    return withTransaction(this.pool, async (client) => {
      await this.assertFence(client, args.claim);
      const revisionResult = await client.query<{ revision: string }>(
        `update public.social_media_context_states set revision=revision+1, updated_at=now()
         where profile_id=$1 and revision=$2 returning revision`,
        [this.profileId, args.snapshot.revision],
      );
      if (!revisionResult.rows[0]) {
        await client.query(
          `insert into public.social_media_note_outcomes
            (profile_id,note_id,attempt_number,result_state,snapshot_revision,classification,mutation_plan,reason_code)
           values ($1,$2,$3,'conflict',$4,$5::jsonb,$6::jsonb,'stale_context_revision')`,
          [this.profileId, args.claim.noteId, args.claim.attemptNumber, args.snapshot.revision,
            JSON.stringify(args.classification), JSON.stringify(args.mutationPlan)],
        );
        await this.finishProcessing(client, args.claim);
        return { state: "conflict", noteId: args.claim.noteId, attemptNumber: args.claim.attemptNumber,
          snapshotRevision: args.snapshot.revision, committedRevision: null, reasonCode: "stale_context_revision" };
      }
      const committedRevision = asNumber(revisionResult.rows[0].revision);
      const outcomeId = randomUUID();
      await client.query(
        `insert into public.social_media_note_outcomes
          (id,profile_id,note_id,attempt_number,result_state,snapshot_revision,committed_revision,classification,mutation_plan)
         values ($1,$2,$3,$4,'applied',$5,$6,$7::jsonb,$8::jsonb)`,
        [outcomeId, this.profileId, args.claim.noteId, args.claim.attemptNumber, args.snapshot.revision,
          committedRevision, JSON.stringify(args.classification), JSON.stringify(args.mutationPlan)],
      );
      for (const operation of args.operations) {
        const effect = await this.applyOperation(client, operation, args.snapshot, args.claim.noteId, args.sourceNoteText);
        await client.query(
          `insert into public.social_media_context_changes
            (profile_id,note_id,outcome_id,category,operation,target_type,target_id,target_key,before_value,after_value)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb)`,
          [this.profileId, args.claim.noteId, outcomeId, effect.category, effect.operation,
            effect.targetType, effect.targetId, effect.targetKey,
            effect.beforeValue == null ? null : JSON.stringify(effect.beforeValue),
            effect.afterValue == null ? null : JSON.stringify(effect.afterValue)],
        );
      }
      await this.finishProcessing(client, args.claim);
      return { state: "applied", noteId: args.claim.noteId, attemptNumber: args.claim.attemptNumber,
        snapshotRevision: args.snapshot.revision, committedRevision, reasonCode: null };
    });
  }

  private async assertFence(client: PoolClient, claim: ProcessingClaim) {
    const fence = await client.query(
      `select 1 from public.social_media_note_processing
       where note_id=$1 and profile_id=$2 and status='processing'
         and lease_token=$3 and lease_expires_at > now() for update`,
      [claim.noteId, this.profileId, claim.leaseToken],
    );
    if (!fence.rowCount) throw new ProcessingAttemptSupersededError();
  }

  private async finishProcessing(client: PoolClient, claim: ProcessingClaim) {
    const result = await client.query(
      `update public.social_media_note_processing set status='finished', lease_token=null,
         lease_expires_at=null, updated_at=now()
       where note_id=$1 and profile_id=$2 and lease_token=$3`,
      [claim.noteId, this.profileId, claim.leaseToken],
    );
    if (!result.rowCount) throw new ProcessingAttemptSupersededError();
  }

  async getLatestOutcome(noteId: string, db: Queryable = this.pool): Promise<ContextBuilderResult | null> {
    const result = await db.query<{
      result_state: ContextBuilderResult["state"]; attempt_number: number; snapshot_revision: string | null;
      committed_revision: string | null; reason_code: string | null;
    }>(
      `select result_state,attempt_number,snapshot_revision,committed_revision,reason_code
       from public.social_media_note_outcomes where note_id=$1 and profile_id=$2
       order by attempt_number desc limit 1`,
      [noteId, this.profileId],
    );
    const row = result.rows[0];
    return row ? { state: row.result_state, noteId, attemptNumber: row.attempt_number,
      snapshotRevision: row.snapshot_revision == null ? null : asNumber(row.snapshot_revision),
      committedRevision: row.committed_revision == null ? null : asNumber(row.committed_revision),
      reasonCode: row.reason_code } : null;
  }

  async getOwnedNote(noteId: string): Promise<{ id: string; note: string } | null> {
    const result = await this.pool.query<{ id: string; note: string }>(
      `select id,note from public.social_media_notes where id=$1 and profile_id=$2`, [noteId, this.profileId]);
    return result.rows[0] ?? null;
  }

  async getNoteAssetIds(noteId: string): Promise<string[]> {
    const result = await this.pool.query<{ asset_id: string }>(
      `select asset_id from public.social_media_note_assets
       where note_id=$1 and profile_id=$2 order by asset_id`, [noteId, this.profileId]);
    return result.rows.map((row) => row.asset_id);
  }

  async listNotes(limit = 50) {
    const result = await this.pool.query<{
      id: string; note: string; submission_key: string; created_at: Date;
      result_state: ContextBuilderResult["state"] | null; reason_code: string | null;
    }>(
      `select note.id,note.note,note.submission_key,note.created_at,
         outcome.result_state,outcome.reason_code
       from public.social_media_notes note
       left join lateral (
         select result_state,reason_code from public.social_media_note_outcomes
         where note_id=note.id and profile_id=$1 order by attempt_number desc limit 1
       ) outcome on true
       where note.profile_id=$1 order by note.created_at desc,note.id desc limit $2`,
      [this.profileId, Math.min(100, Math.max(1, limit))],
    );
    return result.rows.map((row) => ({ id: row.id, note: row.note, submissionKey: row.submission_key,
      createdAt: row.created_at.toISOString(), state: row.result_state, reasonCode: row.reason_code }));
  }

  private async replaceInstructionAssets(
    client: PoolClient,
    type: "preference" | "frequency" | "temporary",
    instructionId: string,
    assetIds: string[] | undefined,
  ): Promise<void> {
    if (assetIds === undefined) return;
    if (assetIds.length) {
      const owned = await client.query(
        `select id from public.social_media_assets
         where profile_id=$1 and id=any($2::uuid[]) and deleted_at is null`,
        [this.profileId, assetIds],
      );
      if (owned.rowCount !== assetIds.length) throw new ContextRecordNotFoundError("One or more linked images are unavailable.");
    }
    const config = type === "preference"
      ? { table: "public.social_media_preference_assets", column: "preference_id" }
      : type === "frequency"
        ? { table: "public.social_media_frequency_instruction_assets", column: "frequency_instruction_id" }
        : { table: "public.social_media_temporary_instruction_assets", column: "temporary_instruction_id" };
    await client.query(
      `delete from ${config.table} where profile_id=$1 and ${config.column}=$2::uuid`,
      [this.profileId, instructionId],
    );
    for (const assetId of assetIds) {
      await client.query(
        `insert into ${config.table} (profile_id,${config.column},asset_id)
         values ($1,$2::uuid,$3::uuid)`, [this.profileId, instructionId, assetId]);
    }
  }

  private async applyOperation(
    client: PoolClient,
    operation: ValidatedOperation,
    snapshot: ContextSnapshot,
    noteId: string,
    sourceNoteText: string,
  ): Promise<{ category: string; operation: string; targetType: string; targetId: string | null; targetKey: string | null; beforeValue: unknown; afterValue: unknown }> {
    if (operation.kind === "identity.set" || operation.kind === "identity.clear") {
      const column = identityColumnsByField.get(operation.field);
      if (!column) throw new Error("Identity column is not registered.");
      const identityId = await this.ensureIdentity(client);
      const before = snapshot.identity[operation.field];
      const after = operation.kind === "identity.clear" ? null : operation.value;
      const updated = await client.query(
        `update public.social_media_identities set ${column}=$1,updated_at=now()
         where id=$2 and profile_id=$3 returning id`, [after, identityId, this.profileId]);
      if (!updated.rowCount) throw new ContextRecordNotFoundError();
      return { category: "identity", operation: "update", targetType: "identity_field", targetId: identityId,
        targetKey: operation.field, beforeValue: { value: before }, afterValue: { value: after } };
    }
    if (operation.kind === "identity.market_add") {
      const identityId = await this.ensureIdentity(client);
      const inserted = await client.query<{ id: string }>(
        `insert into public.social_media_identities_cities_connections (profile_id,identity_id,city_id)
         values ($1,$2,$3) returning id`, [this.profileId, identityId, operation.cityId]);
      return { category: "identity", operation: "add", targetType: "market", targetId: inserted.rows[0].id,
        targetKey: null, beforeValue: null, afterValue: { cityId: operation.cityId, cityName: operation.cityName, stateCode: operation.stateCode } };
    }
    if (operation.kind === "identity.market_delete") {
      const before = snapshot.markets.find((row) => row.id === operation.targetId);
      const deleted = await client.query(
        `delete from public.social_media_identities_cities_connections where id=$1 and profile_id=$2 returning id`,
        [operation.targetId, this.profileId]);
      if (!deleted.rowCount || !before) throw new ContextRecordNotFoundError();
      return { category: "identity", operation: "delete", targetType: "market", targetId: operation.targetId,
        targetKey: null, beforeValue: before, afterValue: null };
    }
    if (operation.kind === "list.add" || operation.kind === "list.update" || operation.kind === "list.delete") {
      const table = operation.category === "preference"
        ? "public.social_media_preferences"
        : "public.social_media_frequency_based_instructions";
      const rows = operation.category === "preference" ? snapshot.preferences : snapshot.frequencyInstructions;
      if (operation.kind === "list.add") {
        const inserted = await client.query<{ id: string }>(
          `insert into ${table} (profile_id,instruction) values ($1,$2) returning id`, [this.profileId, operation.text]);
        await this.replaceInstructionAssets(client, operation.category, inserted.rows[0].id, operation.assetIds);
        return { category: operation.category, operation: "add", targetType: "instruction", targetId: inserted.rows[0].id,
          targetKey: null, beforeValue: null, afterValue: { text: operation.text, assetIds: operation.assetIds ?? [] } };
      }
      const before = rows.find((row) => row.id === operation.targetId);
      if (!before) throw new ContextRecordNotFoundError();
      if (operation.kind === "list.update") {
        const updated = await client.query(
          `update ${table} set instruction=$1,updated_at=now() where id=$2 and profile_id=$3 returning id`,
          [operation.text, operation.targetId, this.profileId]);
        if (!updated.rowCount) throw new ContextRecordNotFoundError();
        await this.replaceInstructionAssets(client, operation.category, operation.targetId, operation.assetIds);
        return { category: operation.category, operation: "update", targetType: "instruction", targetId: operation.targetId,
          targetKey: null, beforeValue: { text: before.text }, afterValue: { text: operation.text, assetIds: operation.assetIds } };
      }
      const deleted = await client.query(`delete from ${table} where id=$1 and profile_id=$2 returning id`, [operation.targetId, this.profileId]);
      if (!deleted.rowCount) throw new ContextRecordNotFoundError();
      return { category: operation.category, operation: "delete", targetType: "instruction", targetId: operation.targetId,
        targetKey: null, beforeValue: { text: before.text }, afterValue: null };
    }

    const temporaryBefore = "targetId" in operation
      ? snapshot.temporaryInstructions.find((row) => row.id === operation.targetId)
      : undefined;
    if (operation.kind === "temporary.add_counter" || operation.kind === "temporary.add_date_range") {
      const isCounter = operation.kind === "temporary.add_counter";
      const inserted = await client.query<{ id: string }>(
        `insert into public.social_media_temporary_instructions
          (profile_id,instruction,instruction_type,remaining_posts,starts_at,ends_at,source_time_zone,source_note_id,source_note_text)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`,
        [this.profileId, operation.instruction, isCounter ? "counter" : "date_range",
          isCounter ? operation.remainingPosts : null, isCounter ? null : operation.startsAt,
          isCounter ? null : operation.endsAt, snapshot.timeZone, noteId, sourceNoteText],
      );
      await this.replaceInstructionAssets(client, "temporary", inserted.rows[0].id, operation.assetIds);
      return { category: "temporary", operation: "add", targetType: "temporary_instruction", targetId: inserted.rows[0].id,
        targetKey: null, beforeValue: null, afterValue: operation };
    }
    if (!temporaryBefore) throw new ContextRecordNotFoundError();
    if (operation.kind === "temporary.delete") {
      const deleted = await client.query(
        `delete from public.social_media_temporary_instructions where id=$1 and profile_id=$2 returning id`,
        [operation.targetId, this.profileId]);
      if (!deleted.rowCount) throw new ContextRecordNotFoundError();
      return { category: "temporary", operation: "delete", targetType: "temporary_instruction", targetId: operation.targetId,
        targetKey: null, beforeValue: temporaryBefore, afterValue: null };
    }
    const isCounter = operation.kind === "temporary.update_counter";
    const updated = await client.query(
      `update public.social_media_temporary_instructions set instruction=$1,instruction_type=$2,
         remaining_posts=$3,starts_at=$4,ends_at=$5,source_time_zone=$6,source_note_id=$7,
         source_note_text=$8,updated_at=now()
       where id=$9 and profile_id=$10 returning id`,
      [operation.instruction, isCounter ? "counter" : "date_range", isCounter ? operation.remainingPosts : null,
        isCounter ? null : operation.startsAt, isCounter ? null : operation.endsAt, snapshot.timeZone,
        noteId, sourceNoteText, operation.targetId, this.profileId],
    );
    if (!updated.rowCount) throw new ContextRecordNotFoundError();
    await this.replaceInstructionAssets(client, "temporary", operation.targetId, operation.assetIds);
    return { category: "temporary", operation: "update", targetType: "temporary_instruction", targetId: operation.targetId,
      targetKey: null, beforeValue: temporaryBefore, afterValue: operation };
  }
}
