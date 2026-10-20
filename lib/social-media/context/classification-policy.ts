/**
 * POSTPOOCH — SELECTED CLASSIFICATION POLICY (COMBINED J)
 *
 * The best-supported Jev configuration following experiments A–M.
 * Exact question wording from the tested Combined J sources:
 *   Identity: Candidate E (9 independent noul questions)
 *   Preference: Candidate I (1 noul question)
 *   Frequency: original Version 7 (1 noul question)
 *   Temporary: Candidate H (1 noul question)
 *   Temporary type: original Version 7 (1 choice question)
 *
 * Submit all 13 questions in ONE Jev API request per note.
 * The first agent identifies the relevant categories. The downstream AI
 * receives the COMPLETE ORIGINAL NOTE and determines whether and how to act,
 * including interpreting 'few'/'handful' and resolving competing requests.
 *
 * This file contains the question policy, score aggregation, and deterministic
 * routing logic, NOT the Jev SDK call/decoder or the second agent. It is not
 * deployed merely by creating this file; application integration is required.
 */

import "server-only";

import { choice, noul } from "@typesafe-ai/sdk";

import type { ContextCategory } from "@/lib/social-media/context/contracts";

export const CLASSIFICATION_MODEL = "jev-latest";
export const CLASSIFICATION_INCLUDE_THRESHOLD = 0.75;
export const CLASSIFICATION_EXCLUDE_THRESHOLD = 0.25;
export const TEMPORARY_TYPE_THRESHOLD = 0.7;

export const IDENTITY_FIELD_QUESTIONS = {
  display_name: noul(
    "Does any independent part of `note` supply, correct, or remove the realtor's display name?",
    {
      true: "The realtor states the name they use professionally or requests a change to that name, even without saying 'update my profile'.",
      false: "A name belongs to a client or another person, is only mentioned in content for a post, or the note merely asks about the existing name.",
    },
  ),
  professional_title: noul(
    "Does any independent part of `note` supply, correct, or remove the realtor's professional title?",
    {
      true: "The realtor states or changes their own professional designation or job title, such as Associate Broker or Managing Broker.",
      false: "A professional title is only discussed as a post topic, belongs to another person, or is queried rather than supplied or changed.",
    },
  ),
  brokerage_name: noul(
    "Does any independent part of `note` supply, correct, or remove the realtor's brokerage or team affiliation?",
    {
      true: "The realtor states which brokerage or real estate team they work with, have joined, or have left; an explicit update command is not required.",
      false: "A brokerage or team is only mentioned, discussed in a post, or asked about without providing or changing the realtor's affiliation.",
    },
  ),
  markets: noul(
    "Does any independent part of `note` state, change, or remove a geographic area where the realtor personally offers real estate services?",
    {
      true: "The realtor expressly identifies a professional service area: places where they serve, represent, or take real estate clients, or a place added to or removed from their markets. Factual statements count without an explicit update command.",
      false: "A location is only a topic for posts, a place clients are moving to, or a place in someone's background. A client audience described as 'people relocating to Phoenix' does not, by itself, assert Phoenix as the realtor's service area. Requests for more or fewer posts about a location are not market updates.",
    },
  ),
  target_audience: noul(
    "Does any independent part of `note` state or change which types of clients the realtor primarily works with or targets?",
    {
      true: "The realtor describes their own client audience, such as military families relocating, first-time buyers, or retirees, even as an ordinary factual statement.",
      false: "The note only asks for a post aimed at those people or mentions them as a content topic without stating the realtor's client audience.",
    },
  ),
  specialties: noul(
    "Does any independent part of `note` state, add, change, or stop a professional real estate specialty, niche, or practice focus of the realtor, rather than a job title, client group, or post topic?",
    {
      true: "The realtor identifies a type of property, real estate transaction, or professional service as something they specialize in, focus their practice on, or mainly handle. This also includes changing or DISCONTINUING that work: 'I stopped handling probate cases', 'I no longer focus on investment duplexes', or 'remove foreclosure listings from my specialties'. Stated expertise, niche, and primary practice focus count without an explicit profile-update command.",
      false: "A professional TITLE or designation alone is not a practice specialty: 'My title is Residential Sales Director' or 'My job title is Relocation Specialist' only changes a title unless a separate clause actually describes the realtor's work focus. The types of CLIENTS the realtor represents (such as retirees, first-time buyers, or relocating families) describe target audience, not automatically specialty. A service-area location, post topic, request for more/fewer posts, style preference, short-term campaign, or question about an existing profile setting also does not establish or change a specialty. Do not infer specialty from the words in a title or from client demographics.",
    },
  ),
  personal_context: noul(
    "Does any independent part of `note` state, change, or remove a biographical fact about the realtor's personal life or past background?",
    {
      true: "The realtor describes their own upbringing, education, prior career, personal history, experiences, or interests. An ordinary factual statement counts even without a request to update their profile.",
      false: "Current brokerage or team affiliation, job title or promotion, markets served, target client audience, real estate specialties, and brand settings are not personal background merely because they describe the realtor. Post topics, writing requests, and facts about other people also do not count.",
    },
  ),
  primary_brand_color: noul(
    "Does any independent part of `note` state or change the realtor's designated primary brand color?",
    {
      true: "The realtor identifies the primary brand color itself, by name or exact value such as a hex code, including corrections or removal.",
      false: "The note only requests colors for a particular post or visual style, or refers to a color without designating it as the primary brand color.",
    },
  ),
  secondary_brand_color: noul(
    "Does any independent part of `note` state or change the realtor's designated secondary brand color?",
    {
      true: "The realtor identifies the secondary brand color itself, by name or exact value such as a hex code, including corrections or removal.",
      false: "The note only requests colors for a particular post or visual style, or refers to a color without designating it as the secondary brand color.",
    },
  ),
} as const;

