import { describe, expect, it } from "vitest";

import {
  CLASSIFICATION_EXCLUDE_THRESHOLD,
  CLASSIFICATION_INCLUDE_THRESHOLD,
  CLASSIFICATION_QUESTIONS,
  IDENTITY_FIELD_KEYS,
  makeNoteClassification,
  decideClassification,
  type NoteClassification,
} from "@/lib/social-media/context/classification-policy";
import { developmentClassificationFixtures, holdoutClassificationFixtures } from "@/lib/social-media/context/classification-fixtures";

function classification(probabilities: NoteClassification["probabilities"], temporaryChoice: "counter" | "date_range" | "unclear" = "counter", selected = 0.9): NoteClassification {
  return {
    probabilities,
    temporaryType: { choice: temporaryChoice, confidence: 0.9, probabilities: {
      counter: temporaryChoice === "counter" ? selected : 0.05,
      date_range: temporaryChoice === "date_range" ? selected : 0.05,
      unclear: temporaryChoice === "unclear" ? selected : 0.05,
    } },
    model: "test",
    usage: { inputTokens: 0, outputTokens: 0 },
  };
}

describe("classification policy", () => {
  it("exposes the finalized 13-question request map", () => {
    expect(Object.keys(CLASSIFICATION_QUESTIONS)).toEqual([
      ...IDENTITY_FIELD_KEYS,
      "preference",
      "frequency",
      "temporary",
      "temporary_type",
    ]);
    expect(Object.keys(CLASSIFICATION_QUESTIONS)).toHaveLength(13);
  });

  it("aggregates Identity from the maximum field score while preserving every field score", () => {
    const identityFieldScores = {
      display_name: 0.04,
      professional_title: 0.08,
      brokerage_name: 0.17,
      markets: 0.21,
      target_audience: 0.42,
      specialties: 0.93,
      personal_context: 0.12,
      primary_brand_color: 0.03,
      secondary_brand_color: 0.02,
    };

    const result = makeNoteClassification({
      identityFieldScores,
      preference: 0.11,
      frequency: 0.07,
      temporary: 0.05,
      temporaryType: {
        choice: "counter",
        probabilities: { counter: 0.9, date_range: 0.05, unclear: 0.05 },
        confidence: 0.9,
      },
      model: "jev-test",
      usage: { inputTokens: 10, outputTokens: 5 },
    });

    expect(result.probabilities).toEqual({
      identity: 0.93,
      preference: 0.11,
      frequency: 0.07,
      temporary: 0.05,
    });
    expect(result.identityFieldScores).toEqual(identityFieldScores);
    expect(decideClassification(result)).toEqual({
      kind: "routed",
      categories: ["identity"],
      temporaryType: null,
    });
  });

  it("keeps the required 18 development and 8 sealed holdout fixtures", () => {
    expect(developmentClassificationFixtures).toHaveLength(18);
    expect(holdoutClassificationFixtures).toHaveLength(8);
  });

  it("routes multiple confident labels", () => {
    expect(decideClassification(classification({ identity: 0.9, preference: 0.8, frequency: 0.1, temporary: 0.05 }))).toEqual({
      kind: "routed", categories: ["identity", "preference"], temporaryType: null,
    });
  });

  it("sends any middle-band label to review", () => {
    expect(decideClassification(classification({ identity: 0.9, preference: 0.5, frequency: 0.1, temporary: 0.05 }))).toEqual({
      kind: "needs_review", reasonCode: "routing_uncertainty",
    });
    expect(CLASSIFICATION_EXCLUDE_THRESHOLD).toBe(0.25);
    expect(CLASSIFICATION_INCLUDE_THRESHOLD).toBe(0.75);
  });

  it("uses temporary type only when temporary is routed", () => {
    expect(decideClassification(classification({ identity: 0.05, preference: 0.05, frequency: 0.05, temporary: 0.9 }, "date_range"))).toEqual({
      kind: "routed", categories: ["temporary"], temporaryType: "date_range",
    });
    expect(decideClassification(classification({ identity: 0.05, preference: 0.05, frequency: 0.05, temporary: 0.05 }, "unclear", 0.99))).toEqual({
      kind: "routed", categories: [], temporaryType: null,
    });
  });
});
