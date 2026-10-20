import { z } from "zod";

export const LuxuryNeighborhoodsContentSchema = z.object({
  heroEyebrow: z.string(),
  heroSubtitle: z.string(),
  sectionEyebrow: z.string(),
  sectionTitle: z.string(),
});

export type LuxuryNeighborhoodsContent = z.infer<
  typeof LuxuryNeighborhoodsContentSchema
>;

export const luxuryNeighborhoodsDefaultContent: LuxuryNeighborhoodsContent = {
  heroEyebrow: "EXPLORE THE AREA",
  heroSubtitle:
    "A guide to the neighborhoods, lifestyles, and property details that shape the market.",
  sectionEyebrow: "FIND YOUR PLACE",
  sectionTitle: "Every neighborhood has its own rhythm.",
};
