import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalTestimonialsContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
});

export type CoastalTestimonialsContent = z.infer<typeof CoastalTestimonialsContentSchema>;

export const coastalTestimonialsDefaultContent: CoastalTestimonialsContent = {
  heroEyebrow: "Client Perspective",
  heroTitle: "Testimonials",
  heroImage: images.emerald,
};
