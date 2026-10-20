/**
 * POSTPOOCH — EXPERIMENT ONLY (not a production replacement)
 *
 * Candidate B for a controlled Jev A/B evaluation against the existing
 * Version 7 CLASSIFICATION_QUESTIONS.identity Noul.
 *
 * Scope: the nine identity fields currently supported by the existing
 * classification policy. This is NOT a claim that other PostPooch profile
 * attributes are not part of a user's profile. Their classification and
 * persistence are outside this particular identity-granularity experiment.
 *
 * Supply all nine questions in ONE Jev request, together with the unchanged
 * Version 7 preference, frequency, temporary, and temporary_type questions.
 * Do not submit each field as a separate API call.
 *
 * This module intentionally does not alter application code, thresholds,
 * routing logic, or database state.
 */

import { noul } from "@typesafe-ai/sdk";

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
    "Does any independent part of `note` supply, correct, or remove a geographic area the realtor serves professionally?",
    {
      true: "The realtor states, adds, or removes a city, neighborhood, or other location where they serve clients, even without an explicit update request.",
      false: "A place is only a post topic, a client's location, the realtor's hometown, or a location mentioned without saying they serve it.",
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
    "Does any independent part of `note` state, correct, or remove a professional specialty of the realtor?",
    {
      true: "The realtor states what they specialize in as an agent, such as historic home restorations or waterfront properties, even without asking to edit a profile.",
      false: "A subject is only requested as post content, or is described as something to post about more often, without asserting the realtor's specialty.",
    },
  ),
  personal_context: noul(
    "Does any independent part of `note` supply, correct, or remove a fact about the realtor's personal background?",
    {
      true: "The realtor shares their own biographical information, such as where they grew up, education, experience, or personal history; no explicit update command is needed.",
      false: "The note merely requests a writing style, mentions another person's background, or asks for a post on a personal-interest topic without stating a fact about the realtor.",
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
 * EXPERIMENTAL AGGREGATION RULE — NOT A CALIBRATED PROBABILITY.
 *
 * Use the highest field-specific score as a comparable scalar for the
 * unchanged 4-category decideClassification() function. This is deliberately
 * a fixed rule for the A/B test, NOT an assertion that max(p) is the true
 * probability of the union of nine events. Report all nine raw scores too.
 */
export function candidateIdentityScore(scores: IdentityFieldScores): number {
  return Math.max(...IDENTITY_FIELD_KEYS.map((key) => scores[key]));
}
