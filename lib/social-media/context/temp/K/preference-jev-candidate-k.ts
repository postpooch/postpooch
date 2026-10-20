/**
 * POSTPOOCH — PREFERENCE CANDIDATE K (EXPERIMENT ONLY)
 *
 * Narrowly test the one new confident Preference false positive in Combined J:
 * a brand/profile fact plus a temporary visual instruction was classified as
 * a lasting Preference.
 *
 * This is ONE replacement noul, NOT an additional question. It keeps the
 * Candidate I question and true criterion EXACTLY unchanged, and adds only
 * one contrasting example at the end of the false criterion.
 *
 * Baseline: exact assembled Combined J from postpooch-combined-classifier-j.ts.
 * Candidate K: that same 13-question map with ONLY the Preference entry
 * replaced with PREFERENCE_QUESTION_CANDIDATE_K.
 *
 * Do not change Identity E, Frequency V7, Temporary H, Temporary Type V7,
 * max Identity score, thresholds, or deterministic routing. No app edits.
 */
import { noul } from "@typesafe-ai/sdk";

export const PREFERENCE_QUESTION_CANDIDATE_K = noul(
  "Does `note` contain at least one lasting rule for what individual social media posts say or look like, even when another instruction is temporary?",
  {
    true: "A general default for posts: tone, wording, caption length, point of view, emoji quantity within a post, visual style, formatting, imagery allowed or prohibited, or a qualitative topic preference (for example, 'I prefer practical open house advice over celebrity real estate news'). Absolute rules such as 'never use stock photos' or 'always include my logo' are preferences, not frequency. Check every independent instruction. For example, 'Normally avoid stock photos, but use illustrations for the next two posts' contains a lasting preference to avoid stock photos, separate from the temporary illustration request.",
    false: "An instruction only varies which or how many posts feature a topic, content type, or optional element (for example, 'more posts about open houses', 'feature open houses sometimes', or 'one in four posts') is frequency, not a lasting per-post preference. An instruction limited to the next N posts or a bounded calendar period is temporary, not lasting. Merely stating an identity fact is not a preference. For example, 'My primary brand color is navy; use gold for tomorrow's graphic' is a profile fact plus a temporary visual request, not a lasting Preference.",
  },
);
