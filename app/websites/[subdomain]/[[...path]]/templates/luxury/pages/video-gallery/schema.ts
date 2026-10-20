import { z } from "zod";

export const LuxuryVideoGalleryContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  sectionEyebrow: z.string(),
  sectionTitle: z.string(),
});

export type LuxuryVideoGalleryContent = z.infer<
  typeof LuxuryVideoGalleryContentSchema
>;

export const luxuryVideoGalleryDefaultContent: LuxuryVideoGalleryContent = {
  heroEyebrow: "FILM & PROPERTY TOURS",
  heroTitle: "Video Gallery",
  heroSubtitle:
    "Architecture, neighborhoods, and market perspective in motion.",
  sectionEyebrow: "WATCH",
  sectionTitle: "Property tours and local perspective.",
};
