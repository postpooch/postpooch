import { z } from "zod";

export const SloanePropertyContentSchema = z.object({
  disclaimer: z.string(),
  locationEyebrow: z.string(),
  showingEyebrow: z.string(),
  showingTitle: z.string(),
  showingBody: z.string(),
});

export type SloanePropertyContent = z.infer<typeof SloanePropertyContentSchema>;

export const sloanePropertyDefaultContent: SloanePropertyContent = {
  disclaimer:
    "Property details in this demonstration are fictional and are included to show how a luxury listing template can present narrative, specifications, photography, and lead capture in one cohesive experience.",
  locationEyebrow: "Property location",
  showingEyebrow: "Private showing",
  showingTitle: "Request more information.",
  showingBody:
    "For access, disclosures, or a private appointment, send a note and the team will follow up directly.",
};
