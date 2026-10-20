import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOpenRouter, type ChatOpenRouterInput } from "@langchain/openrouter";
import { initChatModel } from "langchain";

export type UniversalChatModelOptions = Record<string, unknown>;

export type ModelReference = {
  provider: string | null;
  model: string;
};

export function parseModelReference(value: string): ModelReference {
  const reference = value.trim();
  if (!reference) throw new Error("Model reference cannot be empty");
  const separator = reference.indexOf(":");
  if (separator < 0) return { provider: null, model: reference };
  const provider = reference.slice(0, separator).trim().toLowerCase();
  const model = reference.slice(separator + 1).trim();
  if (!provider || !model) throw new Error(`Invalid model reference: ${value}`);
  return { provider, model };
}

type ModelAdapter = (
  model: string,
  options: UniversalChatModelOptions,
) => Promise<BaseChatModel>;

const modelAdapters: Readonly<Record<string, ModelAdapter>> = {
  openrouter: async (model, options) => new ChatOpenRouter({
    model,
    ...(options as Omit<ChatOpenRouterInput, "model">),
  }),
};

/**
 * The sole application boundary for constructing chat models. Callers depend
 * only on BaseChatModel; provider-specific integrations and workarounds stay
 * inside this module.
 */
export async function createUniversalChatModel(
  reference: string,
  options: UniversalChatModelOptions = {},
): Promise<BaseChatModel> {
  const parsed = parseModelReference(reference);
  const adapter = parsed.provider ? modelAdapters[parsed.provider] : undefined;
  if (adapter) return adapter(parsed.model, options);

  return await initChatModel(reference, options) as BaseChatModel;
}
