import { z } from "zod";

export const AtelierPropertiesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  filters: z.array(z.string()),
});

export type AtelierPropertiesContent = z.infer<typeof AtelierPropertiesContentSchema>;

export const atelierPropertiesDefaultContent: AtelierPropertiesContent = {
  heroEyebrow: "Exclusive collection",
  heroTitle: "Properties",
  heroSubtitle:
    "A curated portfolio of distinctive residences, private offerings, and select land opportunities.",
  filters: ["All", "For sale", "Private", "Coming soon"],
};
