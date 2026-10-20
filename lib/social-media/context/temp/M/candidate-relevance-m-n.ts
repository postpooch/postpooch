/**
 * POSTPOOCH — EXPERIMENT ONLY: Relevance / explicit non-adoption.
 *
 * All three arms retain thirteen questions. J is unchanged.
 * M changes ONLY the false criterion of the Temporary noul.
 * N changes ONLY the false criteria of Temporary, Preference, Frequency.
 * Nine Identity questions, Temporary Type, aggregation, thresholds and router
 * are imported verbatim from Combined J and NEVER redefined here.
 *
 * "My client said use purple for the next two posts" can be Temporary.
 * "My client said use purple; I disagree, use orange tomorrow" is Temporary.
 * An expressly rejected and archived example with NO replacement request is
 * not a relevant posting category. Second agent remains responsible for intent.
 */
import { noul } from "@typesafe-ai/sdk";
import { COMBINED_J_QUESTIONS } from "./postpooch-combined-classifier-j";

export const TEMPORARY_QUESTION_M = noul(
  "Does any independent posting instruction in `note` apply only for a limited span of upcoming posts or calendar time?",
  {
    true: "The instruction is limited to the next post, a number of upcoming posts, a dated post such as tomorrow's, or a bounded period such as next week. Explicitly short-lived directions like 'for a while' or 'the next few posts' also count, even if their exact boundary is unclear. Evaluate each instruction separately when a lasting rule also appears.",
    false: "An indefinite writing or visual default, an ongoing change to the mix of posts, or a fact about the realtor is not temporary. Merely mentioning a date, number of posts, or season as background or a post topic does not set a time limit. A repeating weekday schedule without an ending is not temporary. A quoted or described posting proposal explicitly rejected by the realtor, or presented only for quotation, transcription, or records, is not itself a Temporary request; evaluate any separate replacement normally. A bare relay, suggestion, or advisory question can still count.",
  },
);

export const PREFERENCE_QUESTION_N = noul(
  "Does `note` contain at least one lasting rule for what individual social media posts say or look like, even when another instruction is temporary?",
  {
    true: "A general default for posts: tone, wording, caption length, point of view, emoji quantity within a post, visual style, formatting, imagery allowed or prohibited, or a qualitative topic preference (for example, 'I prefer practical open house advice over celebrity real estate news'). Absolute rules such as 'never use stock photos' or 'always include my logo' are preferences, not frequency. Check every independent instruction. For example, 'Normally avoid stock photos, but use illustrations for the next two posts' contains a lasting preference to avoid stock photos, separate from the temporary illustration request.",
    false: "An instruction only varies which or how many posts feature a topic, content type, or optional element (for example, 'more posts about open houses', 'feature open houses sometimes', or 'one in four posts') is frequency, not a lasting per-post preference. An instruction limited to the next N posts or a bounded calendar period is temporary, not lasting. Merely stating an identity fact is not a preference. A quoted or described proposal explicitly rejected by the realtor, or presented only for quotation, transcription, or records, is not itself a request of this category; evaluate any separate replacement normally. A bare relay, suggestion, or advisory question can still count.",
  },
);

export const FREQUENCY_QUESTION_N = noul(
  "Does any independent instruction in `note` change how often a topic, kind of content, or optional feature appears across different social media posts?",
  {
    true: "An ongoing change in the mix of posts: more or fewer posts about a topic, a larger or smaller share of a post type, featuring something sometimes or occasionally, or one in four posts. A request to 'talk more about X' means choosing X as the topic for more posts, even without the words 'more posts'; it does not mean mentioning X in every post. Check each independent instruction; a separate temporary request does not cancel an ongoing frequency instruction.",
    false: "A lasting rule about what belongs inside individual posts is a preference, not frequency: 'use more emojis', 'never use stock photos', 'always include my logo', or 'prefer practical advice over celebrity news'. Words like 'more' and 'never' alone do not change how often a kind of post appears. An instruction confined to the next N posts or a bounded calendar period is temporary, not frequency, even when it sets the topic of every post in that window: 'focus on open houses for two weeks' or 'promote my office for the next three posts'. Weekday-specific schedules such as 'every Friday' are outside this category. A quoted or described proposal explicitly rejected by the realtor, or presented only for quotation, transcription, or records, is not itself a request of this category; evaluate any separate replacement normally. A bare relay, suggestion, or advisory question can still count.",
  },
);

/** Explicit variant maps. J must be imported from the frozen J source. */
export const QUESTIONS_J = COMBINED_J_QUESTIONS;
export const QUESTIONS_M = {
  ...COMBINED_J_QUESTIONS,
  temporary: TEMPORARY_QUESTION_M,
} as const;
export const QUESTIONS_N = {
  ...COMBINED_J_QUESTIONS,
  preference: PREFERENCE_QUESTION_N,
  frequency: FREQUENCY_QUESTION_N,
  temporary: TEMPORARY_QUESTION_M,
} as const;
