import { z } from "zod";

export const MilaPropertyContentSchema = z.object({
  priceLabel: z.string(),
  ctaLabel: z.string(),
  aboutEyebrow: z.string(),
  featuresHeading: z.string(),
  interestLabel: z.string(),
  interestTitle: z.string(),
  relatedEyebrow: z.string(),
  relatedTitle: z.string(),
  relatedCta: z.string(),
});

export type MilaPropertyContent = z.infer<typeof MilaPropertyContentSchema>;

export const milaPropertyDefaultContent: MilaPropertyContent = {
  priceLabel: "Asking price",
  ctaLabel: "Schedule a viewing",
  aboutEyebrow: "About this home",
  featuresHeading: "What stands out",
  interestLabel: "Interested?",
  interestTitle: "Mila is happy to tell you more.",
  relatedEyebrow: "You might also like",
  relatedTitle: "More nearby.",
  relatedCta: "View all",
};