export const IDENTITY_FIELD_KEYS = [
  "display_name",
  "professional_title",
  "brokerage_name",
  "markets",
  "target_audience",
  "specialties",
  "personal_context",
  "primary_brand_color",
  "secondary_brand_color",
] as const;

export type IdentityFieldKey = (typeof IDENTITY_FIELD_KEYS)[number];
export type IdentityFieldScores = Record<IdentityFieldKey, number>;

/**
 * Use the strongest of the nine field scores as the Identity routing score.
 * This is the verified aggregation heuristic, not a calibrated probability.
 * Keep all nine original scores available to the downstream interpreter.
 */
export function candidateIdentityScore(scores: IdentityFieldScores): number {
  return Math.max(...IDENTITY_FIELD_KEYS.map((key) => scores[key]));
}


export const PREFERENCE_QUESTION_CANDIDATE_I = noul(
  "Does `note` contain at least one lasting rule for what individual social media posts say or look like, even when another instruction is temporary?",
  {
    true: "A general default for posts: tone, wording, caption length, point of view, emoji quantity within a post, visual style, formatting, imagery allowed or prohibited, or a qualitative topic preference (for example, 'I prefer practical open house advice over celebrity real estate news'). Absolute rules such as 'never use stock photos' or 'always include my logo' are preferences, not frequency. Check every independent instruction. For example, 'Normally avoid stock photos, but use illustrations for the next two posts' contains a lasting preference to avoid stock photos, separate from the temporary illustration request.",
    false: "An instruction only varies which or how many posts feature a topic, content type, or optional element (for example, 'more posts about open houses', 'feature open houses sometimes', or 'one in four posts') is frequency, not a lasting per-post preference. An instruction limited to the next N posts or a bounded calendar period is temporary, not lasting. Merely stating an identity fact is not a preference.",
  },
);

export const FREQUENCY_QUESTION_VERSION_7 = noul(
    "Does any independent instruction in `note` change how often a topic, kind of content, or optional feature appears across different social media posts?",
    {
      true: "An ongoing change in the mix of posts: more or fewer posts about a topic, a larger or smaller share of a post type, featuring something sometimes or occasionally, or one in four posts. A request to 'talk more about X' means choosing X as the topic for more posts, even without the words 'more posts'; it does not mean mentioning X in every post. Check each independent instruction; a separate temporary request does not cancel an ongoing frequency instruction.",
      false: "A lasting rule about what belongs inside individual posts is a preference, not frequency: 'use more emojis', 'never use stock photos', 'always include my logo', or 'prefer practical advice over celebrity news'. Words like 'more' and 'never' alone do not change how often a kind of post appears. An instruction confined to the next N posts or a bounded calendar period is temporary, not frequency, even when it sets the topic of every post in that window: 'focus on open houses for two weeks' or 'promote my office for the next three posts'. Weekday-specific schedules such as 'every Friday' are outside this category.",
    },
  );

export const TEMPORARY_QUESTION_CANDIDATE_H = noul(
  "Does any independent posting instruction in `note` apply only for a limited span of upcoming posts or calendar time?",
  {
    true: "The instruction is limited to the next post, a number of upcoming posts, a dated post such as tomorrow's, or a bounded period such as next week. Explicitly short-lived directions like 'for a while' or 'the next few posts' also count, even if their exact boundary is unclear. Evaluate each instruction separately when a lasting rule also appears.",
    false: "An indefinite writing or visual default, an ongoing change to the mix of posts, or a fact about the realtor is not temporary. Merely mentioning a date, number of posts, or season as background or a post topic does not set a time limit. A repeating weekday schedule without an ending is not temporary.",
  },
);

