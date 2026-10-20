import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaCommunitiesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  title: z.string(),
  note: z.string(),
});

export type AureliaCommunitiesContent = z.infer<typeof AureliaCommunitiesContentSchema>;

export const aureliaCommunitiesDefaultContent: AureliaCommunitiesContent = {
  heroEyebrow: "Los Angeles",
  heroTitle: "Communities",
  heroSubtitle:
    "Explore the character, architecture and market dynamics of the neighborhoods we know best.",
  heroImage: images.palms,
  kicker: "Neighborhood intelligence",
  title: "Place matters.",
  note: "Luxury in Los Angeles is hyperlocal. A few blocks can change privacy, views, architecture and value. Start with the places that fit how you want to live.",
};
