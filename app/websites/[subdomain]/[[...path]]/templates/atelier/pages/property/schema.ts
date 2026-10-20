import { z } from "zod";

export const AtelierPropertyContentSchema = z.object({
  narrativeEyebrow: z.string(),
  narrativeTitle: z.string(),
  narrativeExtra: z.array(z.string()),
  factsTitle: z.string(),
  factsStyle: z.string(),
  factsType: z.string(),
  tourCta: z.string(),
  relatedEyebrow: z.string(),
  relatedTitle: z.string(),
  galleryLabel: z.string(),
});

export type AtelierPropertyContent = z.infer<typeof AtelierPropertyContentSchema>;

export const atelierPropertyDefaultContent: AtelierPropertyContent = {
  narrativeEyebrow: "The residence",
  narrativeTitle: "A home defined by light, material, and setting.",
  narrativeExtra: [
    "Designed for both quiet daily life and generous entertaining, the residence moves easily between interior rooms, landscaped courtyards, and broad outdoor terraces. The architecture favors proportion and texture over ornament, allowing the surrounding landscape to remain the primary focal point.",
    "Private tours are available by appointment. Detailed specifications, survey materials, and additional disclosures are available to qualified buyers upon request.",
  ],
  factsTitle: "Property details",
  factsStyle: "Warm Modern",
  factsType: "Residential",
  tourCta: "Request a private tour",
  relatedEyebrow: "You may also like",
  relatedTitle: "Similar properties",
  galleryLabel: "View gallery",
};
