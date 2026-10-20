import "server-only";

import { choice, noul } from "@typesafe-ai/sdk";

import type { ContextCategory } from "@/lib/social-media/context/contracts";

export const CLASSIFICATION_MODEL = "jev-latest";
export const CLASSIFICATION_INCLUDE_THRESHOLD = 0.75;
export const CLASSIFICATION_EXCLUDE_THRESHOLD = 0.25;
export const TEMPORARY_TYPE_THRESHOLD = 0.7;

export const CLASSIFICATION_QUESTIONS = {
  identity: noul(
    "Does any independent part of `note` state or request adding, correcting, changing, or removing a fact stored in the realtor's identity profile?",
    {
      true: "The fact is a display name, professional title, brokerage/team, markets served, target audience, specialties, personal context/background, primary brand color, or secondary brand color. Statements such as 'My brokerage is Desert Peak Realty' count even without an explicit request to update the profile. Check every independent part of a note, even when another part requests temporary posts or a content-mix change.",
      false: "The note merely mentions an identity fact as background or as a subject for a post, without supplying or changing a profile fact; or it only requests changes to posts, content frequency, or temporary instructions.",
    },
  ),
  preference: noul(
    "Does any independent instruction in `note` set, change, or remove a lasting rule for the content, wording, or appearance of individual social media posts?",
    {
      true: "A general default for posts: tone, wording, caption length, point of view, emoji quantity within a post, visual style, formatting, imagery allowed or prohibited, or a qualitative topic preference (for example, 'I prefer practical open house advice over celebrity real estate news'). Absolute rules such as 'never use stock photos' or 'always include my logo' are preferences, not frequency. Evaluate each independent instruction, even when other instructions in the note concern frequency or a temporary period.",
      false: "An instruction only varies which or how many posts feature a topic, content type, or optional element (for example, 'more posts about open houses', 'feature open houses sometimes', or 'one in four posts') is frequency, not a lasting per-post preference. An instruction limited to the next N posts or a bounded calendar period is temporary, not lasting. Merely stating an identity fact is not a preference.",
    },
  ),
  frequency: noul(
    "Does any independent instruction in `note` change how often a topic, kind of content, or optional feature appears across different social media posts?",
    {
      true: "An ongoing change in the mix of posts: more or fewer posts about a topic, a larger or smaller share of a post type, featuring something sometimes or occasionally, or one in four posts. A request to 'talk more about X' means choosing X as the topic for more posts, even without the words 'more posts'; it does not mean mentioning X in every post. Check each independent instruction; a separate temporary request does not cancel an ongoing frequency instruction.",
      false: "A lasting rule about what belongs inside individual posts is a preference, not frequency: 'use more emojis', 'never use stock photos', 'always include my logo', or 'prefer practical advice over celebrity news'. Words like 'more' and 'never' alone do not change how often a kind of post appears. An instruction confined to the next N posts or a bounded calendar period is temporary, not frequency, even when it sets the topic of every post in that window: 'focus on open houses for two weeks' or 'promote my office for the next three posts'. Weekday-specific schedules such as 'every Friday' are outside this category.",
    },
  ),
  temporary: noul(
    "Does any independent part of `note` add, change, or remove a posting instruction with a limited number of upcoming posts or a finite calendar boundary?",
    {
      true: "The instruction applies to the next post, the next N posts, a particular calendar date such as tomorrow, or a bounded date/time period such as the next two weeks. A tone, emoji, style, imagery, or topic instruction is temporary when that instruction has such a limit; do not also treat it as a lasting preference. A request explicitly limited 'for a while' also counts as temporary, but its boundary is unclear. Check each independent part of a multi-instruction note.",
      false: "Only indefinite identity facts, lasting posting preferences, or ongoing content-mix instructions with no finite end. A recurring weekday instruction without an end date is not a bounded temporary instruction.",
    },
  ),
  temporary_type: choice(
    "For the temporary instruction in `note`, what determines its boundary? Prefer a stated calendar date over a post count, even if only one post is mentioned.",
    {
      counter: "A number of upcoming posts determines when it ends: 'the next post', 'the next 3 posts', or 'for 5 posts', with no specified calendar date.",
      date_range: "A specific calendar date or bounded time period determines when it applies: 'tomorrow's post', 'on October 31', 'until Friday', or 'for the next two weeks'. An explicitly dated single post is date_range, not counter.",
      unclear: "No resolvable count or calendar boundary (such as 'for a while'), or the note contains multiple temporary instructions with incompatible boundary types that cannot be represented by one choice.",
    },
  ),
} as const;

export type TemporaryType = "counter" | "date_range" | "unclear";
export type NoteClassification = {
  probabilities: Record<ContextCategory, number>;
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
