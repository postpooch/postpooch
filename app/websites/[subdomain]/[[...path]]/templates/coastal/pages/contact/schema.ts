import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalContactContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  heading: z.string(),
  body: z.string(),
});

export type CoastalContactContent = z.infer<typeof CoastalContactContentSchema>;

export const coastalContactDefaultContent: CoastalContactContent = {
  heroEyebrow: "Get In Touch",
  heroTitle: "Connect With Alexandra",
  heroImage: images.media,
  kicker: "Private Consultation",
  heading: "Tell us what you are considering.",
  body: "Whether you are preparing to sell, beginning a search, or simply want a better understanding of the market, we can start with a focused conversation.",
};
