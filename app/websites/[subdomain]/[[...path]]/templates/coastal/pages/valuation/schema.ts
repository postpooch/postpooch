import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalValuationContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroBody: z.string(),
  heroImage: z.string(),
  continueLabel: z.string(),
  submitLabel: z.string(),
});

export type CoastalValuationContent = z.infer<typeof CoastalValuationContentSchema>;

export const coastalValuationDefaultContent: CoastalValuationContent = {
  heroEyebrow: "For Homeowners",
  heroTitle: "Private Home Valuation",
  heroBody: "A discreet first look at your home’s current market position.",
  heroImage: images.hero3,
  continueLabel: "Continue →",
  submitLabel: "Request Valuation →",
};
