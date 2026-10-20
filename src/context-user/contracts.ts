import { z } from "zod";

export const imageHandleSchema = z.string().regex(/^IMAGE_[1-9][0-9]*$/);
export const temporaryHandleSchema = z.string().regex(/^TEMP_[1-9][0-9]*$/);

export const assetPurposeSchema = z.enum([
  "headshot",
  "logo",
  "office",
  "listing",
  "community",
  "other",
]);

export const linkedAssetSchema = z.object({
  id: z.string().uuid(),
  storageKey: z.string().min(1).max(1024),
  purpose: assetPurposeSchema,
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  width: z.number().int().positive().max(20_000),
  height: z.number().int().positive().max(20_000),
}).strict();

const contextInstructionSchema = z.object({
  id: z.string().uuid(),
  instruction: z.string().trim().min(1).max(500),
  assetRefs: z.array(z.string().uuid()),
}).strict();

export const contextSnapshotSchema = z.object({
  schemaVersion: z.literal("social-context-snapshot.v1"),
  ownerProfileId: z.string().uuid(),
  occurrenceAt: z.string().datetime({ offset: true }),
  contextRevision: z.number().int().nonnegative(),
  canonicalTimeZone: z.string().min(1).max(64),
  identity: z.object({
    displayName: z.string().nullable(),
    professionalTitle: z.string().nullable(),
    brokerageName: z.string().nullable(),
    markets: z.array(z.object({
      cityName: z.string(),
      stateCode: z.string(),
      color: z.string().nullable(),
    }).strict()),
    targetAudience: z.string().nullable(),
    specialties: z.array(z.string()),
    personalContext: z.string().nullable(),
    primaryBrandColor: z.string().nullable(),
    secondaryBrandColor: z.string().nullable(),
  }).strict(),
  preferences: z.array(contextInstructionSchema),
  frequencyInstructions: z.array(contextInstructionSchema),
  activeTemporaryInstructions: z.array(contextInstructionSchema.extend({
    instructionType: z.enum(["counter", "date_range"]),
    remainingPostsAtSnapshot: z.number().int().positive().nullable(),
    startsAt: z.string().datetime({ offset: true }).nullable(),
    endsAt: z.string().datetime({ offset: true }).nullable(),
    sourceTimeZone: z.string().min(1).max(64),
    sourceNoteId: z.string().uuid(),
  }).strict()),
  linkedAssets: z.array(linkedAssetSchema),
  recentPublishedPosts: z.array(z.object({
    publishedAt: z.string().datetime({ offset: true }),
    summary: z.string().trim().min(1).max(1000),
  }).strict()).max(16),
}).strict();

export type ContextSnapshot = z.infer<typeof contextSnapshotSchema>;

export const creativeAgentOutputSchema = z.object({
  schemaVersion: z.literal("creative-agent-output.v1"),
  concept: z.string().trim().min(1).max(4000),
  caption: z.string().trim().min(1).max(10_000),
  selectedImages: z.array(z.object({
    imageHandle: imageHandleSchema,
    role: z.enum(["hero", "supporting", "brand_mark"]),
  }).strict()).min(1).max(10),
  historySummary: z.string().trim().min(1).max(1000),
  intendedTemporaryInstructions: z.array(temporaryHandleSchema).max(100),
}).strict();

export type CreativeAgentOutput = z.infer<typeof creativeAgentOutputSchema>;

const resolvedImageBaseSchema = z.object({
  storageKey: z.string().min(1).max(1024),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  role: z.enum(["hero", "supporting", "brand_mark"]),
}).strict();

export const resolvedImageSchema = z.discriminatedUnion("source", [
  resolvedImageBaseSchema.extend({
    source: z.literal("user_asset"),
    assetId: z.string().uuid(),
  }).strict(),
  resolvedImageBaseSchema.extend({
    source: z.literal("discovered_image"),
    provider: z.string().trim().min(1).max(100),
    providerAssetId: z.string().min(1).max(100),
    providerPageUrl: z.string().url(),
    creatorName: z.string().max(500),
    creatorUrl: z.string().url().nullable(),
  }).strict(),
]);

