import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalMapContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  listEyebrow: z.string(),
  listTitle: z.string(),
});

export type CoastalMapContent = z.infer<typeof CoastalMapContentSchema>;

export const coastalMapDefaultContent: CoastalMapContent = {
  heroEyebrow: "Area Overview",
  heroTitle: "Coastal Orange County",
  heroImage: images.map,
  listEyebrow: "Southern California",
  listTitle: "Choose a community to explore.",
};
