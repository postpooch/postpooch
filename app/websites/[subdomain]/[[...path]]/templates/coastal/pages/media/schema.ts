import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalMediaContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  ctaLabel: z.string(),
});

export type CoastalMediaContent = z.infer<typeof CoastalMediaContentSchema>;

export const coastalMediaDefaultContent: CoastalMediaContent = {
  heroEyebrow: "Press & Features",
  heroTitle: "Media",
  heroImage: images.press,
  ctaLabel: "View Feature →",
};
