import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AveryTestimonialsContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSub: z.string(),
  heroImage: z.string(),
});

export type AveryTestimonialsContent = z.infer<typeof AveryTestimonialsContentSchema>;

export const averyTestimonialsDefaultContent: AveryTestimonialsContent = {
  heroKicker: "Client notes",
  heroTitle: "Kind words",
  heroSub: "The best measure of the work is whether clients want to do it together again.",
  heroImage: images.city1,
};
