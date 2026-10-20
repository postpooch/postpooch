import { describe, expect, it, vi } from "vitest";

import type { NoteClassification, NoteClassifier } from "@/lib/social-media/context/classification-policy";
import type { MutationPlanner } from "@/lib/social-media/context/contracts";
import { PlannerOutputError } from "@/lib/social-media/context/mutation-planner";
import { ProcessingAttemptSupersededError } from "@/lib/social-media/context/repository";
import { SocialMediaContextBuilderService, type SocialMediaContextRepositoryPort } from "@/lib/social-media/context/service";
import type { ContextSnapshot } from "@/lib/social-media/context/types";

const snapshot: ContextSnapshot = {
  revision: 5,
  timeZone: "America/Phoenix",
  identityId: null,
  identity: { display_name: null, professional_title: null, brokerage_name: null, target_audience: null, specialties: [], personal_context: null, primary_brand_color: null, secondary_brand_color: null },
  markets: [], preferences: [], frequencyInstructions: [], temporaryInstructions: [],
};

function classification(preference: number): NoteClassification {
  return {
    probabilities: { identity: 0.05, preference, frequency: 0.05, temporary: 0.05 },
    temporaryType: { choice: "unclear", confidence: 0.8, probabilities: { counter: 0.1, date_range: 0.1, unclear: 0.8 } },
    model: "jev-test", usage: { inputTokens: 1, outputTokens: 1 },
  };
}

function makeRepository(overrides: Partial<SocialMediaContextRepositoryPort> = {}) {
  return {
    profileId: "11111111-1111-4111-8111-111111111111",
    createNote: vi.fn().mockResolvedValue({ noteId: "note-1", created: true, processingStatus: "pending", outcome: null }),
    claimNote: vi.fn().mockResolvedValue({ noteId: "note-1", leaseToken: "lease-1", attemptNumber: 1 }),
    getOwnedNote: vi.fn().mockResolvedValue({ id: "note-1", note: "Use fewer emojis" }),
    getLatestOutcome: vi.fn().mockResolvedValue({ state: "conflict", noteId: "note-1", attemptNumber: 1, snapshotRevision: 4, committedRevision: null, reasonCode: "stale_context_revision" }),
    getNoteAssetIds: vi.fn().mockResolvedValue([]),
    getSnapshot: vi.fn().mockResolvedValue(snapshot),
    finishWithoutMutation: vi.fn().mockImplementation(async (_claim, outcome) => ({
      state: outcome.state, noteId: "note-1", attemptNumber: 1, snapshotRevision: outcome.snapshotRevision,
      committedRevision: null, reasonCode: outcome.reasonCode ?? null,
    })),
    resolveExactCity: vi.fn().mockResolvedValue([]),
    applyPlan: vi.fn().mockResolvedValue({ state: "applied", noteId: "note-1", attemptNumber: 1, snapshotRevision: 5, committedRevision: 6, reasonCode: null }),
    ...overrides,
  } as SocialMediaContextRepositoryPort;
}

