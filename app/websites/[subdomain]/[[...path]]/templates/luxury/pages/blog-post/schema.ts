import { z } from "zod";

export const LuxuryBlogPostContentSchema = z.object({
  ctaTitle: z.string(),
  ctaText: z.string(),
  ctaLabel: z.string(),
});

export type LuxuryBlogPostContent = z.infer<typeof LuxuryBlogPostContentSchema>;

export const luxuryBlogPostDefaultContent: LuxuryBlogPostContent = {
  ctaTitle: "Considering a move?",
  ctaText:
    "Start a private conversation about your plans, timing, and the market.",
  ctaLabel: "Let's Connect",
};
