import type { ContextCategory } from "@/lib/social-media/context/contracts";
import type { TemporaryType } from "@/lib/social-media/context/classification-policy";

export type ClassificationFixture = {
  id: string;
  split: "dev" | "holdout";
  note: string;
  expectedCategories: ContextCategory[];
  expectedTemporaryType: TemporaryType | null;
  expectedDisposition: "plan" | "no_change" | "needs_review";
};

export const classificationFixtures: ClassificationFixture[] = [
  { id: "D01", split: "dev", note: "My name should appear as Jordan Lee, not Jordyn Lee.", expectedCategories: ["identity"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "D02", split: "dev", note: "Keep the captions warm and conversational, and use emojis sparingly.", expectedCategories: ["preference"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "D03", split: "dev", note: "Work in a seller tip about once every four posts.", expectedCategories: ["frequency"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "D04", split: "dev", note: "Make the next two posts about my open house.", expectedCategories: ["temporary"], expectedTemporaryType: "counter", expectedDisposition: "plan" },
  { id: "D05", split: "dev", note: "From December 1 through December 31, add a little holiday humor.", expectedCategories: ["temporary"], expectedTemporaryType: "date_range", expectedDisposition: "plan" },
  { id: "D06", split: "dev", note: "I joined Sonoran Peak Realty, and please make the writing less formal.", expectedCategories: ["identity", "preference"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "D07", split: "dev", note: "For the next three posts focus on downsizing, then keep sharing a downsizing tip occasionally.", expectedCategories: ["frequency", "temporary"], expectedTemporaryType: "counter", expectedDisposition: "plan" },
  { id: "D08", split: "dev", note: "Just testing the notes box—keep doing what you're doing.", expectedCategories: [], expectedTemporaryType: null, expectedDisposition: "no_change" },
  { id: "D09", split: "dev", note: "Make the posts feel more like me.", expectedCategories: ["preference"], expectedTemporaryType: null, expectedDisposition: "needs_review" },
  { id: "D10", split: "dev", note: "Forget what I said about bright colors.", expectedCategories: ["preference"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "D11", split: "dev", note: "I no longer work at Desert & Pine; my brokerage is North Mesa Realty.", expectedCategories: ["identity"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "D12", split: "dev", note: "The next post should announce the price reduction at 18 Oak Lane.", expectedCategories: ["temporary"], expectedTemporaryType: "counter", expectedDisposition: "plan" },
  { id: "D13", split: "dev", note: "Use a playful tone from June 10 until June 17.", expectedCategories: ["temporary"], expectedTemporaryType: "date_range", expectedDisposition: "plan" },
  { id: "D14", split: "dev", note: "For a while, focus on my new listing.", expectedCategories: ["temporary"], expectedTemporaryType: "unclear", expectedDisposition: "needs_review" },
  { id: "D15", split: "dev", note: "Use fewer emojis, and include a local market-stat post monthly.", expectedCategories: ["preference", "frequency"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "D16", split: "dev", note: "My primary brand color is now #234E52.", expectedCategories: ["identity"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "D17", split: "dev", note: "Stop doing the recurring lender spotlight.", expectedCategories: ["frequency"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "D18", split: "dev", note: "I now serve Tempe, make the voice more upbeat, mention relocation quarterly, and use the next two posts for our food drive.", expectedCategories: ["identity", "preference", "frequency", "temporary"], expectedTemporaryType: "counter", expectedDisposition: "plan" },
  { id: "H01", split: "holdout", note: "Add Chandler to the markets I serve.", expectedCategories: ["identity"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "H02", split: "holdout", note: "Don't use cursive lettering in graphics anymore.", expectedCategories: ["preference"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "H03", split: "holdout", note: "I'd like neighborhood spotlights now and then, but not in every post.", expectedCategories: ["frequency"], expectedTemporaryType: null, expectedDisposition: "plan" },
  { id: "H04", split: "holdout", note: "Use my new headshot theme for the next 4 posts.", expectedCategories: ["temporary"], expectedTemporaryType: "counter", expectedDisposition: "plan" },
  { id: "H05", split: "holdout", note: "Until the end of next week, mention that buyers can tour the model home.", expectedCategories: ["temporary"], expectedTemporaryType: "date_range", expectedDisposition: "plan" },
  { id: "H06", split: "holdout", note: "My title is Associate Broker, and for Friday only keep the tone celebratory.", expectedCategories: ["identity", "temporary"], expectedTemporaryType: "date_range", expectedDisposition: "plan" },
  { id: "H07", split: "holdout", note: "Undo that last change.", expectedCategories: [], expectedTemporaryType: null, expectedDisposition: "needs_review" },
  { id: "H08", split: "holdout", note: "Thanks, everything looks good as-is.", expectedCategories: [], expectedTemporaryType: null, expectedDisposition: "no_change" },
];

export const developmentClassificationFixtures = classificationFixtures.filter((fixture) => fixture.split === "dev");
export const holdoutClassificationFixtures = classificationFixtures.filter((fixture) => fixture.split === "holdout");