describe("context builder service", () => {
  it("persists and claims the note before calling Jev", async () => {
    const order: string[] = [];
    const repository = makeRepository({
      createNote: vi.fn(async () => { order.push("persist"); return { noteId: "note-1", created: true, processingStatus: "pending" as const, outcome: null }; }),
      claimNote: vi.fn(async () => { order.push("claim"); return { noteId: "note-1", leaseToken: "lease", attemptNumber: 1 }; }),
    });
    const classifier: NoteClassifier = { classify: vi.fn(async () => { order.push("classify"); return classification(0.5); }) };
    const result = await new SocialMediaContextBuilderService(repository, { classifierFactory: () => classifier }).submit("Use fewer emojis", crypto.randomUUID());
    expect(order).toEqual(["persist", "claim", "classify"]);
    expect(result).toMatchObject({ kind: "result", result: { state: "needs_review", reasonCode: "routing_uncertainty" } });
  });

  it("does not invoke the planner on routing uncertainty", async () => {
    const planner: MutationPlanner = { plan: vi.fn() };
    const service = new SocialMediaContextBuilderService(makeRepository(), {
      classifierFactory: () => ({ classify: async () => classification(0.5) }),
      plannerFactory: () => planner,
    });
    await service.submit("Make it more like me", crypto.randomUUID());
    expect(planner.plan).not.toHaveBeenCalled();
  });

  it("turns classifier infrastructure failure into an outcome without planner fallback", async () => {
    const repository = makeRepository();
    const planner: MutationPlanner = { plan: vi.fn() };
    const service = new SocialMediaContextBuilderService(repository, {
      classifierFactory: () => ({ classify: async () => { throw new Error("TypeSafe unavailable"); } }),
      plannerFactory: () => planner,
    });
    const result = await service.submit("Use fewer emojis", crypto.randomUUID());
    expect(result).toMatchObject({ kind: "result", result: { state: "infrastructure_failure" } });
    expect(planner.plan).not.toHaveBeenCalled();
    expect(repository.finishWithoutMutation).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ state: "infrastructure_failure" }));
  });

  it("records a Jev timeout as retryable without planning or applying mutations", async () => {
    const timeout = new Error("Request timed out after 8000ms.");
    timeout.name = "APITimeoutError";
    const repository = makeRepository();
    const planner: MutationPlanner = { plan: vi.fn() };
    const service = new SocialMediaContextBuilderService(repository, {
      classifierFactory: () => ({ classify: async () => { throw timeout; } }),
      plannerFactory: () => planner,
    });

    const result = await service.submit("My new brokerage is Coldwell Banker.", crypto.randomUUID());

    expect(result).toMatchObject({
      kind: "result",
      result: { state: "infrastructure_failure", reasonCode: "AI_OR_PROCESSING_FAILURE" },
    });
    expect(planner.plan).not.toHaveBeenCalled();
    expect(repository.applyPlan).not.toHaveBeenCalled();
    expect(repository.finishWithoutMutation).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      state: "infrastructure_failure",
      classification: undefined,
      reasonCode: "AI_OR_PROCESSING_FAILURE",
      detail: { retryable: true },
    }));
  });

  it("cannot apply mutations when the planner response is missing or invalid", async () => {
    const repository = makeRepository();
    const service = new SocialMediaContextBuilderService(repository, {
      classifierFactory: () => ({ classify: async () => classification(0.95) }),
      plannerFactory: () => ({
        plan: async () => { throw new PlannerOutputError("invalid_json"); },
      }),
    });

    const result = await service.submit("Use fewer emojis", crypto.randomUUID());

    expect(result).toMatchObject({ kind: "result", result: { state: "infrastructure_failure" } });
    expect(repository.applyPlan).not.toHaveBeenCalled();
    expect(repository.finishWithoutMutation).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      state: "infrastructure_failure",
      detail: { retryable: true },
    }));
  });

  it("records an OpenRouter HTTP 502 as retryable without applying mutations", async () => {
    const repository = makeRepository();
    const service = new SocialMediaContextBuilderService(repository, {
      classifierFactory: () => ({ classify: async () => classification(0.95) }),
      plannerFactory: () => ({
        plan: async () => { throw new Error("OpenRouter request failed with status 502"); },
      }),
    });

    const result = await service.submit("Use fewer emojis", crypto.randomUUID());

    expect(result).toMatchObject({ kind: "result", result: { state: "infrastructure_failure" } });
    expect(repository.applyPlan).not.toHaveBeenCalled();
    expect(repository.finishWithoutMutation).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      state: "infrastructure_failure",
      detail: { retryable: true },
    }));
  });

  it("allows a retryable infrastructure failure to be processed again", async () => {
    const repository = makeRepository({
      getLatestOutcome: vi.fn().mockResolvedValue({
        state: "infrastructure_failure", noteId: "note-1", attemptNumber: 1,
        snapshotRevision: 5, committedRevision: null, reasonCode: "AI_OR_PROCESSING_FAILURE",
      }),
    });
    const service = new SocialMediaContextBuilderService(repository, {
      classifierFactory: () => ({ classify: async () => classification(0.95) }),
      plannerFactory: () => ({
        plan: async () => ({
          disposition: "mutate",
          operations: [{ kind: "list.add", category: "preference", text: "Use fewer emojis" }],
        }),
      }),
    });

    const result = await service.retry("note-1");

    expect(result).toMatchObject({ kind: "result", result: { state: "applied" } });
    expect(repository.claimNote).toHaveBeenCalledWith("note-1", true);
    expect(repository.applyPlan).toHaveBeenCalledTimes(1);
  });

  it("returns stale revision conflict only from the repository CAS", async () => {
    const repository = makeRepository({
      applyPlan: vi.fn().mockResolvedValue({ state: "conflict", noteId: "note-1", attemptNumber: 1, snapshotRevision: 5, committedRevision: null, reasonCode: "stale_context_revision" }),
    });
    const service = new SocialMediaContextBuilderService(repository, {
      classifierFactory: () => ({ classify: async () => classification(0.95) }),
      plannerFactory: () => ({ plan: async () => ({ disposition: "mutate", operations: [{ kind: "list.add", category: "preference", text: "Use fewer emojis" }] }) }),
    });
    const result = await service.submit("Use fewer emojis", crypto.randomUUID());
    expect(result).toMatchObject({ kind: "result", result: { state: "conflict", reasonCode: "stale_context_revision" } });
  });

  it("keeps the complete realtor note available to planning and mutation persistence", async () => {
    const note = "Use a friendly tone, and make the next two posts about open houses.\nKeep both instructions.";
    const repository = makeRepository();
    const plan = vi.fn().mockResolvedValue({
      disposition: "mutate" as const,
      operations: [{ kind: "list.add" as const, category: "preference" as const, text: "Use a friendly tone" }],
    });
    const service = new SocialMediaContextBuilderService(repository, {
      classifierFactory: () => ({ classify: async () => classification(0.95) }),
      plannerFactory: () => ({ plan }),
    });

    await service.submit(note, crypto.randomUUID());

    expect(plan).toHaveBeenCalledWith(expect.objectContaining({ note }));
    expect(repository.applyPlan).toHaveBeenCalledWith(expect.objectContaining({ sourceNoteText: note }));
  });

  it("prints the complete rejected planner decision when validation catches an invalid category", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const repository = makeRepository();
    const service = new SocialMediaContextBuilderService(repository, {
      classifierFactory: () => ({ classify: async () => classification(0.95) }),
      plannerFactory: () => ({
        plan: async () => ({
          disposition: "mutate",
          operations: [{ kind: "identity.set", field: "personal_context", value: "Use a bunch of emojis" }],
        }),
      }),
    });

    try {
      const result = await service.submit("Please use a bunch of emojis in my posts.", crypto.randomUUID());

      expect(result).toMatchObject({ kind: "result", result: { state: "infrastructure_failure" } });
      expect(consoleError).toHaveBeenCalledTimes(1);
      expect(consoleError.mock.calls[0]?.[0]).toBe("[social-media-context][TEMP planner rejection diagnostic]");
      const diagnostic = JSON.parse(String(consoleError.mock.calls[0]?.[1])) as Record<string, unknown>;
      expect(diagnostic).toMatchObject({
        validationError: { message: "Planner proposed an unrouted identity operation." },
        noteId: "note-1",
        note: "Please use a bunch of emojis in my posts.",
        routedCategories: ["preference"],
        rejectedMutationPlan: {
          disposition: "mutate",
          operations: [{ kind: "identity.set", field: "personal_context", value: "Use a bunch of emojis" }],
        },
      });
    } finally {
      consoleError.mockRestore();
    }
  });

  it("never overwrites a superseded processing attempt", async () => {
    const repository = makeRepository({
      finishWithoutMutation: vi.fn().mockRejectedValue(new ProcessingAttemptSupersededError()),
    });
    const service = new SocialMediaContextBuilderService(repository, {
      classifierFactory: () => ({ classify: async () => classification(0.5) }),
    });
    await expect(service.submit("Use fewer emojis", crypto.randomUUID())).rejects.toBeInstanceOf(ProcessingAttemptSupersededError);
    expect(repository.finishWithoutMutation).toHaveBeenCalledTimes(1);
  });
});
