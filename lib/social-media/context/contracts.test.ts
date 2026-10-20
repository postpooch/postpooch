import { describe, expect, it } from "vitest";

import { mutationPlanSchema, openAIWireMutationPlanSchema } from "@/lib/social-media/context/contracts";

describe("mutation contracts", () => {
  it("accepts the provider-independent discriminated union", () => {
    expect(mutationPlanSchema.parse({ disposition: "no_change", reasonCode: "explicit_no_change" })).toEqual({
      disposition: "no_change", reasonCode: "explicit_no_change",
    });
  });

  it("rejects unknown properties and more than twelve operations", () => {
    expect(mutationPlanSchema.safeParse({ disposition: "no_change", reasonCode: "explicit_no_change", sql: "delete" }).success).toBe(false);
    const operations = Array.from({ length: 13 }, () => ({ kind: "list.add", category: "preference", text: "Keep copy concise" }));
    expect(mutationPlanSchema.safeParse({ disposition: "mutate", operations }).success).toBe(false);
  });

  it("keeps the OpenAI object wrapper provider-local", () => {
    expect(openAIWireMutationPlanSchema.safeParse({ proposal: { disposition: "needs_review", reasonCode: "ambiguous_target" } }).success).toBe(true);
    expect(mutationPlanSchema.safeParse({ proposal: { disposition: "needs_review", reasonCode: "ambiguous_target" } }).success).toBe(false);
  });
});
