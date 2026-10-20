import { z } from "zod";

export const NorthpinePropertyContentSchema = z.object({
  aboutEyebrow: z.string(),
  aboutTitle: z.string(),
  aboutExtraOne: z.string(),
  aboutExtraTwo: z.string(),
  highlightsHeading: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  priceLabel: z.string(),
  bedsLabel: z.string(),
  bathsLabel: z.string(),
  areaLabel: z.string(),
});

export type NorthpinePropertyContent = z.infer<typeof NorthpinePropertyContentSchema>;

export const northpinePropertyDefaultContent: NorthpinePropertyContent = {
  aboutEyebrow: "ABOUT THIS PROPERTY",
  aboutTitle: "Mountain architecture with an easy sense of arrival.",
  aboutExtraOne:
    "Natural stone, warm wood and expansive glass frame the setting without competing with it. The main living spaces are organized for everyday comfort and weekends with guests, while covered outdoor rooms extend the home into the landscape.",
  aboutExtraTwo:
    "A chef's kitchen anchors the great room, the primary suite is designed as a quiet retreat, and flexible lower-level space gives owners room for guests, media or recreation.",
  highlightsHeading: "Property highlights",
  ctaLabel: "Schedule a Showing",
  ctaHref: "/contact",
  priceLabel: "LIST PRICE",
  bedsLabel: "BEDROOMS",
  bathsLabel: "BATHROOMS",
  areaLabel: "SQ FT",
};
