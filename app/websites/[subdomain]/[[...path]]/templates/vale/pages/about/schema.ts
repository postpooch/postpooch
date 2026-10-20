import { z } from "zod";

export const ValeAboutContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  titleLine3: z.string(),
  heroImage: z.string(),
  storyEyebrow: z.string(),
  storyTitle: z.string(),
  storyParagraphs: z.array(z.string()).min(1),
  quote: z.string(),
  valuesEyebrow: z.string(),
  valuesTitleLines: z.array(z.string()).min(1),
  values: z.array(z.string()).min(1),
  marketsEyebrow: z.string(),
  marketsTitle: z.string(),
  marketsCtaLabel: z.string(),
});

export type ValeAboutContent = z.infer<typeof ValeAboutContentSchema>;

export const valeAboutDefaultContent: ValeAboutContent = {
  eyebrow: "About Mara",
  titleLine1: "Market-minded.",
  titleEmphasis: "Design-aware.",
  titleLine3: "Client-first.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/73/73de77f2a18da1fbbcd22b9e28b4d7d01dcbfa0bb3f292d94af5c5580f75770c.avif",
  storyEyebrow: "The practice",
  storyTitle:
    "I believe the best representation feels equal parts analytical and intuitive.",
  storyParagraphs: [
    "Buying or selling a home asks you to make consequential decisions while a lot is moving at once. I built my practice to make that experience more legible: clear strategy, careful preparation, strong communication, and no unnecessary noise.",
    "My design background shapes how I read property. I notice proportion, light, material quality, renovation potential, and the details that influence emotional value. My market work keeps that perspective grounded in comps, timing, negotiation, and risk.",
  ],
  quote:
    "“The goal is not to push a transaction forward. It is to help you recognize the right move—and execute it exceptionally well.”",
  valuesEyebrow: "What clients can expect",
  valuesTitleLines: [
    "One point of contact.",
    "A rigorous process.",
    "No theater.",
  ],
  values: [
    "Clear, candid advice",
    "Responsive communication",
    "Strong visual presentation",
    "Disciplined negotiation",
    "Long-term perspective",
  ],
  marketsEyebrow: "Primary markets",
  marketsTitle:
    "Encinitas · Carlsbad · Del Mar · Rancho Santa Fe · Coastal San Diego",
  marketsCtaLabel: "Talk about your neighborhood",
};
