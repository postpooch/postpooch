import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaTestimonialsContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  title: z.string(),
});

export type AureliaTestimonialsContent = z.infer<typeof AureliaTestimonialsContentSchema>;

export const aureliaTestimonialsDefaultContent: AureliaTestimonialsContent = {
  heroEyebrow: "Client perspective",
  heroTitle: "Trust is the real record.",
  heroSubtitle: "Selected client notes on representation, discretion and process.",
  heroImage: images.interior2,
  kicker: "Client notes",
  title: "What thoughtful representation feels like.",
};
