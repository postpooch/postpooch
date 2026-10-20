/**
 * POSTPOOCH — EXPERIMENT ONLY: Preference candidate I.
 *
 * Test whether explicitly recognizing separate lasting and short-lived
 * instructions improves Preference recall in mixed notes. This is exactly
 * ONE alternative Noul, not an additional question.
 *
 * Compare with the exact Version 7 Preference question. Keep Candidate E
 * Identity, Version 7 Frequency, Candidate H Temporary, Version 7
 * Temporary Type, and all aggregation, thresholds, routing untouched.
 * Send the complete question set in ONE Jev request per note.
 * No production edits.
 */

import { noul } from "@typesafe-ai/sdk";

export const PREFERENCE_QUESTION_CANDIDATE_I = noul(
  "Does `note` contain at least one lasting rule for what individual social media posts say or look like, even when another instruction is temporary?",
  {
    true: "A general default for posts: tone, wording, caption length, point of view, emoji quantity within a post, visual style, formatting, imagery allowed or prohibited, or a qualitative topic preference (for example, 'I prefer practical open house advice over celebrity real estate news'). Absolute rules such as 'never use stock photos' or 'always include my logo' are preferences, not frequency. Check every independent instruction. For example, 'Normally avoid stock photos, but use illustrations for the next two posts' contains a lasting preference to avoid stock photos, separate from the temporary illustration request.",
    false: "An instruction only varies which or how many posts feature a topic, content type, or optional element (for example, 'more posts about open houses', 'feature open houses sometimes', or 'one in four posts') is frequency, not a lasting per-post preference. An instruction limited to the next N posts or a bounded calendar period is temporary, not lasting. Merely stating an identity fact is not a preference.",
  },
);
