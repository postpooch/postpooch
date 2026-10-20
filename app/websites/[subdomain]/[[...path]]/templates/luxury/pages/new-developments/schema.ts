import { z } from "zod";

export const LuxuryDevelopmentsContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  sectionEyebrow: z.string(),
  sectionTitle: z.string(),
});

export type LuxuryDevelopmentsContent = z.infer<
  typeof LuxuryDevelopmentsContentSchema
>;

export const luxuryDevelopmentsDefaultContent: LuxuryDevelopmentsContent = {
  heroEyebrow: "NEW DEVELOPMENT",
  heroTitle: "Exceptional New Residences",
  heroSubtitle:
    "A selective look at design-led projects and limited residential opportunities.",
  sectionEyebrow: "THE COLLECTION",
  sectionTitle: "New places, thoughtfully made.",
};
