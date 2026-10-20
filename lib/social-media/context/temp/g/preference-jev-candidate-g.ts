/**
 * POSTPOOCH — EXPERIMENT ONLY: Preference candidate G.
 *
 * One alternative Noul for CLASSIFICATION_QUESTIONS.preference.
 * Compare with the exact Version 7 Preference Noul. Do not change
 * Candidate E Identity, Version 7 Frequency or Temporary/Temporary Type,
 * thresholds, Identity aggregation, or routing.
 *
 * Submit all questions together in ONE Jev request per note.
 * This file must not be used as a production replacement without testing.
 */

import { noul } from "@typesafe-ai/sdk";

export const PREFERENCE_QUESTION_CANDIDATE_G = noul(
  "Does any independent instruction in `note` set, change, or remove a lasting default for what individual social media posts say or look like?",
  {
    true: "An ongoing rule for writing or designing a post: voice, wording, length, detail, emojis, hashtags, layout, imagery, or words to favor or avoid. A qualitative topic preference ('I prefer practical advice over celebrity gossip') also counts. A rule for every post or for posts about a particular subject remains a preference.",
    false: "Changing which or how many posts feature a topic, post type, or optional feature is Frequency, not Preference ('more posts about X', 'include polls in some posts'). An instruction ending after a number of posts or a date is Temporary, even if it changes the style of those posts. A fact about the realtor's profile, a question, or feedback about past posts does not establish a lasting posting rule.",
  },
);
