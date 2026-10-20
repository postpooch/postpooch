import { z } from "zod";

export const NathanNeighborhoodsContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  deck: z.string(),
  countSuffix: z.string(),
  quoteEyebrow: z.string(),
  quoteTitle: z.string(),
  quoteCtaLabel: z.string(),
  quoteCtaHref: z.string(),
});

export type NathanNeighborhoodsContent = z.infer<
  typeof NathanNeighborhoodsContentSchema
>;

export const nathanNeighborhoodsDefaultContent: NathanNeighborhoodsContent = {
  eyebrow: "LOCAL INTELLIGENCE",
  titleLine1: "The city is not",
  titleEmphasis: "one market.",
  deck: "Neighborhood expertise becomes most useful when it gets specific: the block, the building line, the light, the routine, the resale audience.",
  countSuffix: "CURRENT + PRIVATE",
  quoteEyebrow: "HOW WE SEARCH",
  quoteTitle: "Start with how you want to live. Then draw the map.",
  quoteCtaLabel: "Build a private search",
  quoteCtaHref: "/contact",
};
