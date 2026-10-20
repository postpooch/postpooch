import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

import { POSTPOOCH_FONT_FAMILIES } from "../posting/font-catalog";
import type { ContextSnapshot, CreativeOutput, DirectFabricOutput } from "./contracts";
import { directFabricOutputSchema, directFabricTransportOutputSchema } from "./contracts";
import { imageDataUrl } from "./images/validate";
import { invokeModelStage } from "./model-call";
import {
  DESIGN_REPAIR_SYSTEM_PROMPT,
  DESIGN_REVISION_SYSTEM_PROMPT,
  DESIGN_SYSTEM_PROMPT,
} from "./prompts/design";

function decodeJsonStrings(value: unknown, maximumDepth = 3): unknown {
  let decoded = value;
  for (let depth = 0; depth < maximumDepth && typeof decoded === "string"; depth += 1) {
    decoded = JSON.parse(decoded);
  }
  return decoded;
}

export function normalizeDirectFabricOutput(value: unknown): DirectFabricOutput | null {
  try {
    const decoded = decodeJsonStrings(value);
    if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) return null;
    const candidate = { ...(decoded as Record<string, unknown>) };
    candidate.slides = decodeJsonStrings(candidate.slides);
    const parsed = directFabricOutputSchema.safeParse(candidate);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function parserMessageCandidates(message: string): string[] {
  const prefix = "Failed to parse. Text: ";
  const suffix = ". Error: ";
  const start = message.indexOf(prefix);
  const end = message.lastIndexOf(suffix);
  if (start < 0 || end <= start) return [];
  const raw = message.slice(start + prefix.length, end);
  const candidates = [raw];
  // LangChain currently formats this as Text: "${rawJson}" without escaping
  // the JSON's own quotes, so the surrounding quotes must be removed before
  // JSON.parse. Also keep the unmodified candidate for older formatter shapes.
  if (raw.startsWith('"') && raw.endsWith('"')) candidates.push(raw.slice(1, -1));
  return candidates;
}

export function recoverDoubleEncodedFabricOutput(error: unknown): DirectFabricOutput | null {
  const candidates: unknown[] = [];
  const visited = new Set<unknown>();
  let current: unknown = error;
  for (let depth = 0; depth < 3 && current && !visited.has(current); depth += 1) {
    visited.add(current);
    if (typeof current === "object") {
      if ("llmOutput" in current) candidates.push(current.llmOutput);
      if (current instanceof Error) candidates.push(...parserMessageCandidates(current.message));
      current = "cause" in current ? current.cause : null;
    } else {
      break;
    }
  }
  for (const candidate of candidates) {
    const recovered = normalizeDirectFabricOutput(candidate);
    if (recovered) return recovered;
  }
  return null;
}

async function invokeDirectFabricStage(input: {
  stage: string;
  timeoutMs: number;
  invoke: (config: { signal: AbortSignal }) => Promise<unknown>;
}): Promise<DirectFabricOutput> {
  try {
    const result = await invokeModelStage(input);
    const normalized = normalizeDirectFabricOutput(result);
    if (normalized) return normalized;
    throw new Error(`${input.stage} returned an invalid Fabric output`);
  } catch (error) {
    const recovered = recoverDoubleEncodedFabricOutput(error);
    if (recovered) return recovered;
    throw error;
  }
}

export type SelectedDesignImage = {
  handle: `IMAGE_${number}`;
  bytes: Buffer;
  mimeType: string;
  publicUrl: string;
  role: string;
  assetId: string | null;
};

export function designContext(input: {
  snapshot: ContextSnapshot;
  creative: CreativeOutput;
  caption: string;
  images: SelectedDesignImage[];
}) {
  const handleByAssetId = new Map(input.images.flatMap((image) =>
    image.assetId ? [[image.assetId, image.handle] as const] : []));
  const imageHandles = (assetRefs: string[]) => assetRefs
    .map((assetId) => handleByAssetId.get(assetId))
    .filter((handle): handle is `IMAGE_${number}` => Boolean(handle));
  return {
    concept: input.creative.concept,
    socialCaption: input.caption,
    selectedImages: input.images.map((image) => ({ handle: image.handle, role: image.role })),
    designIdentity: {
      displayName: input.snapshot.identity.displayName,
      brokerageName: input.snapshot.identity.brokerageName,
      primaryBrandColor: input.snapshot.identity.primaryBrandColor,
      secondaryBrandColor: input.snapshot.identity.secondaryBrandColor,
    },
    persistentPreferences: input.snapshot.preferences.map((row) => ({
      instruction: row.instruction,
      imageHandles: imageHandles(row.assetRefs),
    })),
    activeTemporaryInstructions: input.snapshot.activeTemporaryInstructions.map((row, index) => ({
      handle: `TEMP_${index + 1}`,
      instruction: row.instruction,
      imageHandles: imageHandles(row.assetRefs),
    })),
    allowedFonts: POSTPOOCH_FONT_FAMILIES,
    canvas: { preferredWidth: 1080, preferredHeight: 1080 },
  };
}

function multimodalMessage(text: string, images: SelectedDesignImage[]) {
  const content: Array<Record<string, unknown>> = [{ type: "text", text }];
  for (const image of images) {
    content.push({ type: "text", text: `${image.handle} (${image.role})` });
    content.push({ type: "image_url", image_url: { url: imageDataUrl(image.bytes, image.mimeType), detail: "high" } });
  }
  return new HumanMessage({ content: content as never });
}

export class DesignAi {
  constructor(
    private readonly model: BaseChatModel,
    private readonly timeoutMs = 90_000,
  ) {}

  async create(input: {
    snapshot: ContextSnapshot;
    creative: CreativeOutput;
    caption: string;
    images: SelectedDesignImage[];
  }): Promise<DirectFabricOutput> {
    const structured = this.model.withStructuredOutput(directFabricTransportOutputSchema, {
      name: "direct_fabric_output",
    });
    const messages = [
      new SystemMessage(DESIGN_SYSTEM_PROMPT),
      multimodalMessage(JSON.stringify(designContext(input)), input.images),
    ];
    const result = await invokeDirectFabricStage({
      stage: "Initial Design AI",
      timeoutMs: this.timeoutMs,
      invoke: (config) => structured.invoke(messages, config),
    });
    return directFabricOutputSchema.parse(result);
  }

  async revise(input: {
    snapshot: ContextSnapshot;
    creative: CreativeOutput;
    caption: string;
    images: SelectedDesignImage[];
    current: DirectFabricOutput;
    currentRenders: Buffer[];
    revisionBrief: string;
  }): Promise<DirectFabricOutput> {
    const structured = this.model.withStructuredOutput(directFabricTransportOutputSchema, {
      name: "revised_direct_fabric_output",
    });
    const content: Array<Record<string, unknown>> = [{
      type: "text",
      text: JSON.stringify({
        ...designContext(input),
        currentFabric: input.current,
        criticRevisionBrief: input.revisionBrief,
      }),
    }];
    input.currentRenders.forEach((render, index) => {
      content.push({ type: "text", text: `Current rendered slide ${index + 1}` });
      content.push({ type: "image_url", image_url: { url: imageDataUrl(render, "image/jpeg"), detail: "high" } });
    });
    input.images.forEach((image) => {
      content.push({ type: "text", text: `${image.handle} source image` });
      content.push({ type: "image_url", image_url: { url: imageDataUrl(image.bytes, image.mimeType), detail: "high" } });
    });
    const messages = [
      new SystemMessage(DESIGN_REVISION_SYSTEM_PROMPT),
      new HumanMessage({ content: content as never }),
    ];
    const result = await invokeDirectFabricStage({
      stage: "Design AI revision",
      timeoutMs: this.timeoutMs,
      invoke: (config) => structured.invoke(messages, config),
    });
    return directFabricOutputSchema.parse(result);
  }

  async repairInvalid(input: {
    snapshot: ContextSnapshot;
    creative: CreativeOutput;
    caption: string;
    images: SelectedDesignImage[];
    current: DirectFabricOutput;
    validationError: string;
  }): Promise<DirectFabricOutput> {
    const structured = this.model.withStructuredOutput(directFabricTransportOutputSchema, {
      name: "repaired_direct_fabric_output",
    });
    const messages = [
      new SystemMessage(DESIGN_REPAIR_SYSTEM_PROMPT),
      multimodalMessage(JSON.stringify({
        ...designContext(input),
        invalidFabric: input.current,
        deterministicValidationError: input.validationError,
      }), input.images),
    ];
    const result = await invokeDirectFabricStage({
      stage: "Design AI structural repair",
      timeoutMs: this.timeoutMs,
      invoke: (config) => structured.invoke(messages, config),
    });
    return directFabricOutputSchema.parse(result);
  }
}
