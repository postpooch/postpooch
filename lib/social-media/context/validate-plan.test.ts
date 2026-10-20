import { describe, expect, it } from "vitest";

import type { ContextSnapshot } from "@/lib/social-media/context/types";
import { PlanAlreadySatisfiedError, PlanNeedsReviewError, validateMutationPlan } from "@/lib/social-media/context/validate-plan";

const snapshot: ContextSnapshot = {
  revision: 4,
  timeZone: "America/Phoenix",
  identityId: "identity-1",
  identity: {
    display_name: "Alex", professional_title: null, brokerage_name: null, target_audience: null,
    specialties: [], personal_context: null, primary_brand_color: null, secondary_brand_color: null,
  },
  markets: [{ id: "connection-1", cityId: "city-1", cityName: "Tempe", stateCode: "AZ", color: null }],
  preferences: [{ id: "preference-1", text: "Use emojis often" }],
  frequencyInstructions: [],
  temporaryInstructions: [],
};

describe("deterministic mutation validation", () => {
  it("accepts legitimate identity updates and deletions", async () => {
    const operations = await validateMutationPlan({
      plan: {
        disposition: "mutate",
        operations: [
          { kind: "identity.set", field: "brokerage_name", value: "Desert Homes Realty" },
          { kind: "identity.clear", field: "display_name" },
        ],
      },
      routedCategories: ["identity"], snapshot, resolveCity: async () => [],
    });

    expect(operations).toEqual([
      { kind: "identity.set", field: "brokerage_name", value: "Desert Homes Realty" },
      { kind: "identity.clear", field: "display_name" },
    ]);
  });

  it("maps short model indices to trusted row ids", async () => {
    const operations = await validateMutationPlan({
      plan: { disposition: "mutate", operations: [{ kind: "list.update", category: "preference", targetIndex: 1, text: "Use emojis sparingly" }] },
      routedCategories: ["preference"], snapshot, resolveCity: async () => [],
    });
    expect(operations).toEqual([{ kind: "list.update", category: "preference", targetId: "preference-1", text: "Use emojis sparingly" }]);
  });

  it("rejects unrouted categories and nonexistent indices", async () => {
    await expect(validateMutationPlan({
      plan: { disposition: "mutate", operations: [{ kind: "list.delete", category: "preference", targetIndex: 1 }] },
      routedCategories: ["identity"], snapshot, resolveCity: async () => [],
    })).rejects.toThrow(/unrouted/);
    await expect(validateMutationPlan({
      plan: { disposition: "mutate", operations: [{ kind: "identity.market_delete", targetIndex: 2 }] },
      routedCategories: ["identity"], snapshot, resolveCity: async () => [],
    })).rejects.toBeInstanceOf(PlanNeedsReviewError);
  });

  it("requires an exact market match and bounded dates", async () => {
    await expect(validateMutationPlan({
      plan: { disposition: "mutate", operations: [{ kind: "identity.market_add", cityName: "Springfield", stateCode: "IL" }] },
      routedCategories: ["identity"], snapshot, resolveCity: async () => [],
    })).rejects.toMatchObject({ reasonCode: "ambiguous_value" });
    await expect(validateMutationPlan({
      plan: { disposition: "mutate", operations: [{ kind: "temporary.add_date_range", instruction: "Campaign", startsAt: "2026-01-02T00:00:00Z", endsAt: "2026-01-01T00:00:00Z" }] },
      routedCategories: ["temporary"], snapshot, resolveCity: async () => [],
    })).rejects.toMatchObject({ reasonCode: "unresolved_time_boundary" });
  });

  it("does not execute proposals that are already satisfied", async () => {
    await expect(validateMutationPlan({
      plan: { disposition: "mutate", operations: [{ kind: "identity.set", field: "display_name", value: "Alex" }] },
      routedCategories: ["identity"], snapshot, resolveCity: async () => [],
    })).rejects.toBeInstanceOf(PlanAlreadySatisfiedError);
  });

  it("resolves only supplied attachment handles and preserves attachment-only updates", async () => {
    const assetId = "22222222-2222-4222-8222-222222222222";
    await expect(validateMutationPlan({
      plan: { disposition: "mutate", operations: [{
        kind: "list.update", category: "preference", targetIndex: 1,
        text: "Use emojis often", assetHandles: ["IMAGE_99"],
      }] },
      routedCategories: ["preference"], snapshot, resolveCity: async () => [],
      attachedAssetByHandle: new Map(),
    })).rejects.toThrow("unknown attachment handle");

    await expect(validateMutationPlan({
      plan: { disposition: "mutate", operations: [{
        kind: "list.update", category: "preference", targetIndex: 1,
        text: "Use emojis often", assetHandles: ["IMAGE_1"],
      }] },
      routedCategories: ["preference"], snapshot, resolveCity: async () => [],
      attachedAssetByHandle: new Map([["IMAGE_1", assetId]]),
    })).resolves.toEqual([{
      kind: "list.update", category: "preference", targetId: "preference-1",
      text: "Use emojis often", assetIds: [assetId],
    }]);
  });
});
