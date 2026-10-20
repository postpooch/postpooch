import { z } from "zod";

export const AtelierDevelopmentContentSchema = z.object({
  splitEyebrow: z.string(),
  splitTitle: z.string(),
  extraParagraphs: z.array(z.string()),
  ctaLabel: z.string(),
});

export type AtelierDevelopmentContent = z.infer<
  typeof AtelierDevelopmentContentSchema
>;

export const atelierDevelopmentDefaultContent: AtelierDevelopmentContent = {
  splitEyebrow: "The project",
  splitTitle: "Modern living, considered from the ground up.",
  extraParagraphs: [
    "Architecture, landscape, and interiors have been developed as one connected experience. The result is a limited residential offering with a strong sense of privacy, material quality, and place.",
    "Pricing, availability, floor plans, and private previews are available by request.",
  ],
  ctaLabel: "Request information",
};
