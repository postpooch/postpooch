import { HumanMessage, SystemMessage, ToolMessage, type BaseMessage } from "@langchain/core/messages";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { tool } from "@langchain/core/tools";
import type { S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";

import type { PostingEnvironment } from "../posting/env";
import { PostingError } from "../posting/errors";
import type { ContextUserEnvironment } from "./environment";
import type { ContextSnapshot, CreativeOutput, HandleMaps, ImageCandidate } from "./contracts";
import { creativeAgentOutputSchema } from "./contracts";
import { creativeContextPrompt, creativeSystemPrompt } from "./prompts/creative";
import { imageDataUrl } from "./images/validate";
import { materializeDiscoveredImage } from "./images/storage";
import type { BoundedImageTools } from "./image-tools/tools";
import { invokeModelStage } from "./model-call";

const userImageTool = tool(async () => "Tool execution is application-controlled", {
  name: "get_user_images",
  description: "Retrieve reusable images owned by this realtor. Choose optional purposes and inspect returned pixels.",
  schema: z.object({
    purposes: z.array(z.enum(["headshot", "logo", "office", "listing", "community", "other"])).optional(),
    limit: z.number().int().min(1).max(10).optional(),
  }).strict(),
});

const imageDiscoveryTool = tool(async () => "Tool execution is application-controlled", {
  name: "find_images",
  description: "Find suitable external images. Refine queries as needed and inspect returned pixels.",
  schema: z.object({
    query: z.string().trim().min(2).max(100),
    orientation: z.enum(["landscape", "portrait", "square"]).optional(),
    limit: z.number().int().min(1).max(10).optional(),
  }).strict(),
});

const submitCreativeTool = tool(async () => "Creative proposal received", {
  name: "submit_creative",
  description: "Submit the final concept, social caption, selected image handles, history summary, and intended temporary handles.",
  schema: creativeAgentOutputSchema,
});

export function validateCreativeProposal(value: unknown, maps: HandleMaps) {
  const proposed = creativeAgentOutputSchema.parse(value);
  const selectedHandles = proposed.selectedImages.map((selected) => selected.imageHandle);
  if (new Set(selectedHandles).size !== selectedHandles.length) {
    throw new Error("Each selected IMAGE handle may appear only once");
  }
  for (const selected of proposed.selectedImages) {
    if (!maps.imageByHandle.has(selected.imageHandle as `IMAGE_${number}`)) {
      throw new Error(`Unknown IMAGE handle ${selected.imageHandle}`);
    }
  }
  for (const handle of proposed.intendedTemporaryInstructions) {
    if (!maps.temporaryByHandle.has(handle as `TEMP_${number}`)) {
      throw new Error(`Unknown TEMP handle ${handle}`);
    }
  }
  return proposed;
}

function imageObservation(candidates: ImageCandidate[]) {
  const content: Array<Record<string, unknown>> = [{
    type: "text",
    text: candidates.length
      ? `Inspect these candidates: ${candidates.map((candidate) => `${candidate.handle} (${candidate.modelDescription})`).join("; ")}`
      : "No image candidates matched this tool call.",
  }];
  for (const candidate of candidates) {
    content.push({
      type: "text",
      text: `${candidate.handle}: ${candidate.modelDescription}`,
    });
    content.push({
      type: "image_url",
      image_url: { url: imageDataUrl(candidate.pixels, candidate.mimeType), detail: "low" },
    });
  }
  return new HumanMessage({ content: content as never });
}

function initialContextMessage(snapshot: ContextSnapshot, maps: HandleMaps) {
  const linked = [...maps.imageByHandle.values()];
  const content: Array<Record<string, unknown>> = [{
    type: "text",
    text: creativeContextPrompt(snapshot, maps),
  }];
  for (const candidate of linked) {
    content.push({ type: "text", text: `${candidate.handle}: ${candidate.modelDescription}` });
    content.push({
      type: "image_url",
      image_url: { url: imageDataUrl(candidate.pixels, candidate.mimeType), detail: "low" },
    });
  }
  return new HumanMessage({ content: content as never });
}

export class CreativeAgent {
  constructor(private readonly dependencies: {
    model: BaseChatModel;
    imageTools: BoundedImageTools;
    maps: HandleMaps;
    snapshot: ContextSnapshot;
    r2: S3Client;
    postingEnvironment: PostingEnvironment;
    contextEnvironment: ContextUserEnvironment;
    postingRunId: string;
  }) {}

  async run(): Promise<{ creative: CreativeOutput; caption: string; historySummary: string }> {
    if (!this.dependencies.model.bindTools) throw new PostingError("Configured creative model does not support tools", false);
    const model = this.dependencies.model.bindTools([
      userImageTool,
      imageDiscoveryTool,
      submitCreativeTool,
    ]);
    const messages: BaseMessage[] = [
      new SystemMessage(creativeSystemPrompt()),
      initialContextMessage(this.dependencies.snapshot, this.dependencies.maps),
    ];

    for (let turn = 0; turn < 14; turn += 1) {
      const response = await invokeModelStage({
        stage: "Creative Agent",
        timeoutMs: this.dependencies.contextEnvironment.modelTimeoutMs,
        invoke: (config) => model.invoke(messages, config),
      });
      messages.push(response);
      const calls = response.tool_calls ?? [];
      if (!calls.length) {
        messages.push(new HumanMessage("Call an image tool or submit_creative. Do not answer with prose."));
        continue;
      }

      for (const call of calls) {
        if (call.name === "submit_creative") {
          let proposed;
          try {
            proposed = validateCreativeProposal(call.args, this.dependencies.maps);
          } catch (error) {
            messages.push(new ToolMessage({
              tool_call_id: call.id ?? `invalid-${turn}`,
              content: `Invalid creative submission: ${error instanceof Error ? error.message : String(error)}. Repair using only supplied handles.`,
            }));
            continue;
          }
          return await this.resolveAndMaterialize(proposed);
        }

        let candidates: ImageCandidate[];
        try {
          if (call.name === "get_user_images") {
            candidates = await this.dependencies.imageTools.getUserImages(
              z.object({
                purposes: z.array(z.string()).optional(),
                limit: z.number().optional(),
              }).parse(call.args),
            );
          } else if (call.name === "find_images") {
            candidates = await this.dependencies.imageTools.findImages(
              z.object({
                query: z.string(),
                orientation: z.enum(["landscape", "portrait", "square"]).optional(),
                limit: z.number().optional(),
              }).parse(call.args),
            );
          } else {
            messages.push(new ToolMessage({
              tool_call_id: call.id ?? `unknown-${turn}`,
              content: `Unknown tool ${call.name}.`,
            }));
            continue;
          }
        } catch (error) {
          if (error instanceof PostingError && error.retryable) throw error;
          messages.push(new ToolMessage({
            tool_call_id: call.id ?? `failed-${turn}`,
            content: `Image tool could not return candidates: ${error instanceof Error ? error.message : String(error)}`,
          }));
          continue;
        }
        messages.push(new ToolMessage({
          tool_call_id: call.id ?? `tool-${turn}`,
          content: JSON.stringify(candidates.map((candidate) => ({
            handle: candidate.handle,
            source: candidate.source,
            width: candidate.width,
            height: candidate.height,
            purpose: candidate.purpose,
            description: candidate.modelDescription,
          }))),
        }));
        messages.push(imageObservation(candidates));
      }
    }
    throw new PostingError("Creative Agent exceeded its bounded conversation", false);
  }

  private async resolveAndMaterialize(
    proposed: z.infer<typeof creativeAgentOutputSchema>,
  ): Promise<{ creative: CreativeOutput; caption: string; historySummary: string }> {
    const selectedImages: CreativeOutput["selectedImages"] = [];
    for (const selection of proposed.selectedImages) {
      const candidate = this.dependencies.maps.imageByHandle.get(selection.imageHandle as `IMAGE_${number}`)!;
      if (candidate.durableSource.source === "user_asset") {
        selectedImages.push({
          source: "user_asset",
          assetId: candidate.durableSource.assetId,
          storageKey: candidate.durableSource.storageKey,
          mimeType: candidate.mimeType,
          width: candidate.width,
          height: candidate.height,
          role: selection.role,
        });
      } else {
        const stored = await materializeDiscoveredImage({
          client: this.dependencies.r2,
          environment: this.dependencies.postingEnvironment,
          postingRunId: this.dependencies.postingRunId,
          provider: candidate.durableSource.provider,
          providerAssetId: candidate.durableSource.providerAssetId,
          image: {
            bytes: candidate.sourceBytes,
            modelBytes: candidate.pixels,
            mimeType: candidate.mimeType,
            width: candidate.width,
            height: candidate.height,
          },
        });
        selectedImages.push({
          source: "discovered_image",
          provider: candidate.durableSource.provider,
          storageKey: stored.storageKey,
          providerAssetId: candidate.durableSource.providerAssetId,
          providerPageUrl: candidate.durableSource.providerPageUrl,
          creatorName: candidate.durableSource.creatorName,
          creatorUrl: candidate.durableSource.creatorUrl,
          mimeType: candidate.mimeType,
          width: candidate.width,
          height: candidate.height,
          role: selection.role,
        });
      }
    }
    const intendedTemporaryInstructionIds = [...new Set(
      proposed.intendedTemporaryInstructions.map((handle) =>
        this.dependencies.maps.temporaryByHandle.get(handle as `TEMP_${number}`)!.id),
    )];
    return {
      creative: {
        schemaVersion: "creative-output.v1",
        concept: proposed.concept,
        selectedImages,
        intendedTemporaryInstructionIds,
      },
      caption: proposed.caption,
      historySummary: proposed.historySummary,
    };
  }
}
