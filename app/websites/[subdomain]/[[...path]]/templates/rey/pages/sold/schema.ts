import { z } from "zod";

import { images } from "../../catalog-defaults";

export const ReySoldContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  soldLabel: z.string(),
  factsLine: z.string(),
});

export type ReySoldContent = z.infer<typeof ReySoldContentSchema>;

export const reySoldDefaultContent: ReySoldContent = {
  heroEyebrow: "Selected sales",
  heroTitle: "A record written in remarkable homes.",
  heroImage: images.livingRoom,
  soldLabel: "Sold",
  factsLine: "Private transaction / Southern California",
};
