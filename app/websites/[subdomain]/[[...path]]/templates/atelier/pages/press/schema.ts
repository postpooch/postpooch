import { z } from "zod";

export const AtelierPressContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type AtelierPressContent = z.infer<typeof AtelierPressContentSchema>;

export const atelierPressDefaultContent: AtelierPressContent = {
  heroEyebrow: "Press & recognition",
  heroTitle: "A point of view that travels.",
  heroSubtitle:
    "Selected editorial features, market commentary, and recognition across design and real estate.",
  heroImage:
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=2200&q=88",
};
