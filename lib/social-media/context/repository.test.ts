import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

import type { NoteClassification } from "@/lib/social-media/context/classification-policy";
import { IdempotencyKeyReusedError, SocialMediaContextRepository, canonicalizeNote } from "@/lib/social-media/context/repository";
import type { ContextSnapshot } from "@/lib/social-media/context/types";

const snapshot: ContextSnapshot = {
  revision: 5,
  timeZone: "America/Phoenix",
  identityId: null,
  identity: { display_name: null, professional_title: null, brokerage_name: null, target_audience: null, specialties: [], personal_context: null, primary_brand_color: null, secondary_brand_color: null },
  markets: [], preferences: [], frequencyInstructions: [], temporaryInstructions: [],
};

const testClassification: NoteClassification = {
  probabilities: { identity: 0.05, preference: 0.45, frequency: 0.8, temporary: 0.05 },
  temporaryType: {
    choice: "unclear",
    confidence: 0.9,
    probabilities: { counter: 0.05, date_range: 0.05, unclear: 0.9 },
  },
  model: "jev-test",
  usage: { inputTokens: 1, outputTokens: 1 },
};

describe("context repository invariants", () => {
  it("canonicalizes notes once with NFC and edge trimming", () => {
    expect(canonicalizeNote("  Cafe\u0301  keeps  spaces  ")).toBe("Café  keeps  spaces");
  });

  it("creates a missing state row at revision zero without a bump", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [], rowCount: 0 });
    const repository = new SocialMediaContextRepository("00000000-0000-4000-8000-000000000001", { query } as never);
    await repository.ensureContextState();
    expect(query).toHaveBeenCalledOnce();
    const [sql, params] = query.mock.calls[0];
    expect(sql).toMatch(/values \(\$1, 0\)/i);
    expect(sql).toMatch(/on conflict \(profile_id\) do nothing/i);
    expect(sql).not.toMatch(/revision\s*=\s*revision\s*\+/i);
    expect(params).toEqual(["00000000-0000-4000-8000-000000000001"]);
  });

  it("rejects reuse of an idempotency key with different canonical text", async () => {
    const query = vi.fn(async (sql: string) => {
      if (/insert into public\.social_media_notes/i.test(sql)) return { rows: [], rowCount: 0 };
      if (/select id,note from public\.social_media_notes/i.test(sql)) return { rows: [{ id: "note-1", note: "Original" }], rowCount: 1 };
      return { rows: [], rowCount: null };
    });
    const client = { query, release: vi.fn() };
    const repository = new SocialMediaContextRepository("00000000-0000-4000-8000-000000000001", { connect: async () => client } as never);
    await expect(repository.createNote("Different", "00000000-0000-4000-8000-000000000002")).rejects.toBeInstanceOf(IdempotencyKeyReusedError);
    expect(query).toHaveBeenCalledWith("rollback");
  });

  it("rolls back the entire profile save when a selected city is invalid", async () => {
    const query = vi.fn(async (sql: string) => {
      if (/select revision, time_zone/i.test(sql)) return { rows: [{ revision: "0", time_zone: "UTC" }], rowCount: 1 };
      if (/select id from public\.social_media_cities/i.test(sql)) return { rows: [], rowCount: 0 };
      return { rows: [], rowCount: null };
    });
    const client = { query, release: vi.fn() };
    const repository = new SocialMediaContextRepository("00000000-0000-4000-8000-000000000001", { connect: async () => client } as never);
    await expect(repository.saveProfile({
      identity: { display_name: "Alex", professional_title: null, brokerage_name: null, target_audience: null, specialties: [], personal_context: null, primary_brand_color: null, secondary_brand_color: null },
      cityIds: ["00000000-0000-4000-8000-000000000003"], timeZone: "America/Phoenix",
    })).rejects.toThrow(/selected cities/i);
    expect(query).toHaveBeenCalledWith("rollback");
    expect(query.mock.calls.some(([sql]) => /update public\.social_media_identities set/i.test(sql))).toBe(false);
    expect(query.mock.calls.some(([sql]) => /revision=revision\+1/i.test(sql))).toBe(false);
  });

  it("uses conflict only when the context revision CAS loses", async () => {
    const query = vi.fn(async (sql: string) => {
      if (/select 1 from public\.social_media_note_processing/i.test(sql)) return { rows: [{ "?column?": 1 }], rowCount: 1 };
      if (/update public\.social_media_context_states/i.test(sql)) return { rows: [], rowCount: 0 };
      if (/update public\.social_media_note_processing/i.test(sql)) return { rows: [], rowCount: 1 };
      return { rows: [], rowCount: 1 };
    });
    const client = { query, release: vi.fn() };
    const repository = new SocialMediaContextRepository("00000000-0000-4000-8000-000000000001", { connect: async () => client } as never);
    const result = await repository.applyPlan({
      claim: { noteId: "00000000-0000-4000-8000-000000000010", leaseToken: "00000000-0000-4000-8000-000000000011", attemptNumber: 1 },
      snapshot,
      operations: [{ kind: "list.add", category: "preference", text: "Use fewer emojis" }],
      classification: { probabilities: { identity: 0.01, preference: 0.99, frequency: 0.01, temporary: 0.01 }, temporaryType: { choice: "unclear", confidence: 1, probabilities: { counter: 0, date_range: 0, unclear: 1 } }, model: "test", usage: { inputTokens: 0, outputTokens: 0 } },
      mutationPlan: { disposition: "mutate", operations: [{ kind: "list.add", category: "preference", text: "Use fewer emojis" }] },
      sourceNoteText: "Use fewer emojis",
    });
    expect(result).toMatchObject({ state: "conflict", snapshotRevision: 5, committedRevision: null });
    expect(query.mock.calls.some(([sql]) => /insert into public\.social_media_preferences/i.test(sql))).toBe(false);
    expect(query.mock.calls.some(([sql]) => /insert into public\.social_media_context_changes/i.test(sql))).toBe(false);
  });

  it("rolls back a superseded attempt without outcome, revision, or audit writes", async () => {
    const query = vi.fn(async (sql: string) => {
      if (/select 1 from public\.social_media_note_processing/i.test(sql)) return { rows: [], rowCount: 0 };
      return { rows: [], rowCount: null };
    });
    const client = { query, release: vi.fn() };
    const repository = new SocialMediaContextRepository("00000000-0000-4000-8000-000000000001", { connect: async () => client } as never);
    await expect(repository.applyPlan({
      claim: { noteId: "00000000-0000-4000-8000-000000000010", leaseToken: "00000000-0000-4000-8000-000000000011", attemptNumber: 1 },
      snapshot, operations: [],
      classification: { probabilities: { identity: 0.01, preference: 0.99, frequency: 0.01, temporary: 0.01 }, temporaryType: { choice: "unclear", confidence: 1, probabilities: { counter: 0, date_range: 0, unclear: 1 } }, model: "test", usage: { inputTokens: 0, outputTokens: 0 } },
      mutationPlan: { disposition: "mutate", operations: [{ kind: "list.add", category: "preference", text: "Use fewer emojis" }] },
      sourceNoteText: "Use fewer emojis",
    })).rejects.toMatchObject({ code: "PROCESSING_ATTEMPT_SUPERSEDED" });
    expect(query).toHaveBeenCalledWith("rollback");
    expect(query.mock.calls.some(([sql]) => /social_media_note_outcomes|social_media_context_changes|revision=revision\+1/i.test(sql))).toBe(false);
  });

  it.each([
    {
      label: "needs_review",
      outcome: {
        state: "needs_review" as const,
        snapshotRevision: 7,
        classification: testClassification,
        reasonCode: "routing_uncertainty",
      },
      expectedClassification: testClassification,
    },
    {
      label: "infrastructure_failure",
      outcome: {
        state: "infrastructure_failure" as const,
        snapshotRevision: 7,
        reasonCode: "AI_OR_PROCESSING_FAILURE",
        detail: { retryable: true },
      },
      expectedClassification: null,
    },
  ])("stores missing JSON objects as SQL NULL for $label", async ({ outcome, expectedClassification }) => {
    let insertParameters: unknown[] | undefined;
    const query = vi.fn(async (sql: string, parameters?: unknown[]) => {
      if (/select 1 from public\.social_media_note_processing/i.test(sql)) {
        return { rows: [{ "?column?": 1 }], rowCount: 1 };
      }
      if (/insert into public\.social_media_note_outcomes/i.test(sql)) insertParameters = parameters;
      return { rows: [], rowCount: 1 };
    });
    const client = { query, release: vi.fn() };
    const repository = new SocialMediaContextRepository(
      "00000000-0000-4000-8000-000000000001",
      { connect: async () => client } as never,
    );

    await expect(repository.finishWithoutMutation({
      noteId: "00000000-0000-4000-8000-000000000010",
      leaseToken: "00000000-0000-4000-8000-000000000011",
      attemptNumber: 1,
    }, outcome)).resolves.toMatchObject({ state: outcome.state });

    expect(insertParameters).toBeDefined();
    expect(insertParameters?.[5]).toBe(expectedClassification === null ? null : JSON.stringify(expectedClassification));
    expect(insertParameters?.[6]).toBeNull();
    expect(query).toHaveBeenCalledWith("commit");
    expect(query).not.toHaveBeenCalledWith("rollback");
  });

  it("continues storing a defined mutation plan as a JSON object", async () => {
    let insertParameters: unknown[] | undefined;
    const query = vi.fn(async (sql: string, parameters?: unknown[]) => {
      if (/select 1 from public\.social_media_note_processing/i.test(sql)) {
        return { rows: [{ "?column?": 1 }], rowCount: 1 };
      }
      if (/insert into public\.social_media_note_outcomes/i.test(sql)) insertParameters = parameters;
      return { rows: [], rowCount: 1 };
    });
    const client = { query, release: vi.fn() };
    const repository = new SocialMediaContextRepository(
      "00000000-0000-4000-8000-000000000001",
      { connect: async () => client } as never,
    );
    const mutationPlan = { disposition: "no_change" as const, reasonCode: "explicit_no_change" as const };

    await repository.finishWithoutMutation({
      noteId: "00000000-0000-4000-8000-000000000010",
      leaseToken: "00000000-0000-4000-8000-000000000011",
      attemptNumber: 1,
    }, {
      state: "no_change",
      snapshotRevision: 7,
      classification: testClassification,
      mutationPlan,
      reasonCode: mutationPlan.reasonCode,
    });

    expect(insertParameters?.[5]).toBe(JSON.stringify(testClassification));
    expect(insertParameters?.[6]).toBe(JSON.stringify(mutationPlan));
  });

  it("keeps owner predicates, CAS, append-only triggers, RLS, and explicit role revokes in the migration", () => {
    const migration = readFileSync("supabase/migrations/20260925000000_social_media_context_builder.sql", "utf8");
    const repository = readFileSync("lib/social-media/context/repository.ts", "utf8");
    expect(repository).toMatch(/where profile_id=\$1 and revision=\$2 returning revision/i);
    expect(migration).toContain("social_media_notes_append_only");
    expect(migration).toContain("social_media_note_outcomes_append_only");
    expect(migration).toContain("social_media_context_changes_append_only");
    for (const role of ["public", "anon", "authenticated", "service_role", "postpooch_worker"]) {
      expect(migration.toLowerCase()).toContain(role);
    }
    expect(migration.match(/enable row level security/g)?.length).toBe(10);
  });
});
