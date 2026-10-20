import type { ContextCategory, MutationPlan } from "@/lib/social-media/context/contracts";
import { getIdentityRegistryEntry, normalizeIdentityValue } from "@/lib/social-media/context/identity-registry";
import type { ContextSnapshot, ValidatedOperation } from "@/lib/social-media/context/types";

const MAX_OPERATIONS = 12;
const MAX_CATEGORY_OPERATIONS = 5;
const MAX_DATE_RANGE_MS = 2 * 366 * 24 * 60 * 60 * 1000;

export class PlanNeedsReviewError extends Error {
  constructor(public readonly reasonCode: "ambiguous_target" | "ambiguous_value" | "unsupported_request" | "unresolved_time_boundary" | "conflicting_instructions", message: string) {
    super(message);
    this.name = "PlanNeedsReviewError";
  }
}

export class PlanAlreadySatisfiedError extends Error {
  constructor() {
    super("The proposed context already matches the saved context.");
    this.name = "PlanAlreadySatisfiedError";
  }
}

export type ExactCityResolver = (cityName: string, stateCode: string) => Promise<Array<{ id: string; cityName: string; stateCode: string }>>;

function categoryForKind(kind: string): ContextCategory {
  if (kind.startsWith("identity.")) return "identity";
  if (kind.startsWith("temporary.")) return "temporary";
  throw new Error(`List operation category must be inspected directly: ${kind}`);
}

function indexed<T>(rows: T[], index: number): T {
  const row = rows[index - 1];
  if (!row) throw new PlanNeedsReviewError("ambiguous_target", `Index ${index} does not exist.`);
  return row;
}

function validateDateRange(startsAt: string, endsAt: string) {
  const start = Date.parse(startsAt);
  const end = Date.parse(endsAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end || end - start > MAX_DATE_RANGE_MS) {
    throw new PlanNeedsReviewError("unresolved_time_boundary", "The proposed date range is invalid or longer than two years.");
  }
}

