import { z } from "zod";

export const NathanPropertyContentSchema = z.object({
  residenceEyebrow: z.string(),
  showingCtaLabel: z.string(),
  typeEyebrow: z.string(),
  locationEyebrow: z.string(),
  representationEyebrow: z.string(),
  continueEyebrow: z.string(),
  backLabel: z.string(),
  backHref: z.string(),
});

export type NathanPropertyContent = z.infer<typeof NathanPropertyContentSchema>;

export const nathanPropertyDefaultContent: NathanPropertyContent = {
  residenceEyebrow: "THE RESIDENCE",
  showingCtaLabel: "Request a private showing",
  typeEyebrow: "PROPERTY TYPE",
  locationEyebrow: "LOCATION",
  representationEyebrow: "REPRESENTATION",
  continueEyebrow: "CONTINUE EXPLORING",
  backLabel: "Back to all properties",
  backHref: "/properties",
};
