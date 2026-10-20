import { z } from "zod";

export const MilaDienstContentSchema = z.object({
  ctaLabel: z.string(),
  callPrefix: z.string(),
  processEyebrow: z.string(),
  processTitle: z.string(),
  processIntro: z.string(),
  quoteEyebrow: z.string(),
  quoteTitle: z.string(),
  quoteBody: z.string(),
  quoteCtaLabel: z.string(),
  quoteCtaHref: z.string(),
});

export type MilaDienstContent = z.infer<typeof MilaDienstContentSchema>;

export const milaDienstDefaultContent: MilaDienstContent = {
  ctaLabel: "Discuss your plans",
  callPrefix: "Or call",
  processEyebrow: "The approach",
  processTitle: "Personally arranged, step by step.",
  processIntro:
    "No standard package you have to figure out yourself. You know in advance what happens, why we do it, and when I need something from you.",
  quoteEyebrow: "Small office, short line",
  quoteTitle: "You always deal directly with Mila.",
  quoteBody:
    "That means no handoffs between departments and no story you have to tell three times. From first advice to the notary, I stay involved.",
  quoteCtaLabel: "More about Mila",
  quoteCtaHref: "/over-mila",
};
