import { z } from "zod";

export const CoastalJournalPostContentSchema = z.object({
  ctaLabel: z.string(),
  defaultBody: z.array(z.string()).min(1),
});

export type CoastalJournalPostContent = z.infer<typeof CoastalJournalPostContentSchema>;

export const coastalJournalPostDefaultContent: CoastalJournalPostContent = {
  ctaLabel: "Start a Conversation",
  defaultBody: [
    "In the upper end of the market, presentation and strategy are inseparable. Buyers form a point of view quickly, but they validate that instinct with details: condition, setting, architecture, privacy, and how confidently a property has been brought to market.",
    "## Start with the position, not the promotion.",
    "Before any campaign begins, define the audience, likely objections, strongest emotional moments, and the facts that support value.",
    "> The most polished marketing is effective because it is specific, not because it is loud.",
  ],
};
