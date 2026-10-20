import type { NoteClassification } from "@/lib/social-media/context/classification-policy";
import type { MutationPlan, ResultState } from "@/lib/social-media/context/contracts";

export type IdentityValues = {
  display_name: string | null;
  professional_title: string | null;
  brokerage_name: string | null;
  target_audience: string | null;
  specialties: string[];
  personal_context: string | null;
  primary_brand_color: string | null;
  secondary_brand_color: string | null;
};

export type ContextSnapshot = {
  revision: number;
  timeZone: string;
  identityId: string | null;
  identity: IdentityValues;
  markets: Array<{ id: string; cityId: string; cityName: string; stateCode: string; color: string | null }>;
  preferences: Array<{ id: string; text: string }>;
  frequencyInstructions: Array<{ id: string; text: string }>;
  temporaryInstructions: Array<{
    id: string;
    instruction: string;
    instructionType: "counter" | "date_range";
    remainingPosts: number | null;
    startsAt: string | null;
    endsAt: string | null;
  }>;
};

export type ProcessingClaim = { noteId: string; leaseToken: string; attemptNumber: number };

export type ContextBuilderResult = {
  state: ResultState;
  noteId: string;
  attemptNumber: number;
  snapshotRevision: number | null;
  committedRevision: number | null;
  reasonCode: string | null;
};

export type OutcomeInput = {
  state: Exclude<ResultState, "applied" | "conflict">;
  snapshotRevision: number | null;
  classification?: NoteClassification;
  mutationPlan?: MutationPlan;
  reasonCode?: string;
  detail?: Record<string, unknown>;
};

export type ValidatedOperation =
  | { kind: "identity.set"; field: keyof IdentityValues; value: string | string[] }
  | { kind: "identity.clear"; field: Exclude<keyof IdentityValues, "specialties"> }
  | { kind: "identity.market_add"; cityId: string; cityName: string; stateCode: string }
  | { kind: "identity.market_delete"; targetId: string; cityId: string }
  | { kind: "list.add"; category: "preference" | "frequency"; text: string; assetIds?: string[] }
  | { kind: "list.update"; category: "preference" | "frequency"; targetId: string; text: string; assetIds?: string[] }
  | { kind: "list.delete"; category: "preference" | "frequency"; targetId: string }
  | { kind: "temporary.add_counter"; instruction: string; remainingPosts: number; assetIds?: string[] }
  | { kind: "temporary.add_date_range"; instruction: string; startsAt: string; endsAt: string; assetIds?: string[] }
  | { kind: "temporary.update_counter"; targetId: string; instruction: string; remainingPosts: number; assetIds?: string[] }
  | { kind: "temporary.update_date_range"; targetId: string; instruction: string; startsAt: string; endsAt: string; assetIds?: string[] }
  | { kind: "temporary.delete"; targetId: string };
