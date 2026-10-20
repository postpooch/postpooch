import { z } from "zod";

const PillarSchema = z.object({
  n: z.string(),
  title: z.string(),
  body: z.string(),
});

export const HarborMarketingContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroItalic: z.string(),
  heroText: z.string(),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  heroCta: z.string(),
  campaignKicker: z.string(),
  campaignTitleLine1: z.string(),
  campaignTitleItalic: z.string(),
  campaignIntro: z.string(),
  pillars: z.array(PillarSchema),
  visualWide: z.string(),
  visualWideAlt: z.string(),
  visualSide: z.string(),
  visualSideAlt: z.string(),
  visualQuoteLabel: z.string(),
  visualQuoteTitleBefore: z.string(),
  visualQuoteTitleItalic: z.string(),
  visualQuoteBody: z.string(),
  softKicker: z.string(),
  softTitleBefore: z.string(),
  softTitleItalic: z.string(),
  softBody: z.string(),
  softCta: z.string(),
});

export type HarborMarketingContent = z.infer<typeof HarborMarketingContentSchema>;

export const harborMarketingDefaultContent: HarborMarketingContent = {
  heroKicker: "Property marketing",
  heroTitle: "Make buyers feel something—then give them",
  heroItalic: "a reason to act.",
  heroText:
    "High-end marketing is not decoration. It is how we frame value, create attention, and make the best parts of your home easy to understand.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/8b/8bd81e20029c7262277025adc5f6eedef9e8ad43fcda5087bb596ea844fa57bb.avif",
  heroImageAlt: "High-end editorial living room",
  heroCta: "Plan my launch",
  campaignKicker: "The campaign",
  campaignTitleLine1: "One property.",
  campaignTitleItalic: "One clear story.",
  campaignIntro:
    "Every asset should reinforce the same positioning—from the first teaser through the feature sheet and showing experience.",
  pillars: [
    {
      n: "01",
      title: "Edit & style",
      body: "A room-by-room plan for repairs, decluttering, styling, staging, and the small choices that change how a home reads.",
    },
    {
      n: "02",
      title: "Create",
      body: "Editorial photography, vertical and horizontal video, floor plans, detail shots, copy, and campaign assets built around the property.",
    },
    {
      n: "03",
      title: "Distribute",
      body: "MLS, agent networks, social, email, paid digital, print, and direct outreach timed to build concentrated launch attention.",
    },
    {
      n: "04",
      title: "Respond",
      body: "Track showing activity, buyer questions, saves, shares, feedback, competing inventory, and the signals that should shape the next move.",
    },
  ],
  visualWide:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/6d/6d77ac2033d3ecf845e8f0e2d7fe62339edd749e8ee4d4745361051e7785077b.avif",
  visualWideAlt: "Modern home exterior",
  visualSide:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/98/986b4395c3dfd6066f0e49e1efbf5f340006bf817023b0b69aeb6359f5d5ea08.avif",
  visualSideAlt: "Styled living room",
  visualQuoteLabel: "Campaign principle 01",
  visualQuoteTitleBefore: "Don’t just show the rooms.",
  visualQuoteTitleItalic: "Show the life.",
  visualQuoteBody:
    "Great listing creative answers the buyer’s unspoken question: “Can I see myself here?”",
  softKicker: "Thinking of selling?",
  softTitleBefore: "Let’s build the launch before",
  softTitleItalic: "we pick the date.",
  softBody:
    "The earlier we talk, the more options we have around preparation, timing, and presentation.",
  softCta: "Discuss your home ↗",
};
