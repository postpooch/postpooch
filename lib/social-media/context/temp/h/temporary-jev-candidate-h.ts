/**
 * POSTPOOCH — EXPERIMENT ONLY: Temporary candidate H.
 *
 * Replace ONLY CLASSIFICATION_QUESTIONS.temporary during an isolated
 * evaluation. Keep Candidate E's nine Identity questions; Version 7
 * Preference, Frequency, and Temporary Type questions; and the current
 * aggregation, thresholds, and routing unchanged.
 *
 * This is ONE independent Noul. Send it with all the other questions in
 * ONE Jev request per note. Do not deploy this file to production.
 */

import { noul } from "@typesafe-ai/sdk";

export const TEMPORARY_QUESTION_CANDIDATE_H = noul(
  "Does any independent posting instruction in `note` apply only for a limited span of upcoming posts or calendar time?",
  {
    true: "The instruction is limited to the next post, a number of upcoming posts, a dated post such as tomorrow's, or a bounded period such as next week. Explicitly short-lived directions like 'for a while' or 'the next few posts' also count, even if their exact boundary is unclear. Evaluate each instruction separately when a lasting rule also appears.",
    false: "An indefinite writing or visual default, an ongoing change to the mix of posts, or a fact about the realtor is not temporary. Merely mentioning a date, number of posts, or season as background or a post topic does not set a time limit. A repeating weekday schedule without an ending is not temporary.",
  },
);
