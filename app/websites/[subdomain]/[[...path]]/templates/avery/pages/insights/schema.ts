import { z } from "zod";

export const AveryInsightsContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSub: z.string(),
});

export type AveryInsightsContent = z.infer<typeof AveryInsightsContentSchema>;

export const averyInsightsDefaultContent: AveryInsightsContent = {
  heroKicker: "Journal",
  heroTitle: "Real estate insights",
  heroSub:
    "Practical perspective on buying, selling, design, negotiation, and the particular logic of New York real estate.",
};
