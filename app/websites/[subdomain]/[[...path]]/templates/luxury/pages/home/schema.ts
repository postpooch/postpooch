import { z } from "zod";

export const LuxuryHomeContentSchema = z.object({
  introEyebrow: z.string(),
  introTitle: z.string(),
  resultsEyebrow: z.string(),
  resultsTitle: z.string(),
  resultsText: z.string(),
  inventoryEyebrow: z.string(),
  inventoryText: z.string(),
  communitiesEyebrow: z.string(),
  communitiesTitle: z.string(),
  communitiesText: z.string(),
  journalEyebrow: z.string(),
  journalTitle: z.string(),
  newsletterEyebrow: z.string(),
});

export type LuxuryHomeContent = z.infer<typeof LuxuryHomeContentSchema>;

export const luxuryHomeDefaultContent: LuxuryHomeContent = {
  introEyebrow: "PROVEN REPRESENTATION",
  introTitle: "Real estate is personal.\nThe experience should be exceptional.",
  resultsEyebrow: "PROVEN RESULTS",
  resultsTitle: "Experience measured in trust and outcomes.",
  resultsText: "Replace these values with verified achievements for each realtor.",
  inventoryEyebrow: "CURRENT INVENTORY",
  inventoryText: "Featured listings can come from your database, MLS integration, or a static content file.",
  communitiesEyebrow: "EXPLORE COMMUNITIES",
  communitiesTitle: "Find the setting that feels like home.",
  communitiesText: "Every community page uses the same reusable structure and its own data.",
  journalEyebrow: "THE JOURNAL",
  journalTitle: "Perspective for buyers, sellers, and design-minded homeowners.",
  newsletterEyebrow: "BE THE FIRST TO KNOW",
};
