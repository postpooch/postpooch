import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalSoldContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
});

export type CoastalSoldContent = z.infer<typeof CoastalSoldContentSchema>;

export const coastalSoldDefaultContent: CoastalSoldContent = {
  heroEyebrow: "Track Record",
  heroTitle: "Selected Sales",
  heroImage: images.lido,
};
