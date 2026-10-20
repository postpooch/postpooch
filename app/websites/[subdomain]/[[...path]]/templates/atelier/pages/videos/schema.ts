import { z } from "zod";

export const AtelierVideosContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
});

export type AtelierVideosContent = z.infer<typeof AtelierVideosContentSchema>;

export const atelierVideosDefaultContent: AtelierVideosContent = {
  heroEyebrow: "Films",
  heroTitle: "Property, place, and perspective—in motion.",
  heroSubtitle: "Short films and tours from across Austin.",
};
