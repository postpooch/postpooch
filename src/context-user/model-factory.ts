import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

import { createUniversalChatModel } from "../../lib/ai/universal-chat-model";
import type { ContextUserEnvironment } from "./environment";
import { PostingError } from "../posting/errors";

function modelOptions(): Record<string, unknown> {
  // Keep the application boundary provider-neutral. Provider/model-specific
  // sampling or reasoning settings belong in an adapter after evaluation.
  // Request deadlines are supplied as AbortSignals at invocation time because
  // not every provider adapter accepts a constructor-level timeout.
  return { maxRetries: 0 };
}

export type ContextUserModels = {
  creative: BaseChatModel;
  design: BaseChatModel;
  critic: BaseChatModel;
};

export type ContextUserModelRole = keyof ContextUserModels;

export async function createContextUserModel(
  environment: ContextUserEnvironment,
  role: ContextUserModelRole,
): Promise<BaseChatModel> {
  const configured = role === "creative"
    ? ["SOCIAL_MEDIA_CREATIVE_MODEL", environment.creativeModel]
    : role === "design"
      ? ["SOCIAL_MEDIA_DESIGN_MODEL", environment.designModel]
      : ["SOCIAL_MEDIA_VISION_MODEL", environment.visionModel];
  if (!configured[1]) {
    throw new PostingError(`Missing required environment variable ${configured[0]}`, false);
  }
  return await createUniversalChatModel(
    configured[1],
    modelOptions(),
  );
}
