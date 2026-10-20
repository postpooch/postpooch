import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaPressContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  title: z.string(),
});

export type AureliaPressContent = z.infer<typeof AureliaPressContentSchema>;

export const aureliaPressDefaultContent: AureliaPressContent = {
  heroEyebrow: "Selected coverage",
  heroTitle: "Press & Media",
  heroSubtitle: "A record of market commentary, design features and notable representation.",
  heroImage: images.city,
  kicker: "In the press",
  title: "Recognition across property, business and design.",
};
