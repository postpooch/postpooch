import { z } from "zod";

export const HarborReviewsContentSchema = z.object({
  heroKicker: z.string(),
  heroTitleBefore: z.string(),
  heroTitleItalic: z.string(),
  heroBody: z.string(),
  softKicker: z.string(),
  softTitleBefore: z.string(),
  softTitleItalic: z.string(),
  softBody: z.string(),
  softCta: z.string(),
});

export type HarborReviewsContent = z.infer<typeof HarborReviewsContentSchema>;

export const harborReviewsDefaultContent: HarborReviewsContent = {
  heroKicker: "Client experiences",
  heroTitleBefore: "Kind words from people who",
  heroTitleItalic: "made a move.",
  heroBody:
    "A sample of placeholder testimonials showing the intended review layout. Replace these with verified client reviews before launch.",
  softKicker: "Ready when you are",
  softTitleBefore: "Tell me what you’re trying",
  softTitleItalic: "to solve.",
  softBody:
    "You don’t need a perfect plan before getting in touch. A first conversation is often where the useful plan starts.",
  softCta: "Start a conversation ↗",
};
