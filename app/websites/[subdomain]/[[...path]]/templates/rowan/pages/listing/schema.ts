import { z } from "zod";

import { IMG } from "../../catalog-defaults";

export const RowanListingContentSchema = z.object({
  overviewEyebrow: z.string(),
  galleryInteriorImage: z.string(),
  galleryLandscapeImage: z.string(),
  detailEyebrow: z.string(),
  detailTitle: z.string(),
  detailBody: z.array(z.string()).min(1),
  inquiryEyebrow: z.string(),
  inquiryTitlePrefix: z.string(),
  inquiryIntro: z.string(),
  nextEyebrow: z.string(),
});

export type RowanListingContent = z.infer<typeof RowanListingContentSchema>;

export const rowanListingDefaultContent: RowanListingContent = {
  overviewEyebrow: "Property overview",
  galleryInteriorImage: IMG.interior,
  galleryLandscapeImage: IMG.landscape,
  detailEyebrow: "The residence",
  detailTitle: "Designed for the setting, not dropped onto it.",
  detailBody: [
    "This demo listing is intentionally fictional. It shows how a production property page can carry the same editorial confidence as the rest of the site while leaving room for MLS data, disclosures, maps, virtual tours and brokerage-required information.",
    "Replace the fields and imagery with the real feed or listing data source. The layout is designed so the photography remains dominant while the decision-making details stay easy to scan.",
  ],
  inquiryEyebrow: "Private showing",
  inquiryTitlePrefix: "See",
  inquiryIntro:
    "Tell me your preferred timing and I’ll follow up with showing options and any property-specific information you need.",
  nextEyebrow: "Next residence",
};
