import { describe, expect, it, vi } from "vitest";

import {
  createUniversalChatModel,
  parseModelReference,
} from "@/lib/ai/universal-chat-model";

describe("universal chat-model factory", () => {
  it("parses provider-prefixed models without damaging provider model slugs", () => {
    expect(parseModelReference("openrouter:anthropic/claude-sonnet-4:beta")).toEqual({
      provider: "openrouter",
      model: "anthropic/claude-sonnet-4:beta",
    });
    expect(parseModelReference("gpt-5")).toEqual({ provider: null, model: "gpt-5" });
  });

  it("constructs OpenRouter behind the same BaseChatModel boundary", async () => {
    vi.stubEnv("OPENROUTER_API_KEY", "test-openrouter-key");
    try {
      const model = await createUniversalChatModel(
        "openrouter:anthropic/claude-sonnet-4-5",
        { maxRetries: 0 },
      );
      expect(model.constructor.name).toBe("ChatOpenRouter");
      expect((model as unknown as { model: string }).model).toBe("anthropic/claude-sonnet-4-5");
      expect(typeof model.bindTools).toBe("function");
      expect(typeof model.withStructuredOutput).toBe("function");
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("continues to delegate built-in providers to LangChain's universal factory", async () => {
    const model = await createUniversalChatModel("openai:gpt-4o", {
      apiKey: "test-openai-key",
      maxRetries: 0,
    });
    expect(model.constructor.name).toBe("ConfigurableModel");
  });
});
