import { z } from "zod";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOpenRouter } from "@langchain/openrouter";
import { afterEach, describe, expect, it, vi } from "vitest";
import { initChatModel } from "langchain";

import { mutationPlanSchema, type MutationPlannerInput } from "@/lib/social-media/context/contracts";
import {
  LangChainMutationPlanner,
  normalizeProviderPlan,
  parsePlainJsonPlannerResponse,
  plannerModelOptions,
  providerFacingSchema,
} from "@/lib/social-media/context/mutation-planner";

const plannerInput: MutationPlannerInput = {
  note: "Please use a bunch of emojis in my posts, in the posts themselves.",
  routedCategories: ["preference"],
  snapshot: {
    revision: 5,
    identity: {
      display_name: "Michael Lee Higgins",
      professional_title: "realtor",
      brokerage_name: null,
      target_audience: "first time home buyers",
      specialties: [],
      personal_context: null,
      primary_brand_color: null,
      secondary_brand_color: null,
    },
    markets: [{ index: 1, cityName: "Scottsdale", stateCode: "AZ" }],
    preferences: [],
    frequencyInstructions: [],
    temporaryInstructions: [],
  },
  identityRegistry: [],
  referenceTimestamp: "2026-10-12T02:25:17.142Z",
  timeZone: "America/Phoenix",
  attachedAssets: [],
};

