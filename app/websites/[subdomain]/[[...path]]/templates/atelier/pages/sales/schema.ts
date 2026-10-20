import { z } from "zod";

export const AtelierSalesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type AtelierSalesContent = z.infer<typeof AtelierSalesContentSchema>;

export const atelierSalesDefaultContent: AtelierSalesContent = {
  heroEyebrow: "Selected representation",
  heroTitle: "Notable sales",
  heroSubtitle:
    "A record of discretion, strategic positioning, and successful outcomes across Austin.",
  heroImage:
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=2200&q=88",
};
