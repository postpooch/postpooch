import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

import type { ContextSnapshot, CreativeOutput, VisualCriticResult } from "./contracts";
import { visualCriticResultSchema } from "./contracts";
import { imageDataUrl } from "./images/validate";
import { CRITIC_SYSTEM_PROMPT } from "./prompts/critic";
import type { ContextReferenceImage } from "./images/hydrate";
import { invokeModelStage } from "./model-call";

export class VisualCritic {
  constructor(
    private readonly model: BaseChatModel,
    private readonly timeoutMs = 90_000,
  ) {}

  async evaluate(input: {
    snapshot: ContextSnapshot;
    creative: CreativeOutput;
    caption: string;
    renderedSlides: Buffer[];
    referenceImages: ContextReferenceImage[];
  }): Promise<VisualCriticResult> {
    const referenceHandleByAssetId = new Map(input.referenceImages.map((image, index) =>
      [image.assetId, `REFERENCE_IMAGE_${index + 1}`] as const));
    const referenceHandles = (assetRefs: string[]) => assetRefs
      .map((assetId) => referenceHandleByAssetId.get(assetId))
      .filter((handle): handle is `REFERENCE_IMAGE_${number}` => Boolean(handle));
    const content: Array<Record<string, unknown>> = [{
      type: "text",
      text: JSON.stringify({
        concept: input.creative.concept,
        socialCaption: input.caption,
        activeTemporaryInstructions: input.snapshot.activeTemporaryInstructions.map((row, index) => ({
          handle: `TEMP_${index + 1}`,
          instruction: row.instruction,
          referenceImages: referenceHandles(row.assetRefs),
        })),
        persistentPreferences: input.snapshot.preferences.map((row) => ({
          instruction: row.instruction,
          referenceImages: referenceHandles(row.assetRefs),
        })),
      }),
    }];
    input.referenceImages.forEach((image, index) => {
      content.push({ type: "text", text: `REFERENCE_IMAGE_${index + 1}` });
      content.push({
        type: "image_url",
        image_url: { url: imageDataUrl(image.bytes, image.mimeType), detail: "high" },
      });
    });
    input.renderedSlides.forEach((slide, index) => {
      content.push({ type: "text", text: `Final-size rendered slide ${index + 1}` });
      content.push({ type: "image_url", image_url: { url: imageDataUrl(slide, "image/jpeg"), detail: "high" } });
    });
    const structured = this.model.withStructuredOutput(visualCriticResultSchema, {
      name: "visual_critic_result",
    });
    const messages = [
      new SystemMessage(CRITIC_SYSTEM_PROMPT),
      new HumanMessage({ content: content as never }),
    ];
    const raw = await invokeModelStage({
      stage: "Visual Critic",
      timeoutMs: this.timeoutMs,
      invoke: (config) => structured.invoke(messages, config),
    });
    const result = visualCriticResultSchema.parse(raw);
    const expected = input.snapshot.activeTemporaryInstructions.map((_, index) => `TEMP_${index + 1}`);
    const actual = result.temporaryEvaluations.map((row) => row.temporaryHandle);
    if (new Set(actual).size !== actual.length ||
        expected.length !== actual.length ||
        expected.some((handle) => !actual.includes(handle as never))) {
      throw new Error("Visual critic did not evaluate every active temporary exactly once");
    }
    return result;
  }
}