export const TEMPORARY_TYPE_QUESTION_VERSION_7 = choice(
    "For the temporary instruction in `note`, what determines its boundary? Prefer a stated calendar date over a post count, even if only one post is mentioned.",
    {
      counter: "A number of upcoming posts determines when it ends: 'the next post', 'the next 3 posts', or 'for 5 posts', with no specified calendar date.",
      date_range: "A specific calendar date or bounded time period determines when it applies: 'tomorrow's post', 'on October 31', 'until Friday', or 'for the next two weeks'. An explicitly dated single post is date_range, not counter.",
      unclear: "No resolvable count or calendar boundary (such as 'for a while'), or the note contains multiple temporary instructions with incompatible boundary types that cannot be represented by one choice.",
    },
  );

/** The single, flat question map for ONE Jev request per note. */
export const CLASSIFICATION_QUESTIONS = {
  ...IDENTITY_FIELD_QUESTIONS,
  preference: PREFERENCE_QUESTION_CANDIDATE_I,
  frequency: FREQUENCY_QUESTION_VERSION_7,
  temporary: TEMPORARY_QUESTION_CANDIDATE_H,
  temporary_type: TEMPORARY_TYPE_QUESTION_VERSION_7,
} as const;

/** Legacy experiment name for tooling that references the tested Combined J map. */
export const COMBINED_J_QUESTIONS = CLASSIFICATION_QUESTIONS;

export type TemporaryType = "counter" | "date_range" | "unclear";
export type NoteClassification = {
  probabilities: Record<ContextCategory, number>;
  /** Preserve the nine individual Identity signals for diagnostics/interpretation. */
  identityFieldScores?: IdentityFieldScores;
  temporaryType: {
    choice: TemporaryType;
    probabilities: Record<TemporaryType, number>;
    confidence: number;
  };
  model: string;
  usage: { inputTokens: number; outputTokens: number };
};

export interface NoteClassifier {
  classify(input: { note: string }): Promise<NoteClassification>;
}

export type ClassificationDecision =
  | { kind: "routed"; categories: ContextCategory[]; temporaryType: TemporaryType | null }
  | { kind: "needs_review"; reasonCode: "routing_uncertainty" | "temporary_type_uncertainty" };

export function decideClassification(classification: NoteClassification): ClassificationDecision {
  const categories = (Object.keys(classification.probabilities) as ContextCategory[]);
  if (categories.some((category) => {
    const p = classification.probabilities[category];
    return p > CLASSIFICATION_EXCLUDE_THRESHOLD && p < CLASSIFICATION_INCLUDE_THRESHOLD;
  })) {
    return { kind: "needs_review", reasonCode: "routing_uncertainty" };
  }

  const included = categories.filter(
    (category) => classification.probabilities[category] >= CLASSIFICATION_INCLUDE_THRESHOLD,
  );
  if (included.includes("temporary")) {
    const selectedProbability = classification.temporaryType.probabilities[classification.temporaryType.choice];
    if (classification.temporaryType.choice === "unclear" || selectedProbability < TEMPORARY_TYPE_THRESHOLD) {
      return { kind: "needs_review", reasonCode: "temporary_type_uncertainty" };
    }
    return { kind: "routed", categories: included, temporaryType: classification.temporaryType.choice };
  }
  return { kind: "routed", categories: included, temporaryType: null };
}

/**
 * Convert the 13 already-decoded Jev answers into the four routing scores.
 * The adapter must run ALL 13 questions in ONE Jev request and decode them.
 * Keep the nine individual Identity scores for downstream interpretation.
 * This function does not call Jev, decide actions/counts, or mutate data.
 */
export function makeNoteClassification(input: {
  identityFieldScores: IdentityFieldScores;
  preference: number;
  frequency: number;
  temporary: number;
  temporaryType: NoteClassification["temporaryType"];
  model: string;
  usage: NoteClassification["usage"];
}): NoteClassification {
  return {
    probabilities: {
      identity: candidateIdentityScore(input.identityFieldScores),
      preference: input.preference,
      frequency: input.frequency,
      temporary: input.temporary,
    },
    identityFieldScores: input.identityFieldScores,
    temporaryType: input.temporaryType,
    model: input.model,
    usage: input.usage,
  };
}
