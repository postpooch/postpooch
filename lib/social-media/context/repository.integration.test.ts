import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  IdempotencyKeyReusedError,
  ProcessingAttemptSupersededError,
  SocialMediaContextRepository,
} from "@/lib/social-media/context/repository";
import type { ContextSnapshot } from "@/lib/social-media/context/types";

function isolatedTestDatabaseUrl(): string | null {
  const raw = process.env.SOCIAL_MEDIA_CONTEXT_TEST_DATABASE_URL?.trim();
  if (!raw) return null;
  const parsed = new URL(raw);
  const localHost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "::1";
  const testDatabase = parsed.pathname.toLowerCase().includes("test");
  if (!localHost || !testDatabase) {
    throw new Error("SOCIAL_MEDIA_CONTEXT_TEST_DATABASE_URL must target a local database whose name contains 'test'.");
  }
  return raw;
}

const testDatabaseUrl = isolatedTestDatabaseUrl();
const integration = describe.skipIf(!testDatabaseUrl);

integration("SocialMediaContextRepository integration", () => {
  const pool = new Pool({ connectionString: testDatabaseUrl!, ssl: false });
  const profileId = randomUUID();
  const cityId = randomUUID();
  const repository = new SocialMediaContextRepository(profileId, pool);

  beforeAll(async () => {
    const migration = await pool.query(
      `select 1 from supabase_migrations.schema_migrations where version='20260925000000'`,
    );
    if (!migration.rowCount) throw new Error("Apply the context-builder migration to the isolated test database first.");
    await pool.query(
      `insert into auth.users (id,aud,role,email,created_at,updated_at)
       values ($1,'authenticated','authenticated',$2,now(),now())`,
      [profileId, `context-test-${profileId}@example.invalid`],
    );
    await pool.query(`insert into public.profiles (id) values ($1)`, [profileId]);
    await pool.query(
      `insert into public.social_media_cities (id,city_name,state_code,color)
       values ($1,'Context Test City','AZ','#256F68')`,
      [cityId],
    );
  });

  afterAll(async () => {
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query("set local session_replication_role = replica");
      for (const table of [
        "social_media_context_changes",
        "social_media_note_outcomes",
        "social_media_note_processing",
        "social_media_temporary_instructions",
        "social_media_notes",
        "social_media_preferences",
        "social_media_frequency_based_instructions",
        "social_media_identities_cities_connections",
        "social_media_identities",
        "social_media_context_states",
      ]) {
        await client.query(`delete from public.${table} where profile_id=$1`, [profileId]);
      }
      await client.query(`delete from public.profiles where id=$1`, [profileId]);
      await client.query(`delete from auth.users where id=$1`, [profileId]);
      await client.query(`delete from public.social_media_cities where id=$1`, [cityId]);
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
      await pool.end();
    }
  });

  it("creates a missing state row and saves identity plus cities atomically with one revision bump", async () => {
    const saved = await repository.saveProfile({
      identity: {
        display_name: "Context Test Realtor",
        professional_title: "Associate Broker",
        brokerage_name: null,
        target_audience: null,
        specialties: ["Relocation"],
        personal_context: null,
        primary_brand_color: "#234E52",
        secondary_brand_color: null,
      },
      cityIds: [cityId],
      timeZone: "America/Phoenix",
    });
    expect(saved).toEqual({ changed: true, revision: 1 });
    const snapshot = await repository.getSnapshot();
    expect(snapshot.revision).toBe(1);
    expect(snapshot.identity.display_name).toBe("Context Test Realtor");
    expect(snapshot.markets.map((market) => market.cityId)).toEqual([cityId]);

    const unchanged = await repository.saveProfile({ identity: snapshot.identity, cityIds: [cityId], timeZone: snapshot.timeZone });
    expect(unchanged).toEqual({ changed: false, revision: 1 });
  });

  it("rolls back identity, city, and revision together on an invalid city", async () => {
    const before = await repository.getSnapshot();
    await expect(repository.saveProfile({
      identity: { ...before.identity, display_name: "Must Roll Back" },
      cityIds: [randomUUID()],
      timeZone: before.timeZone,
    })).rejects.toThrow();
    const after = await repository.getSnapshot();
    expect(after.revision).toBe(before.revision);
    expect(after.identity.display_name).toBe(before.identity.display_name);
    expect(after.markets).toEqual(before.markets);
  });

  it("enforces same-key/same-text replay and same-key/different-text conflict", async () => {
    const key = randomUUID();
    const first = await repository.createNote("Use fewer emojis", key);
    const replay = await repository.createNote("  Use fewer emojis  ", key);
    expect(first.created).toBe(true);
    expect(replay.created).toBe(false);
    expect(replay.noteId).toBe(first.noteId);
    await expect(repository.createNote("Use more emojis", key)).rejects.toBeInstanceOf(IdempotencyKeyReusedError);
  });

  it("stores needs-review and infrastructure-failure outcomes without mutation plans", async () => {
    const snapshotRevision = (await repository.getSnapshot()).revision;
    const classification = {
      probabilities: { identity: 0.05, preference: 0.45, frequency: 0.8, temporary: 0.05 },
      temporaryType: {
        choice: "unclear" as const,
        confidence: 0.9,
        probabilities: { counter: 0.05, date_range: 0.05, unclear: 0.9 },
      },
      model: "integration-test",
      usage: { inputTokens: 1, outputTokens: 1 },
    };
    const cases = [
      {
        note: "Needs review without a plan",
        outcome: {
          state: "needs_review" as const,
          snapshotRevision,
          classification,
          reasonCode: "routing_uncertainty",
        },
        expectsClassification: true,
      },
      {
        note: "Infrastructure failure without a plan",
        outcome: {
          state: "infrastructure_failure" as const,
          snapshotRevision,
          reasonCode: "AI_OR_PROCESSING_FAILURE",
          detail: { retryable: true },
        },
        expectsClassification: false,
      },
    ];

    for (const testCase of cases) {
      const note = await repository.createNote(testCase.note, randomUUID());
      const claim = await repository.claimNote(note.noteId);
      await expect(repository.finishWithoutMutation(claim!, testCase.outcome)).resolves.toMatchObject({
        state: testCase.outcome.state,
      });
      const saved = await pool.query<{
        classification: unknown;
        mutation_plan: unknown;
        processing_status: string;
      }>(
        `select outcome.classification,outcome.mutation_plan,processing.status processing_status
         from public.social_media_note_outcomes outcome
         join public.social_media_note_processing processing
           on processing.note_id=outcome.note_id and processing.profile_id=outcome.profile_id
         where outcome.note_id=$1 and outcome.profile_id=$2`,
        [note.noteId, profileId],
      );
      expect(saved.rows[0]?.classification).toEqual(testCase.expectsClassification ? classification : null);
      expect(saved.rows[0]?.mutation_plan).toBeNull();
      expect(saved.rows[0]?.processing_status).toBe("finished");
    }
  });

  it("allows exactly one of two plans made from the same revision to apply", async () => {
    const snapshot = await repository.getSnapshot();
    const firstNote = await repository.createNote("Prefer short captions", randomUUID());
    const secondNote = await repository.createNote("Prefer direct captions", randomUUID());
    const firstClaim = await repository.claimNote(firstNote.noteId);
    const secondClaim = await repository.claimNote(secondNote.noteId);
    const classification = {
      probabilities: { identity: 0.01, preference: 0.99, frequency: 0.01, temporary: 0.01 },
      temporaryType: { choice: "unclear" as const, confidence: 1, probabilities: { counter: 0, date_range: 0, unclear: 1 } },
      model: "integration-test", usage: { inputTokens: 0, outputTokens: 0 },
    };
    const apply = (claim: NonNullable<typeof firstClaim>, text: string) => repository.applyPlan({
      claim,
      snapshot: snapshot as ContextSnapshot,
      operations: [{ kind: "list.add", category: "preference", text }],
      classification,
      mutationPlan: { disposition: "mutate", operations: [{ kind: "list.add", category: "preference", text }] },
      sourceNoteText: text,
    });
    const results = await Promise.all([apply(firstClaim!, "Prefer short captions"), apply(secondClaim!, "Prefer direct captions")]);
    expect(results.map((result) => result.state).sort()).toEqual(["applied", "conflict"]);
    const after = await repository.getSnapshot();
    expect(after.revision).toBe(snapshot.revision + 1);
    expect(after.preferences).toHaveLength(1);
  });

  it("fences a superseded attempt without outcome, audit, or revision changes", async () => {
    const note = await repository.createNote("Use fewer hashtags", randomUUID());
    const oldClaim = await repository.claimNote(note.noteId);
    await pool.query(
      `update public.social_media_note_processing set lease_expires_at=now()-interval '1 second'
       where note_id=$1 and profile_id=$2`,
      [note.noteId, profileId],
    );
    const newClaim = await repository.claimNote(note.noteId);
    expect(newClaim?.attemptNumber).toBe(2);
    const before = await repository.getSnapshot();
    await expect(repository.applyPlan({
      claim: oldClaim!, snapshot: before,
      operations: [{ kind: "list.add", category: "preference", text: "Use fewer hashtags" }],
      classification: { probabilities: { identity: 0.01, preference: 0.99, frequency: 0.01, temporary: 0.01 }, temporaryType: { choice: "unclear", confidence: 1, probabilities: { counter: 0, date_range: 0, unclear: 1 } }, model: "integration-test", usage: { inputTokens: 0, outputTokens: 0 } },
      mutationPlan: { disposition: "mutate", operations: [{ kind: "list.add", category: "preference", text: "Use fewer hashtags" }] },
      sourceNoteText: "Use fewer hashtags",
    })).rejects.toBeInstanceOf(ProcessingAttemptSupersededError);
    expect((await repository.getSnapshot()).revision).toBe(before.revision);
    const outcome = await pool.query(`select 1 from public.social_media_note_outcomes where note_id=$1`, [note.noteId]);
    expect(outcome.rowCount).toBe(0);
  });

  it("enforces RLS/no-policy grants and database-level append-only notes", async () => {
    const grants = await pool.query(`
      select
        has_table_privilege('service_role','public.social_media_notes','SELECT,INSERT,UPDATE,DELETE') as service,
        has_table_privilege('anon','public.social_media_notes','SELECT,INSERT,UPDATE,DELETE') as anon,
        has_table_privilege('authenticated','public.social_media_notes','SELECT,INSERT,UPDATE,DELETE') as authenticated,
        has_table_privilege('postpooch_worker','public.social_media_notes','SELECT,INSERT,UPDATE,DELETE') as worker
    `);
    expect(grants.rows[0]).toEqual({ service: false, anon: false, authenticated: false, worker: false });
    const note = await repository.createNote("Immutable note", randomUUID());
    await expect(pool.query(`update public.social_media_notes set note='changed' where id=$1 and profile_id=$2`, [note.noteId, profileId]))
      .rejects.toMatchObject({ code: "55000" });
  });
});
