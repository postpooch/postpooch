import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalCommunitiesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  exploreLabel: z.string(),
});

export type CoastalCommunitiesContent = z.infer<typeof CoastalCommunitiesContentSchema>;

export const coastalCommunitiesDefaultContent: CoastalCommunitiesContent = {
  heroEyebrow: "Neighborhood Guide",
  heroTitle: "Featured Communities",
  heroImage: images.beach,
  exploreLabel: "Explore Community →",
};
