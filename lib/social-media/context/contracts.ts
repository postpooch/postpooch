import { z } from "zod";

import { identityFieldKeySchema } from "@/lib/social-media/context/identity-registry";

export const contextCategorySchema = z.enum(["identity", "preference", "frequency", "temporary"]);
export type ContextCategory = z.infer<typeof contextCategorySchema>;

const shortText = z.string().trim().min(1).max(500);
const targetIndex = z.number().int().positive();
const assetHandles = z.array(z.string().regex(/^IMAGE_[1-9][0-9]*$/)).max(10).optional();

const identitySetOperationSchema = z.union([
  z.object({ kind: z.literal("identity.set"), field: z.literal("display_name"), value: z.string().trim().min(1).max(120) }).strict(),
  z.object({ kind: z.literal("identity.set"), field: z.literal("professional_title"), value: z.string().trim().min(1).max(120) }).strict(),
  z.object({ kind: z.literal("identity.set"), field: z.literal("brokerage_name"), value: z.string().trim().min(1).max(160) }).strict(),
  z.object({ kind: z.literal("identity.set"), field: z.literal("target_audience"), value: z.string().trim().min(1).max(1000) }).strict(),
  z.object({ kind: z.literal("identity.set"), field: z.literal("specialties"), value: z.array(z.string().trim().min(1).max(80)).max(20) }).strict(),
  z.object({ kind: z.literal("identity.set"), field: z.literal("personal_context"), value: z.string().trim().min(1).max(2000) }).strict(),
  z.object({ kind: z.literal("identity.set"), field: z.literal("primary_brand_color"), value: z.string().regex(/^#[0-9A-Fa-f]{6}$/) }).strict(),
  z.object({ kind: z.literal("identity.set"), field: z.literal("secondary_brand_color"), value: z.string().regex(/^#[0-9A-Fa-f]{6}$/) }).strict(),
]);

export const identityOperationSchema = z.union([
  identitySetOperationSchema,
  z.object({ kind: z.literal("identity.clear"), field: identityFieldKeySchema.exclude(["markets", "specialties"]) }).strict(),
  z.object({ kind: z.literal("identity.market_add"), cityName: z.string().trim().min(1).max(120), stateCode: z.string().trim().regex(/^[A-Za-z]{2}$/) }).strict(),
  z.object({ kind: z.literal("identity.market_delete"), targetIndex }).strict(),
]);

export const listOperationSchema = z.union([
  z.object({ kind: z.literal("list.add"), category: z.enum(["preference", "frequency"]), text: shortText, assetHandles }).strict(),
  z.object({ kind: z.literal("list.update"), category: z.enum(["preference", "frequency"]), targetIndex, text: shortText, assetHandles }).strict(),
  z.object({ kind: z.literal("list.delete"), category: z.enum(["preference", "frequency"]), targetIndex }).strict(),
]);

export const temporaryOperationSchema = z.union([
  z.object({ kind: z.literal("temporary.add_counter"), instruction: shortText, remainingPosts: z.number().int().min(1).max(100), assetHandles }).strict(),
  z.object({ kind: z.literal("temporary.add_date_range"), instruction: shortText, startsAt: z.string().datetime({ offset: true }), endsAt: z.string().datetime({ offset: true }), assetHandles }).strict(),
  z.object({ kind: z.literal("temporary.update_counter"), targetIndex, instruction: shortText, remainingPosts: z.number().int().min(1).max(100), assetHandles }).strict(),
  z.object({ kind: z.literal("temporary.update_date_range"), targetIndex, instruction: shortText, startsAt: z.string().datetime({ offset: true }), endsAt: z.string().datetime({ offset: true }), assetHandles }).strict(),
  z.object({ kind: z.literal("temporary.delete"), targetIndex }).strict(),
]);

export const contextOperationSchema = z.union([
  identityOperationSchema,
  listOperationSchema,
  temporaryOperationSchema,
]);
export type ContextOperation = z.infer<typeof contextOperationSchema>;

export const mutationPlanSchema = z.discriminatedUnion("disposition", [
  z.object({ disposition: z.literal("mutate"), operations: z.array(contextOperationSchema).min(1).max(12) }).strict(),
  z.object({ disposition: z.literal("no_change"), reasonCode: z.enum(["explicit_no_change", "already_satisfied"]) }).strict(),
  z.object({
    disposition: z.literal("needs_review"),
    reasonCode: z.enum([
      "ambiguous_target",
      "ambiguous_value",
      "unsupported_request",
      "unresolved_reference",
      "unresolved_time_boundary",
      "conflicting_instructions",
    ]),
  }).strict(),
]);
export type MutationPlan = z.infer<typeof mutationPlanSchema>;

export const dispositionOnlyPlanSchema = z.discriminatedUnion("disposition", [
  mutationPlanSchema.options[1],
  mutationPlanSchema.options[2],
]);

export const openAIWireMutationPlanSchema = z.object({ proposal: mutationPlanSchema }).strict();

export type PlannerIndexedRow = { index: number; text: string };
export type PlannerSnapshot = {
  revision: number;
  identity: Record<string, unknown>;
  markets: Array<{ index: number; cityName: string; stateCode: string }>;
  preferences: PlannerIndexedRow[];
  frequencyInstructions: PlannerIndexedRow[];
  temporaryInstructions: Array<{
    index: number;
    instruction: string;
    instructionType: "counter" | "date_range";
    remainingPosts: number | null;
    startsAt: string | null;
    endsAt: string | null;
  }>;
};

export type MutationPlannerInput = {
  note: string;
  routedCategories: ContextCategory[];
  snapshot: PlannerSnapshot;
  identityRegistry: unknown;
  referenceTimestamp: string;
  timeZone: string;
  attachedAssets?: Array<{
    handle: `IMAGE_${number}`;
    purpose: string;
    mimeType: string;
    dataUrl: string;
  }>;
};

export interface MutationPlanner {
  plan(input: MutationPlannerInput): Promise<MutationPlan>;
}

export type ResultState = "applied" | "no_change" | "needs_review" | "conflict" | "infrastructure_failure";