const emojiPlan = {
  disposition: "mutate" as const,
  operations: [{ kind: "list.add" as const, category: "preference" as const, text: "Use a bunch of emojis in posts." }],
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("mutation planner provider contracts", () => {
  it("gives OpenAI an object-root schema and unwraps back to MutationPlan", () => {
    const schema = z.toJSONSchema(providerFacingSchema("openai", false)) as { type?: string; properties?: Record<string, unknown> };
    expect(schema.type).toBe("object");
    expect(schema.properties).toHaveProperty("proposal");
    const genericPlan = { disposition: "no_change" as const, reasonCode: "explicit_no_change" as const };
    expect(normalizeProviderPlan("openai", { proposal: genericPlan })).toEqual(genericPlan);
    expect(mutationPlanSchema.parse(normalizeProviderPlan("openai", { proposal: genericPlan }))).toEqual(genericPlan);
  });

  it("keeps OpenAI storage and Responses settings inside provider options", () => {
    expect(plannerModelOptions("openai:gpt-5.6-terra")).toMatchObject({
      useResponsesApi: true,
      zdrEnabled: true,
      reasoningEffort: "low",
    });
    expect(plannerModelOptions("anthropic:claude-example")).not.toHaveProperty("zdrEnabled");
  });

  it("emits store:false and an object-root schema on the OpenAI wire request", async () => {
    let requestBody: Record<string, unknown> | undefined;
    const fakeFetch = async (_input: string | URL | Request, init?: RequestInit) => {
      requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
      return new Response(JSON.stringify({ error: { message: "test stop", type: "invalid_request_error" } }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    };
    const model = await initChatModel("openai:gpt-5.6-terra", {
      apiKey: "test-key",
      useResponsesApi: true,
      zdrEnabled: true,
      maxRetries: 0,
      configuration: { fetch: fakeFetch },
    });
    const structured = model.withStructuredOutput(providerFacingSchema("openai", false), {
      name: "social_media_context_mutation_plan",
      method: "jsonSchema",
    });
    await expect(structured.invoke([{ role: "user", content: "test" }])).rejects.toThrow();
    expect(requestBody).toBeDefined();
    expect(requestBody?.store).toBe(false);
    expect(requestBody).not.toHaveProperty("previous_response_id");
    expect(requestBody?.tools ?? []).toEqual([]);
    const text = requestBody?.text as { format?: { schema?: { type?: string; properties?: Record<string, unknown> } } } | undefined;
    expect(text?.format?.schema?.type).toBe("object");
    expect(text?.format?.schema?.properties).toHaveProperty("proposal");
  });

  it("sends OpenRouter an ordinary chat request with the schema in the prompt and no tools", async () => {
    let requestBody: Record<string, unknown> | undefined;
    const fakeFetch = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
      return new Response(JSON.stringify({
        id: "generation-test",
        provider: "InferenceNet",
        model: "z-ai/glm-5.3-flash",
        object: "chat.completion",
        created: 1,
        choices: [{
          index: 0,
          finish_reason: "stop",
          native_finish_reason: "stop",
          message: { role: "assistant", content: JSON.stringify(emojiPlan) },
        }],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      }), { status: 200, headers: { "content-type": "application/json" } });
    });
    vi.stubGlobal("fetch", fakeFetch);
    vi.stubEnv("SOCIAL_MEDIA_MUTATION_MODEL", "openrouter:z-ai/glm-5.3-flash");
    const model = new ChatOpenRouter({
      model: "z-ai/glm-5.3-flash",
      apiKey: "test-key",
      temperature: 0,
      maxRetries: 0,
    });

    const result = await new LangChainMutationPlanner(async () => model).plan(plannerInput);

    expect(result).toEqual(emojiPlan);
    expect(fakeFetch).toHaveBeenCalledTimes(1);
    expect(requestBody).toBeDefined();
    expect(requestBody).not.toHaveProperty("tools");
    expect(requestBody).not.toHaveProperty("tool_choice");
    expect(requestBody).not.toHaveProperty("response_format");
    const messages = requestBody?.messages as Array<{ role: string; content: string }>;
    const systemPrompt = messages.find((message) => message.role === "system")?.content ?? "";
    expect(systemPrompt).toContain("Return only valid JSON");
    expect(systemPrompt).toContain("Reference JSON schema:");
    expect(systemPrompt).toContain('"list.add"');
  });

  it("uses direct invocation instead of structured output for OpenRouter", async () => {
    vi.stubEnv("SOCIAL_MEDIA_MUTATION_MODEL", "openrouter:z-ai/glm-5.3-flash");
    const invoke = vi.fn(async () => ({ content: JSON.stringify(emojiPlan), tool_calls: [] }));
    const withStructuredOutput = vi.fn(() => {
      throw new Error("structured output must not be used");
    });
    const model = { invoke, withStructuredOutput } as unknown as BaseChatModel;

    await expect(new LangChainMutationPlanner(async () => model).plan(plannerInput)).resolves.toEqual(emojiPlan);
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(withStructuredOutput).not.toHaveBeenCalled();
  });
});

describe("ordinary JSON mutation planner parsing", () => {
  it("parses and validates one complete JSON document", () => {
    expect(parsePlainJsonPlannerResponse({ content: JSON.stringify(emojiPlan) }, mutationPlanSchema)).toEqual(emojiPlan);
  });

  it.each([
    ["missing message", null, "missing_response"],
    ["missing content", {}, "missing_response"],
    ["empty content", { content: "   " }, "missing_response"],
    ["Markdown fences", { content: `\`\`\`json\n${JSON.stringify(emojiPlan)}\n\`\`\`` }, "invalid_json"],
    ["surrounding prose", { content: `Here is the plan: ${JSON.stringify(emojiPlan)}` }, "invalid_json"],
    ["malformed JSON", { content: '{"disposition":' }, "invalid_json"],
    ["oversized response", { content: "x".repeat(64_001) }, "response_too_large"],
    ["unknown property", { content: JSON.stringify({ ...emojiPlan, extra: true }) }, "schema_validation_failed"],
    ["wrong operation shape", { content: JSON.stringify({ disposition: "mutate", operations: [{ kind: "list.add", category: "preference" }] }) }, "schema_validation_failed"],
    ["tool call", { content: JSON.stringify(emojiPlan), tool_calls: [{ name: "anything", args: {} }] }, "unexpected_tool_call"],
  ])("rejects %s", (_label, response, code) => {
    expect(() => parsePlainJsonPlannerResponse(response, mutationPlanSchema)).toThrow(expect.objectContaining({ code }));
  });

  it("rejects a mutation when Jev routed no categories", async () => {
    vi.stubEnv("SOCIAL_MEDIA_MUTATION_MODEL", "openrouter:z-ai/glm-5.3-flash");
    const model = {
      invoke: vi.fn(async () => ({ content: JSON.stringify(emojiPlan) })),
      withStructuredOutput: vi.fn(),
    } as unknown as BaseChatModel;

    await expect(new LangChainMutationPlanner(async () => model).plan({
      ...plannerInput,
      routedCategories: [],
    })).rejects.toMatchObject({ code: "schema_validation_failed" });
  });
});