export async function validateMutationPlan(args: {
  plan: MutationPlan;
  routedCategories: ContextCategory[];
  snapshot: ContextSnapshot;
  resolveCity: ExactCityResolver;
  attachedAssetByHandle?: ReadonlyMap<string, string>;
}): Promise<ValidatedOperation[]> {
  if (args.plan.disposition !== "mutate") return [];
  if (args.plan.operations.length > MAX_OPERATIONS) throw new Error("Planner exceeded the total operation bound.");

  const routed = new Set(args.routedCategories);
  const categoryCounts = new Map<ContextCategory, number>();
  const touched = new Set<string>();
  const output: ValidatedOperation[] = [];
  const resolveAssets = (handles: string[] | undefined): string[] | undefined => {
    if (handles === undefined) return undefined;
    const assetIds = handles.map((handle) => {
      const assetId = args.attachedAssetByHandle?.get(handle);
      if (!assetId) throw new Error(`Planner referenced unknown attachment handle ${handle}.`);
      return assetId;
    });
    if (new Set(assetIds).size !== assetIds.length) throw new Error("Planner repeated an attachment handle.");
    return assetIds;
  };

  for (const operation of args.plan.operations) {
    const isListOperation = operation.kind === "list.add" || operation.kind === "list.update" || operation.kind === "list.delete";
    const category = isListOperation ? operation.category : categoryForKind(operation.kind);
    if (!routed.has(category)) throw new Error(`Planner proposed an unrouted ${category} operation.`);
    const count = (categoryCounts.get(category) ?? 0) + 1;
    if (count > MAX_CATEGORY_OPERATIONS) throw new Error(`Planner exceeded the ${category} operation bound.`);
    categoryCounts.set(category, count);

    if (operation.kind === "identity.set") {
      const entry = getIdentityRegistryEntry(operation.field);
      if (!entry || !entry.mutableFromNotes || entry.storage.kind !== "column") throw new Error("Unknown or immutable identity field.");
      const key = `identity:${operation.field}`;
      if (touched.has(key)) throw new PlanNeedsReviewError("conflicting_instructions", "An identity field was targeted more than once.");
      touched.add(key);
      const value = normalizeIdentityValue(entry, operation.value);
      if (JSON.stringify(args.snapshot.identity[operation.field as keyof typeof args.snapshot.identity]) === JSON.stringify(value)) continue;
      output.push({ kind: operation.kind, field: operation.field, value } as ValidatedOperation);
      continue;
    }
    if (operation.kind === "identity.clear") {
      const entry = getIdentityRegistryEntry(operation.field);
      if (!entry?.nullable || !entry.mutableFromNotes || entry.storage.kind !== "column") throw new Error("Unknown or non-nullable identity field.");
      const key = `identity:${operation.field}`;
      if (touched.has(key)) throw new PlanNeedsReviewError("conflicting_instructions", "An identity field was targeted more than once.");
      touched.add(key);
      if (args.snapshot.identity[operation.field as keyof typeof args.snapshot.identity] == null) continue;
      output.push(operation as ValidatedOperation);
      continue;
    }
    if (operation.kind === "identity.market_add") {
      const matches = await args.resolveCity(operation.cityName, operation.stateCode.toUpperCase());
      if (matches.length !== 1) throw new PlanNeedsReviewError("ambiguous_value", "The requested market did not resolve to exactly one catalog city.");
      const city = matches[0];
      if (args.snapshot.markets.some((market) => market.cityId === city.id)) continue;
      const key = `market-city:${city.id}`;
      if (touched.has(key)) throw new PlanNeedsReviewError("conflicting_instructions", "A market was targeted more than once.");
      touched.add(key);
      output.push({ kind: operation.kind, cityId: city.id, cityName: city.cityName, stateCode: city.stateCode });
      continue;
    }
    if (operation.kind === "identity.market_delete") {
      const row = indexed(args.snapshot.markets, operation.targetIndex);
      const key = `market:${row.id}`;
      if (touched.has(key)) throw new PlanNeedsReviewError("conflicting_instructions", "A market was targeted more than once.");
      touched.add(key);
      output.push({ kind: operation.kind, targetId: row.id, cityId: row.cityId });
      continue;
    }
    if (operation.kind === "list.add" || operation.kind === "list.update" || operation.kind === "list.delete") {
      const rows = operation.category === "preference" ? args.snapshot.preferences : args.snapshot.frequencyInstructions;
      if (operation.kind === "list.add") {
        if (rows.some((row) => row.text.trim().toLocaleLowerCase() === operation.text.trim().toLocaleLowerCase())) continue;
        output.push({ ...operation, assetIds: resolveAssets(operation.assetHandles) });
      } else {
        const row = indexed(rows, operation.targetIndex);
        const key = `${operation.category}:${row.id}`;
        if (touched.has(key)) throw new PlanNeedsReviewError("conflicting_instructions", "A list row was targeted more than once.");
        touched.add(key);
        if (operation.kind === "list.update"
          && row.text.trim() === operation.text.trim()
          && operation.assetHandles === undefined) continue;
        output.push(operation.kind === "list.update"
          ? { kind: operation.kind, category: operation.category, targetId: row.id, text: operation.text,
              assetIds: resolveAssets(operation.assetHandles) }
          : { kind: operation.kind, category: operation.category, targetId: row.id });
      }
      continue;
    }

    if (operation.kind === "temporary.add_counter") output.push({ ...operation, assetIds: resolveAssets(operation.assetHandles) });
    else if (operation.kind === "temporary.add_date_range") {
      validateDateRange(operation.startsAt, operation.endsAt);
      output.push({ ...operation, assetIds: resolveAssets(operation.assetHandles) });
    } else {
      const row = indexed(args.snapshot.temporaryInstructions, operation.targetIndex);
      const key = `temporary:${row.id}`;
      if (touched.has(key)) throw new PlanNeedsReviewError("conflicting_instructions", "A temporary row was targeted more than once.");
      touched.add(key);
      if (operation.kind === "temporary.update_date_range") validateDateRange(operation.startsAt, operation.endsAt);
      if (operation.kind === "temporary.update_counter"
        && row.instruction === operation.instruction
        && row.instructionType === "counter"
        && row.remainingPosts === operation.remainingPosts
        && operation.assetHandles === undefined) continue;
      if (operation.kind === "temporary.update_date_range"
        && row.instruction === operation.instruction
        && row.instructionType === "date_range"
        && Date.parse(row.startsAt ?? "") === Date.parse(operation.startsAt)
        && Date.parse(row.endsAt ?? "") === Date.parse(operation.endsAt)
        && operation.assetHandles === undefined) continue;
      output.push({ ...operation, targetId: row.id,
        assetIds: resolveAssets("assetHandles" in operation ? operation.assetHandles : undefined) } as ValidatedOperation);
    }
  }

  for (const category of ["preference", "frequency"] as const) {
    const sourceRows = category === "preference" ? args.snapshot.preferences : args.snapshot.frequencyInstructions;
    const resulting = new Map(sourceRows.map((row) => [row.id, row.text.trim().toLocaleLowerCase()]));
    let addition = 0;
    for (const operation of output) {
      if (!(operation.kind === "list.add" || operation.kind === "list.update" || operation.kind === "list.delete") || operation.category !== category) continue;
      if (operation.kind === "list.add") resulting.set(`new:${addition++}`, operation.text.trim().toLocaleLowerCase());
      if (operation.kind === "list.update") resulting.set(operation.targetId, operation.text.trim().toLocaleLowerCase());
      if (operation.kind === "list.delete") resulting.delete(operation.targetId);
    }
    const values = [...resulting.values()];
    if (new Set(values).size !== values.length) throw new PlanNeedsReviewError("conflicting_instructions", `The ${category} result would contain duplicates.`);
  }

  if (output.length === 0) throw new PlanAlreadySatisfiedError();
  return output;
}
