import { z } from "zod";

export const LuxuryMarketingContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  introEyebrow: z.string(),
  introTitle: z.string(),
  introParagraphs: z.array(z.string()),
  networkEyebrow: z.string(),
  networkTitle: z.string(),
  networkImage: z.string(),
  networkParagraphs: z.array(z.string()),
  campaignEyebrow: z.string(),
  campaignTitle: z.string(),
  pillars: z.array(z.object({ title: z.string(), text: z.string() })),
  resultsEyebrow: z.string(),
  resultsTitle: z.string(),
  resultsText: z.string(),
  salesEyebrow: z.string(),
  salesTitle: z.string(),
});

export type LuxuryMarketingContent = z.infer<typeof LuxuryMarketingContentSchema>;

export const luxuryMarketingDefaultContent: LuxuryMarketingContent = {
  heroEyebrow: "SELLING DISTINCTIVE HOMES",
  heroTitle: "Bespoke Marketing",
  heroSubtitle:
    "Every property deserves a strategy as considered as the home itself.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/ed/edffb9523364b34a89ae0e190657df9516f364b8849506c47dcf82f7c737e903.avif",
  introEyebrow: "A SINGULAR APPROACH",
  introTitle: "The story, presentation, and audience must work together.",
  introParagraphs: [
    "Your home is more than an address. The way it is introduced should reveal its architecture, lifestyle, and value with precision.",
    "Use this page to explain the realtor’s complete listing system, brokerage reach, private relationships, and property-specific creative process.",
  ],
  networkEyebrow: "THE NETWORK",
  networkTitle: "Local intelligence. Meaningful global reach.",
  networkImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/13/13b4faac0c8bd49f221b1022571ab60297780e85fe48c8bc454edb68e90390bd.avif",
  networkParagraphs: [
    "Describe referral networks, brokerage relationships, relocation reach, and the direct connections that help expose a property to the right people.",
    "Avoid vague claims. Replace this text with concrete distribution advantages available to the individual realtor.",
  ],
  campaignEyebrow: "THE CAMPAIGN",
  campaignTitle: "A complete property marketing system.",
  pillars: [
    {
      title: "Positioning",
      text: "Define the property’s most compelling story, ideal buyer, competitive context, and launch strategy.",
    },
    {
      title: "Creative Direction",
      text: "Commission photography, film, copy, print, and digital design with one coherent visual point of view.",
    },
    {
      title: "Private Network",
      text: "Introduce the property directly to qualified buyers, trusted advisors, and leading agents.",
    },
    {
      title: "Global Distribution",
      text: "Coordinate editorial, social, digital advertising, brokerage channels, and targeted outreach.",
    },
    {
      title: "Launch & Events",
      text: "Create considered broker previews, private appointments, and events appropriate to the property.",
    },
    {
      title: "Reporting",
      text: "Provide clear feedback, campaign metrics, market changes, and recommendations throughout the listing.",
    },
  ],
  resultsEyebrow: "RESULTS",
  resultsTitle: "Representation should be felt in the outcome.",
  resultsText: "Replace with verified metrics specific to this realtor.",
  salesEyebrow: "NOTABLE SALES",
  salesTitle: "A selection of successful representation.",
};
