import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaSoldContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  title: z.string(),
  note: z.string(),
});

export type AureliaSoldContent = z.infer<typeof AureliaSoldContentSchema>;

export const aureliaSoldDefaultContent: AureliaSoldContent = {
  heroEyebrow: "Selected transactions",
  heroTitle: "Sold Portfolio",
  heroSubtitle:
    "A record of representation across architecturally significant and highly private residences.",
  heroImage: images.interior1,
  kicker: "Past representation",
  title: "Results, quietly earned.",
  note: "A selected record of representation across architecturally significant and highly private residences.",
};