export const creativeOutputSchema = z.object({
  schemaVersion: z.literal("creative-output.v1"),
  concept: z.string().trim().min(1).max(4000),
  selectedImages: z.array(resolvedImageSchema).min(1).max(10),
  intendedTemporaryInstructionIds: z.array(z.string().uuid()).max(100),
}).strict();

export type CreativeOutput = z.infer<typeof creativeOutputSchema>;
export type ResolvedImage = z.infer<typeof resolvedImageSchema>;

const fabricCanvasObjectOutputSchema = z.object({
  type: z.enum([
    "Rect", "Circle", "Ellipse", "Triangle", "Line", "Polyline", "Polygon",
    "Path", "Text", "IText", "Textbox", "Image", "Group", "ActiveSelection",
  ]),
}).catchall(z.unknown());

const fabricCanvasOutputSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  objects: z.array(fabricCanvasObjectOutputSchema).min(1),
}).catchall(z.unknown());

export type DirectFabricOutput = {
  schemaVersion: "direct-fabric-output.v1";
  slides: Array<{
    displayOrder: number;
    fabricJson: Record<string, unknown>;
  }>;
};

const directFabricSlidesSchema = z.array(z.object({
  displayOrder: z.number().int().positive().max(20),
  fabricJson: fabricCanvasOutputSchema,
}).strict()).min(1).max(10);

export const directFabricOutputSchema: z.ZodType<DirectFabricOutput> = z.object({
  schemaVersion: z.literal("direct-fabric-output.v1"),
  slides: directFabricSlidesSchema,
}).strict();

// Some OpenAI-compatible structured-output transports serialize a nested array
// as a JSON string even though the tool schema requests an array. Accept that
// transport quirk at the model boundary only; application code immediately
// decodes it and validates the result with directFabricOutputSchema.
export const directFabricTransportOutputSchema = z.object({
  schemaVersion: z.literal("direct-fabric-output.v1"),
  slides: z.union([directFabricSlidesSchema, z.string().min(2)]),
}).strict();

export const visualCriticResultSchema = z.object({
  schemaVersion: z.literal("visual-critic-result.v1"),
  visualStatus: z.enum(["pass", "revise", "blocking"]),
  issues: z.array(z.object({
    severity: z.enum(["minor", "major", "blocking"]),
    code: z.string().trim().min(1).max(100),
    detail: z.string().trim().min(1).max(2000),
  }).strict()).max(30),
  revisionBrief: z.string().trim().min(1).max(4000).nullable(),
  temporaryEvaluations: z.array(z.object({
    temporaryHandle: temporaryHandleSchema,
    satisfied: z.boolean(),
    evidence: z.string().trim().min(1).max(1000),
  }).strict()).max(100),
}).strict();

export type VisualCriticResult = z.infer<typeof visualCriticResultSchema>;

export const finalTemporarySatisfactionSchema = z.object({
  schemaVersion: z.literal("temporary-satisfaction.v1"),
  visualRevision: z.number().int().min(0).max(2),
  instructionIds: z.array(z.string().uuid()),
}).strict();

export type FinalTemporarySatisfaction = z.infer<typeof finalTemporarySatisfactionSchema>;

export type ImageCandidate = {
  handle: `IMAGE_${number}`;
  source: "user_asset" | "discovered_image";
  width: number;
  height: number;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  purpose?: z.infer<typeof assetPurposeSchema>;
  modelDescription: string;
  pixels: Buffer;
  sourceBytes: Buffer;
  durableSource:
    | { source: "user_asset"; assetId: string; storageKey: string }
    | {
        source: "discovered_image";
        provider: string;
        downloadUrl: string;
        providerAssetId: string;
        providerPageUrl: string;
        creatorName: string;
        creatorUrl: string | null;
      };
};

export type HandleMaps = {
  temporaryByHandle: Map<`TEMP_${number}`, ContextSnapshot["activeTemporaryInstructions"][number]>;
  temporaryHandleById: Map<string, `TEMP_${number}`>;
  imageByHandle: Map<`IMAGE_${number}`, ImageCandidate>;
  imageHandleByAssetId: Map<string, `IMAGE_${number}`>;
};
