import { z } from "zod";

export const AtelierDevelopmentsContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type AtelierDevelopmentsContent = z.infer<
  typeof AtelierDevelopmentsContentSchema
>;

export const atelierDevelopmentsDefaultContent: AtelierDevelopmentsContent = {
  heroEyebrow: "New development",
  heroTitle: "Architecture in progress.",
  heroSubtitle:
    "A focused collection of design-led residences and boutique developments across Austin.",
  heroImage:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=88",
};
