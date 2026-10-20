import { z } from "zod";

export const HarborListingContentSchema = z.object({
  introTitleBefore: z.string(),
  introTitleItalic: z.string(),
  introExtra: z.string(),
  askCta: z.string(),
  galleryAlts: z.tuple([z.string(), z.string(), z.string()]),
  defaultGallery: z.tuple([z.string(), z.string(), z.string()]),
  factPropertyTypeLabel: z.string(),
  factPropertyTypeValue: z.string(),
  factBedsLabel: z.string(),
  factBathsLabel: z.string(),
  factNeighbourhoodLabel: z.string(),
});

export type HarborListingContent = z.infer<typeof HarborListingContentSchema>;

export const harborListingDefaultContent: HarborListingContent = {
  introTitleBefore: "A home with",
  introTitleItalic: "presence.",
  introExtra:
    "This is a concept listing detail page. In a production build, connect this route to the agent’s MLS/IDX provider or CMS and replace all placeholder property facts with verified listing data.",
  askCta: "Ask about this property ↗",
  galleryAlts: ["Modern kitchen", "Living room", "Contemporary interior"],
  defaultGallery: [
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/0c/0c94d4e2744294224816a39501831115130bdec07460e4717f1bc1fa70f9850e.avif",
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/58/58f61e55d0bb60c6e6c57ea2ad29ae695fb88f2f571119f3e7765da9eba5e569.avif",
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/5b/5b322cd2dc3ac44bcf6e09ea144e43ed4a6510ef01f0874bbaa1f9ec384a2091.avif",
  ],
  factPropertyTypeLabel: "Property type",
  factPropertyTypeValue: "Detached / Condo",
  factBedsLabel: "Bedrooms",
  factBathsLabel: "Bathrooms",
  factNeighbourhoodLabel: "Neighbourhood",
};
