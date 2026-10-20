import { z } from "zod";

export const ArdenHomeContentSchema = z.object({
  introTitle: z.string(),
  introCopy: z.array(z.string()),
  introCtaLabel: z.string(),
  listingsEyebrow: z.string(),
  listingsTitle: z.string(),
  listingsCopy: z.string(),
  listingsCtaLabel: z.string(),
  founderEyebrow: z.string(),
  founderTitle: z.string(),
  founderCopy: z.string(),
  founderCtaLabel: z.string(),
  pressEyebrow: z.string(),
  pressTitle: z.string(),
  pressCopy: z.string(),
  sellerEyebrow: z.string(),
  sellerTitle: z.string(),
  sellerCopy: z.string(),
  sellerCtaLabel: z.string(),
  lifestyleEyebrow: z.string(),
  lifestyleTitle: z.string(),
  lifestyleCopy: z.string(),
  logos: z.array(z.string()),
});

export type ArdenHomeContent = z.infer<typeof ArdenHomeContentSchema>;

export const ardenHomeDefaultContent: ArdenHomeContent = {
  introTitle: "Local intelligence.\nGlobal perspective.",
  introCopy: [
    "Arden Vale + Co. represents a tightly curated portfolio across Napa and Sonoma, pairing deep regional knowledge with an international network of buyers, advisors, and brokers.",
    "Our work is intentionally high-touch: careful preparation, precise positioning, and exceptional presentation at every price point we choose to represent.",
  ],
  introCtaLabel: "Our Story",
  listingsEyebrow: "Current collection",
  listingsTitle: "Extraordinary Properties",
  listingsCopy: "A selection of homes and estates currently represented by our team.",
  listingsCtaLabel: "View All Properties",
  founderEyebrow: "Founder",
  founderTitle: "Meet Alexandra Vale",
  founderCopy:
    "Her practice is built around discretion, rigorous strategy, and a highly connected approach to luxury property.",
  founderCtaLabel: "Learn More",
  pressEyebrow: "Recognition",
  pressTitle: "Press & Media",
  pressCopy: "A selection of recent editorial features and market commentary.",
  sellerEyebrow: "For Sellers",
  sellerTitle: "The right launch changes the outcome.",
  sellerCopy:
    "At the top of the market, presentation is not decoration—it is strategy. We shape every detail of a launch to create clarity, confidence, and reach.",
  sellerCtaLabel: "Our Seller Approach",
  lifestyleEyebrow: "The Lifestyle",
  lifestyleTitle: "Explore Wine Country",
  lifestyleCopy: "Distinct towns, shared beauty, and very different ways to live.",
  logos: [
    "ARCHITECTURAL DIGEST",
    "MANSION GLOBAL",
    "THE WALL STREET JOURNAL",
    "FORBES",
    "ROBB REPORT",
  ],
};
