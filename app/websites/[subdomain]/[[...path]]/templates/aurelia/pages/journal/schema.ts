import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaJournalContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type AureliaJournalContent = z.infer<typeof AureliaJournalContentSchema>;

export const aureliaJournalDefaultContent: AureliaJournalContent = {
  heroEyebrow: "Aurelia Journal",
  heroTitle: "Property, place & perspective",
  heroSubtitle:
    "Original market notes on architecture, neighborhoods, privacy and the decisions that shape luxury real estate.",
  heroImage: images.interior2,
};
