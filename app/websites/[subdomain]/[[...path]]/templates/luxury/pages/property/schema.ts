import { z } from "zod";

export const LuxuryPropertyContentSchema = z.object({
  overviewEyebrow: z.string(),
  overviewTitle: z.string(),
  overviewExtra: z.string(),
  inquiryEyebrow: z.string(),
  inquiryTitle: z.string(),
  relatedTitle: z.string(),
});

export type LuxuryPropertyContent = z.infer<typeof LuxuryPropertyContentSchema>;

export const luxuryPropertyDefaultContent: LuxuryPropertyContent = {
  overviewEyebrow: "THE RESIDENCE",
  overviewTitle: "A singular property, privately presented.",
  overviewExtra:
    "Add the complete property description here. This route is generated from one reusable page, so every listing can include its own gallery, specifications, narrative, status, price visibility, and contact information.",
  inquiryEyebrow: "PRIVATE APPOINTMENTS",
  inquiryTitle: "Request more information.",
  relatedTitle: "You may also like",
};
