import { z } from "zod";

export const LuxurySalesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  sectionEyebrow: z.string(),
  sectionTitle: z.string(),
  sectionText: z.string(),
});

export type LuxurySalesContent = z.infer<typeof LuxurySalesContentSchema>;

export const luxurySalesDefaultContent: LuxurySalesContent = {
  heroEyebrow: "SELECTED REPRESENTATION",
  heroTitle: "Notable Recent Sales",
  heroSubtitle:
    "A record of distinctive homes, thoughtful strategy, and successful outcomes.",
  sectionEyebrow: "SOLD",
  sectionTitle: "Past representation.",
  sectionText:
    "For privacy, sale prices and addresses can be hidden per property.",
};
