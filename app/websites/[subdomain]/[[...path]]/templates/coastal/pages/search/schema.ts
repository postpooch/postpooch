import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalSearchContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  countLabel: z.string(),
  mapLabel: z.string(),
});

export type CoastalSearchContent = z.infer<typeof CoastalSearchContentSchema>;

export const coastalSearchDefaultContent: CoastalSearchContent = {
  heroEyebrow: "Property Search",
  heroTitle: "Find Your Next Home",
  heroImage: images.pelican,
  countLabel: "curated results",
  mapLabel: "Interactive MLS map integration area",
};
