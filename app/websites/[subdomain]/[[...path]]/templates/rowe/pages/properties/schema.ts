import { z } from "zod";

export const RowePropertiesContentSchema = z.object({
  label: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  deck: z.string(),
  offmarketLabel: z.string(),
  offmarketTitle: z.string(),
  offmarketCtaLabel: z.string(),
  offmarketCtaHref: z.string(),
});

export type RowePropertiesContent = z.infer<typeof RowePropertiesContentSchema>;

export const rowePropertiesDefaultContent: RowePropertiesContent = {
  label: "Properties / Selected inventory",
  titleLine1: "Current & private",
  titleEmphasis: "opportunities.",
  deck: "A considered collection of current and private opportunities.",
  offmarketLabel: "Private search",
  offmarketTitle: "Not everything worth seeing is publicly listed.",
  offmarketCtaLabel: "Share your criteria",
  offmarketCtaHref: "/contact",
};
