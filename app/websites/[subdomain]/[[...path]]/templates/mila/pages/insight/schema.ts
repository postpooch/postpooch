import { z } from "zod";

export const MilaInsightContentSchema = z.object({
  tocLabel: z.string(),
  ctaTitle: z.string(),
  ctaBody: z.string(),
  ctaLabel: z.string(),
});

export type MilaInsightContent = z.infer<typeof MilaInsightContentSchema>;

export const milaInsightDefaultContent: MilaInsightContent = {
  tocLabel: "In this article",
  ctaTitle: "Want to apply this to your own situation?",
  ctaBody:
    "A short introduction often brings more clarity than reading another ten articles.",
  ctaLabel: "Discuss your plans",
};
