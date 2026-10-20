import { z } from "zod";

export const HarborBuyContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroItalic: z.string(),
  heroText: z.string(),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  heroCta: z.string(),
  processTitle: z.string(),
  processItalic: z.string(),
  localKicker: z.string(),
  localTitleBefore: z.string(),
  localTitleItalic: z.string(),
  localBody1: z.string(),
  localBody2: z.string(),
  localCta: z.string(),
  listingsKicker: z.string(),
  listingsTitleBefore: z.string(),
  listingsTitleItalic: z.string(),
  listingsCta: z.string(),
});

export type HarborBuyContent = z.infer<typeof HarborBuyContentSchema>;

export const harborBuyDefaultContent: HarborBuyContent = {
  heroKicker: "Buying in Toronto West",
  heroTitle: "The right home is only part of",
  heroItalic: "a good purchase.",
  heroText:
    "A strong buy is the right property, in the right pocket, at a price and set of terms that make sense for your life and the market.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/c5/c5d9bbacf3934b8e2660c509a94ab9853a08e5c1cc4cf8fa85bd4963ccfb096a.avif",
  heroImageAlt: "High-end modern kitchen",
  heroCta: "Book a buyer consult",
  processTitle: "Search with",
  processItalic: "better context.",
  localKicker: "Local perspective",
  localTitleBefore: "Two similar houses can be",
  localTitleItalic: "very different buys.",
  localBody1:
    "A few blocks can change schools, traffic, lot patterns, future development, transit access, or resale demand. That’s why I look beyond the listing sheet and help you understand the bigger picture around every property.",
  localBody2:
    "You’ll get comparable sales, property-level observations, neighbourhood nuance, and a clear strategy before an offer is ever on the table.",
  localCta: "Explore the condo guide",
  listingsKicker: "On the market",
  listingsTitleBefore: "A few homes worth",
  listingsTitleItalic: "a closer look.",
  listingsCta: "See all properties ↗",
};
