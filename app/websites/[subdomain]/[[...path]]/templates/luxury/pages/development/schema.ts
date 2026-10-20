import { z } from "zod";

export const LuxuryDevelopmentContentSchema = z.object({
  visionEyebrow: z.string(),
  inquiryEyebrow: z.string(),
  inquiryTitle: z.string(),
  inquiryText: z.string(),
});

export type LuxuryDevelopmentContent = z.infer<
  typeof LuxuryDevelopmentContentSchema
>;

export const luxuryDevelopmentDefaultContent: LuxuryDevelopmentContent = {
  visionEyebrow: "THE VISION",
  inquiryEyebrow: "PRIVATE INFORMATION",
  inquiryTitle: "Request availability and details.",
  inquiryText:
    "Development inventory, pricing, and timelines can change. Connect this form to the assigned sales workflow.",
};
