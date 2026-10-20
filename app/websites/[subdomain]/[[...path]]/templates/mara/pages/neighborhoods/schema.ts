import { z } from "zod";

export const MaraNeighborhoodsContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  intro: z.string(),
});

export type MaraNeighborhoodsContent = z.infer<
  typeof MaraNeighborhoodsContentSchema
>;

export const maraNeighborhoodsDefaultContent: MaraNeighborhoodsContent = {
  eyebrow: "Toronto neighbourhood guide",
  titleLine1: "The city,",
  titleEmphasis: "block by block.",
  intro:
    "Where you live shapes the life around the home. These are a few central Toronto neighbourhoods I watch especially closely.",
};
