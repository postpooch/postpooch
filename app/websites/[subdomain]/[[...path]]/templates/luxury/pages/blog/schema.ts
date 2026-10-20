import { z } from "zod";

export const LuxuryBlogContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  sectionEyebrow: z.string(),
  sectionTitle: z.string(),
});

export type LuxuryBlogContent = z.infer<typeof LuxuryBlogContentSchema>;

export const luxuryBlogDefaultContent: LuxuryBlogContent = {
  heroEyebrow: "THE JOURNAL",
  heroTitle: "Market, Design & Place",
  heroSubtitle: "Useful perspective for thoughtful real estate decisions.",
  sectionEyebrow: "LATEST",
  sectionTitle: "Recent stories.",
};
