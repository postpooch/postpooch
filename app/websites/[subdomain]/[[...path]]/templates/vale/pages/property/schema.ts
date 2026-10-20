import { z } from "zod";

export const ValePropertyContentSchema = z.object({
  summaryEyebrow: z.string(),
  inquiryEyebrow: z.string(),
  inquiryTitlePrefix: z.string(),
  inquiryBody: z.string(),
  nextLabel: z.string(),
});

export type ValePropertyContent = z.infer<typeof ValePropertyContentSchema>;

export const valePropertyDefaultContent: ValePropertyContent = {
  summaryEyebrow: "The property",
  inquiryEyebrow: "Private showing",
  inquiryTitlePrefix: "Interested in",
  inquiryBody:
    "Share a few details and I’ll follow up to coordinate a private conversation or tour.",
  nextLabel: "Next property",
};
