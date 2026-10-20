import { z } from "zod";

import registryJson from "@/shared/social-media/identity-fields.json";

const storageSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("column"), column: z.string().min(1) }).strict(),
  z.object({ kind: z.literal("relation"), table: z.string().min(1) }).strict(),
]);

const registryEntrySchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  valueType: z.enum(["text", "text_array", "hex_color", "city_relation"]),
  storage: storageSchema,
  nullable: z.boolean(),
  mutableFromNotes: z.boolean(),
  minLength: z.number().int().positive().optional(),
  maxLength: z.number().int().positive().optional(),
  minItems: z.number().int().nonnegative().optional(),
  maxItems: z.number().int().positive().optional(),
  itemMinLength: z.number().int().positive().optional(),
  itemMaxLength: z.number().int().positive().optional(),
}).strict();

export const identityRegistry = z.array(registryEntrySchema).min(1).parse(registryJson);
export type IdentityRegistryEntry = (typeof identityRegistry)[number];

export const identityFieldKeys = identityRegistry.map((entry) => entry.key) as [string, ...string[]];
export const identityFieldKeySchema = z.enum(identityFieldKeys);
export type IdentityFieldKey = z.infer<typeof identityFieldKeySchema>;

export const identityColumnEntries = identityRegistry.filter(
  (entry): entry is IdentityRegistryEntry & { storage: { kind: "column"; column: string } } =>
    entry.storage.kind === "column",
);

export const identityColumnsByField = new Map(
  identityColumnEntries.map((entry) => [entry.key, entry.storage.column] as const),
);

export function getIdentityRegistryEntry(key: string): IdentityRegistryEntry | undefined {
  return identityRegistry.find((entry) => entry.key === key);
}

export function normalizeIdentityValue(entry: IdentityRegistryEntry, value: unknown): string | string[] {
  if (entry.valueType === "text_array") {
    return z.array(z.string().trim().min(entry.itemMinLength ?? 1).max(entry.itemMaxLength ?? 80))
      .max(entry.maxItems ?? 20)
      .parse(value);
  }
  if (entry.valueType === "hex_color") {
    return z.string().regex(/^#[0-9A-Fa-f]{6}$/).parse(value).toUpperCase();
  }
  if (entry.valueType === "text") {
    return z.string().trim().min(entry.minLength ?? 1).max(entry.maxLength ?? 2000).parse(value);
  }
  throw new Error(`Field ${entry.key} is relation-backed and has no scalar value.`);
}
