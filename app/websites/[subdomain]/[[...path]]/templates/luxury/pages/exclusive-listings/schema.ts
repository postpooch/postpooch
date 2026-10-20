import { z } from "zod";

export const LuxuryListingsContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  sectionEyebrow: z.string(),
  sectionTitle: z.string(),
  sectionText: z.string(),
});

export type LuxuryListingsContent = z.infer<typeof LuxuryListingsContentSchema>;

export const luxuryListingsDefaultContent: LuxuryListingsContent = {
  heroEyebrow: "EXCLUSIVE REPRESENTATION",
  heroTitle: "Current Properties",
  sectionEyebrow: "FOR SALE & PRIVATE",
  sectionTitle: "Explore the collection.",
  sectionText:
    "Replace this sample array with listings from your own database or MLS feed.",
};
