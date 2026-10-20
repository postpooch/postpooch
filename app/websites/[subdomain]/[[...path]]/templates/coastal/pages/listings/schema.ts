import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalListingsContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroBody: z.string(),
  heroImage: z.string(),
});

export type CoastalListingsContent = z.infer<typeof CoastalListingsContentSchema>;

export const coastalListingsDefaultContent: CoastalListingsContent = {
  heroEyebrow: "Properties",
  heroTitle: "Active Listings",
  heroBody: "Distinctive residences selected across coastal Orange County.",
  heroImage: images.hero3,
};
