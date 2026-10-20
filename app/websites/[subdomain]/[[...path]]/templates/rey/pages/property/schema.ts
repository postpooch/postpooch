import { z } from "zod";

export const ReyPropertyContentSchema = z.object({
  statusPrefix: z.string(),
  bedsLabel: z.string(),
  bathsLabel: z.string(),
  interiorLabel: z.string(),
  lotLabel: z.string(),
  copyEyebrow: z.string(),
  copyTitle: z.string(),
  showingCtaLabel: z.string(),
  showingCtaHref: z.string(),
  inquiryQuote: z.string(),
});

export type ReyPropertyContent = z.infer<typeof ReyPropertyContentSchema>;

export const reyPropertyDefaultContent: ReyPropertyContent = {
  statusPrefix: "For sale",
  bedsLabel: "Bedrooms",
  bathsLabel: "Bathrooms",
  interiorLabel: "Interior sq ft",
  lotLabel: "Lot size",
  copyEyebrow: "The residence",
  copyTitle: "Designed for a life beautifully lived.",
  showingCtaLabel: "Request private showing",
  showingCtaHref: "/contact",
  inquiryQuote:
    "Interested in this property? We can arrange a private showing and provide additional information, disclosures, and market context.",
};
