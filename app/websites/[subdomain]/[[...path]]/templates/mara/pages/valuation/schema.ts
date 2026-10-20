import { z } from "zod";

const ProcessBlockSchema = z.object({
  number: z.string(),
  title: z.string(),
  copy: z.string(),
});

export const MaraValuationContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroCopy: z.string(),
  heroImage: z.string(),
  introEyebrow: z.string(),
  introTitle: z.string(),
  introBody: z.string(),
  blocks: z.array(ProcessBlockSchema).min(1),
  formTitle: z.string(),
});

export type MaraValuationContent = z.infer<typeof MaraValuationContentSchema>;

export const maraValuationDefaultContent: MaraValuationContent = {
  heroEyebrow: "Private valuation",
  heroTitle: "What is your home really worth in this market?",
  heroCopy:
    "A thoughtful valuation looks beyond a price-per-square-foot shortcut. It considers the property, the buyer, the competition and the way your home would be positioned today.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/a0/a07773240285f007db39db4ad273311c1962e5be681a165f4e3f31bc9e78b3c4.avif",
  introEyebrow: "A sharper estimate",
  introTitle: "Value is evidence, context and presentation.",
  introBody:
    "I’ll review recent comparable sales, current competition, property condition, architecture, lot, location, likely buyer profile and the preparation that could influence your result. The outcome is a clear range and a practical conversation—not an automated number designed to collect your email.",
  blocks: [
    {
      number: "01",
      title: "Property review",
      copy: "Walk through the home and understand its strengths, constraints, upgrades and unique details.",
    },
    {
      number: "02",
      title: "Market evidence",
      copy: "Study relevant sales and active competition, with adjustments for what buyers are rewarding now.",
    },
    {
      number: "03",
      title: "Positioning options",
      copy: "Compare strategies for preparation, timing, asking price and how the home would be presented.",
    },
    {
      number: "04",
      title: "Clear recommendation",
      copy: "Leave with a realistic value range, expected tradeoffs and next steps whether you sell now or later.",
    },
  ],
  formTitle: "Request a private home valuation.",
};
