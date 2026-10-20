import { z } from "zod";

import { images } from "../../catalog-defaults";

export const ReyPropertiesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  deck: z.string(),
});

export type ReyPropertiesContent = z.infer<typeof ReyPropertiesContentSchema>;

export const reyPropertiesDefaultContent: ReyPropertiesContent = {
  heroEyebrow: "Exclusive portfolio",
  heroTitle: "Homes of consequence.",
  heroImage: images.glassPool,
  eyebrow: "Current residences",
  titleLine1: "Curated for",
  titleEmphasis: "the exceptional.",
  deck: "Architectural estates, oceanfront retreats, and private residences represented with exacting presentation and thoughtful strategy.",
};
