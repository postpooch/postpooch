import { z } from "zod";

export const VossPropertyContentSchema = z.object({
  residenceEyebrow: z.string(),
  storyTitleLine1: z.string(),
  storyTitleEmphasis: z.string(),
  showingCtaLabel: z.string(),
  showingCtaHref: z.string(),
  detailsEyebrow: z.string(),
  disclaimer: z.string(),
});

export type VossPropertyContent = z.infer<typeof VossPropertyContentSchema>;

export const vossPropertyDefaultContent: VossPropertyContent = {
  residenceEyebrow: "The residence",
  storyTitleLine1: "Designed for the way",
  storyTitleEmphasis: "the city is actually lived.",
  showingCtaLabel: "Request a private showing",
  showingCtaHref: "/contact",
  detailsEyebrow: "Details",
  disclaimer:
    "Property information on this demo is fictional and for design presentation only. Replace all addresses, prices, photography, dimensions, disclosures and brokerage information with verified listing data before launch.",
};
