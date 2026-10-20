/**
 * POSTPOOCH — EXPERIMENT ONLY (not a production replacement)
 *
 * Candidate C: a targeted revision of the nine-field experimental Identity
 * questions. Compare against the earlier candidate, not the production
 * broad Identity Noul. Only markets, specialties and personal_context differ.
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
    "Does any independent part of `note` state, change, or remove a professional specialty the realtor explicitly claims as their own?",
    {
      true: "The realtor states that they specialize in, have a professional niche in, or focus their real estate practice on a type of transaction, service, or property. A factual statement counts without an explicit profile-update command.",
      false: "Only describes client groups they represent (such as retirees or relocating workers), locations where clients move, or subjects to feature in posts. Do not infer a professional specialty merely from the realtor's client audience, content topics, or brokerage/title; the realtor must actually claim that professional focus.",
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
