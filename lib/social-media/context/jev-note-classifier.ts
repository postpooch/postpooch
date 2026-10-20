import "server-only";

import { TypeSafeClient } from "@typesafe-ai/sdk";

import {
  CLASSIFICATION_MODEL,
  CLASSIFICATION_QUESTIONS,
  IDENTITY_FIELD_KEYS,
  makeNoteClassification,
  type IdentityFieldScores,
  type NoteClassification,
  type NoteClassifier,
} from "@/lib/social-media/context/classification-policy";

export class JevNoteClassifier implements NoteClassifier {
  constructor(private readonly client = new TypeSafeClient({ logLevel: "off" })) {}

  async classify(input: { note: string }): Promise<NoteClassification> {
    const response = await this.client.systemOne(
      {
        state: { note: input.note },
        model: CLASSIFICATION_MODEL,
        questions: CLASSIFICATION_QUESTIONS,
      },
      { timeout: 8_000, retry: { maxRetries: 0 } },
    );

    const identityFieldScores = {} as IdentityFieldScores;
    for (const field of IDENTITY_FIELD_KEYS) {
      identityFieldScores[field] = response.answers[field].noul;
    }

    return makeNoteClassification({
      identityFieldScores,
      preference: response.answers.preference.noul,
      frequency: response.answers.frequency.noul,
      temporary: response.answers.temporary.noul,
      temporaryType: {
        choice: response.answers.temporary_type.choice,
        probabilities: response.answers.temporary_type.probabilities,
        confidence: response.answers.temporary_type.confidence,
      },
      model: response.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    });
  }
}
