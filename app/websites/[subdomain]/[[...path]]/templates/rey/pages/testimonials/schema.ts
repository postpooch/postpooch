import { z } from "zod";

import { images } from "../../catalog-defaults";

export const ReyTestimonialsContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  cardEyebrow: z.string(),
});

export type ReyTestimonialsContent = z.infer<
  typeof ReyTestimonialsContentSchema
>;

export const reyTestimonialsDefaultContent: ReyTestimonialsContent = {
  heroEyebrow: "Client experiences",
  heroTitle: "The work is measured in trust.",
  heroImage: images.testimonials,
  cardEyebrow: "Client note",
};
