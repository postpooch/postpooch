import { z } from "zod";

export const MilaInsightsContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  lead: z.string(),
  cardCta: z.string(),
});

export type MilaInsightsContent = z.infer<typeof MilaInsightsContentSchema>;

export const milaInsightsDefaultContent: MilaInsightsContent = {
  eyebrow: "Journal",
  titleLine1: "Market insight,",
  titleEmphasis: "without the jargon.",
  lead: "Practical guidance on buying, selling, value, and strategy — written to help you decide smarter, not drown you in information.",
  cardCta: "Read article",
};
