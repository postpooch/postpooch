import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaPropertiesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  title: z.string(),
  note: z.string(),
  searchPlaceholder: z.string(),
});

export type AureliaPropertiesContent = z.infer<typeof AureliaPropertiesContentSchema>;

export const aureliaPropertiesDefaultContent: AureliaPropertiesContent = {
  heroEyebrow: "Private portfolio",
  heroTitle: "Exclusive Listings",
  heroSubtitle: "A curated collection of significant residences across Los Angeles.",
  heroImage: images.home2,
  kicker: "Properties for sale",
  title: "A considered collection.",
  note: "Explore publicly presented opportunities. Additional private and pre-market inventory is available by conversation.",
  searchPlaceholder: "Search by neighborhood or address",
};
