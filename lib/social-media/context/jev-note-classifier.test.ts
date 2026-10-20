import { describe, expect, it, vi } from "vitest";

import type { TypeSafeClient } from "@typesafe-ai/sdk";

import {
  CLASSIFICATION_MODEL,
  CLASSIFICATION_QUESTIONS,
  IDENTITY_FIELD_KEYS,
} from "@/lib/social-media/context/classification-policy";
import { JevNoteClassifier } from "@/lib/social-media/context/jev-note-classifier";

describe("JevNoteClassifier", () => {
  it("submits and decodes all 13 questions in one request", async () => {
    const systemOne = vi.fn().mockResolvedValue({
      answers: {
        display_name: { noul: 0.11 },
        professional_title: { noul: 0.22 },
        brokerage_name: { noul: 0.31 },
        markets: { noul: 0.44 },
        target_audience: { noul: 0.52 },
        specialties: { noul: 0.93 },
        personal_context: { noul: 0.61 },
        primary_brand_color: { noul: 0.07 },
        secondary_brand_color: { noul: 0.08 },
        preference: { noul: 0.81 },
        frequency: { noul: 0.12 },
        temporary: { noul: 0.88 },
        temporary_type: {
          choice: "counter",
          probabilities: { counter: 0.91, date_range: 0.06, unclear: 0.03 },
          confidence: 0.86,
        },
      },
      model: "jev-test-version",
      usage: { input_tokens: 321, output_tokens: 45 },
    });
    const classifier = new JevNoteClassifier({ systemOne } as unknown as TypeSafeClient);
    const note = "My specialty is historic homes, and make the next two posts about restoration tips.";

    const result = await classifier.classify({ note });

    expect(systemOne).toHaveBeenCalledTimes(1);
    expect(systemOne).toHaveBeenCalledWith(
      {
        state: { note },
        model: CLASSIFICATION_MODEL,
        questions: CLASSIFICATION_QUESTIONS,
      },
      { timeout: 8_000, retry: { maxRetries: 0 } },
    );
    const request = systemOne.mock.calls[0]?.[0] as { questions: Record<string, unknown> };
    expect(Object.keys(request.questions)).toEqual([
      ...IDENTITY_FIELD_KEYS,
      "preference",
      "frequency",
      "temporary",
      "temporary_type",
    ]);
    expect(Object.keys(request.questions)).toHaveLength(13);
    expect(result).toEqual({
      probabilities: {
        identity: 0.93,
        preference: 0.81,
        frequency: 0.12,
        temporary: 0.88,
      },
      identityFieldScores: {
        display_name: 0.11,
        professional_title: 0.22,
        brokerage_name: 0.31,
        markets: 0.44,
        target_audience: 0.52,
        specialties: 0.93,
        personal_context: 0.61,
        primary_brand_color: 0.07,
        secondary_brand_color: 0.08,
      },
      temporaryType: {
        choice: "counter",
        probabilities: { counter: 0.91, date_range: 0.06, unclear: 0.03 },
        confidence: 0.86,
      },
      model: "jev-test-version",
      usage: { inputTokens: 321, outputTokens: 45 },
    });
  });
});
