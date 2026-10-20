import { z } from "zod";

export const VossNeighborhoodsContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  intro: z.string(),
  askPrefix: z.string(),
});

export type VossNeighborhoodsContent = z.infer<
  typeof VossNeighborhoodsContentSchema
>;

export const vossNeighborhoodsDefaultContent: VossNeighborhoodsContent = {
  eyebrow: "Mara's New York",
  titleLine1: "Know the building.",
  titleEmphasis: "Know the block.",
  intro:
    "The city is a collection of micro-markets. These are the places where years of showings, closings, dinners and long walks become useful intelligence.",
  askPrefix: "Ask about",
};
