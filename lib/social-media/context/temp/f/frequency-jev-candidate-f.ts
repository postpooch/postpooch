/**
 * POSTPOOCH — EXPERIMENT ONLY: Frequency candidate F.
 *
 * This is ONLY a replacement for CLASSIFICATION_QUESTIONS.frequency during
 * an isolated A/B evaluation. It does not replace the Identity candidate,
 * the other three category questions, temporary_type, or routing logic.
 *
 * Compare against the EXACT frequency question in the verified production
 * Version 7 policy. Keep Candidate E's nine Identity questions unchanged.
 * Submit all questions together in ONE Jev request per note.
 */

import { noul } from "@typesafe-ai/sdk";

export const FREQUENCY_QUESTION_CANDIDATE_F = noul(
  "Does any independent instruction in `note` change how often different future posts feature a topic, type of post, or optional element, rather than changing what goes inside an individual post?",
  {
    true: "An ONGOING choice about the distribution of content ACROSS POSTS: make more or fewer posts about X; talk more or less about X (meaning choose X as the topic of more or fewer posts); add X to the content mix occasionally or once in a while; feature X in some posts; change the share or ratio of a post type; or stop making that type of post. This can control which posts contain an optional element (such as polls), not merely post topics. Recognize a separate ongoing instruction even if the same note also contains a temporary request or a within-post preference. No explicit use of the words 'across posts' is required.",
    false: "A lasting rule governing EACH INDIVIDUAL POST is Preference, not Frequency: use more/fewer emojis or words per caption, add more detail about X within each relevant post, shorten captions, always place a logo or question in each post, or change visual style. 'More' and 'less' alone do not imply Frequency. A request bounded by the next N posts or a specific date/period is Temporary, not ongoing Frequency, even if the topic appears repeatedly during that window. Stating a realtor profile fact or merely asking a question does not change the content mix. A weekday-only posting schedule is outside this category.",
  },
);
