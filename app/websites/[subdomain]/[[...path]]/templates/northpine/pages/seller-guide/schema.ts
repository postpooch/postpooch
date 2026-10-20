import { z } from "zod";

export const NorthpineGuideContentSchema = z.object({
  calloutTitle: z.string(),
  calloutBody: z.string(),
  calloutLabel: z.string(),
  calloutHref: z.string(),
});

export type NorthpineGuideContent = z.infer<typeof NorthpineGuideContentSchema>;

export const northpineSellerGuideDefaultContent: NorthpineGuideContent = {
  calloutTitle: "Want a plan built around your timeline?",
  calloutBody:
    "We'll help you turn the guide into a clear next-step checklist for your specific situation.",
  calloutLabel: "Talk With Avery",
  calloutHref: "/contact",
};

export const northpineBuyerGuideDefaultContent: NorthpineGuideContent = {
  ...northpineSellerGuideDefaultContent,
};

export const northpineFinanceGuideDefaultContent: NorthpineGuideContent = {
  ...northpineSellerGuideDefaultContent,
};
