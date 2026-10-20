import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaGatedCommunitiesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  noteKicker: z.string(),
  lead: z.string(),
  body: z.string(),
  searchPlaceholder: z.string(),
});

export type AureliaGatedCommunitiesContent = z.infer<
  typeof AureliaGatedCommunitiesContentSchema
>;

export const aureliaGatedCommunitiesDefaultContent: AureliaGatedCommunitiesContent = {
  heroEyebrow: "Privacy-first search",
  heroTitle: "Gated Communities",
  heroSubtitle:
    "A focused search experience for buyers prioritizing controlled access, separation and security.",
  heroImage: images.home2,
  noteKicker: "A specialized market",
  lead: "At the top of the market, privacy is often a property characteristic of its own.",
  body: "This page is designed for buyers who want controlled access, separation and a quieter relationship with the street—without sacrificing architecture or location.",
  searchPlaceholder: "Search gated communities or addresses",
};
