import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaCommunityContentSchema = z.object({
  heroEyebrow: z.string(),
  glanceKicker: z.string(),
  livingKickerPrefix: z.string(),
  livingTitle: z.string(),
  livingBodyPrefix: z.string(),
  livingBodySuffix: z.string(),
  livingImage: z.string(),
  homesKickerSuffix: z.string(),
  homesTitle: z.string(),
});

export type AureliaCommunityContent = z.infer<typeof AureliaCommunityContentSchema>;

export const aureliaCommunityDefaultContent: AureliaCommunityContent = {
  heroEyebrow: "Neighborhood guide",
  glanceKicker: "At a glance",
  livingKickerPrefix: "Living in",
  livingTitle: "The details shape the experience.",
  livingBodyPrefix: "Each micro-market has its own cadence. These are a few of the characteristics buyers tend to weigh most heavily when considering",
  livingBodySuffix: ".",
  livingImage: images.interior1,
  homesKickerSuffix: "In and around",
  homesTitle: "Selected homes",
};
