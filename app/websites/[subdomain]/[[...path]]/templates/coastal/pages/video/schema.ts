import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalVideoContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  thumbnails: z.array(z.string()).min(1),
});

export type CoastalVideoContent = z.infer<typeof CoastalVideoContentSchema>;

export const coastalVideoDefaultContent: CoastalVideoContent = {
  heroEyebrow: "Watch",
  heroTitle: "Video",
  heroImage: images.video,
  thumbnails: [images.hero1, images.street, images.hero2, images.lido],
};
