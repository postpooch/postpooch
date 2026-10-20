import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaHomeContentSchema = z.object({
  heroCtaLabel: z.string(),
  heroCtaHref: z.string(),
  scrollCue: z.string(),
  introKicker: z.string(),
  introTitle: z.string(),
  introBody: z.array(z.string()).min(1),
  introCtaLabel: z.string(),
  introCtaHref: z.string(),
  introPortrait: z.string(),
  portfolioKicker: z.string(),
  portfolioTitle: z.string(),
  portfolioCtaLabel: z.string(),
  quoteKicker: z.string(),
  quote: z.string(),
  quoteCite: z.string(),
  communitiesKicker: z.string(),
  communitiesTitle: z.string(),
  communitiesNote: z.string(),
  journalKicker: z.string(),
  journalTitle: z.string(),
  journalCtaLabel: z.string(),
});

export type AureliaHomeContent = z.infer<typeof AureliaHomeContentSchema>;

export const aureliaHomeDefaultContent: AureliaHomeContent = {
  heroCtaLabel: "View collection",
  heroCtaHref: "/properties",
  scrollCue: "Scroll to discover",
  introKicker: "Private advisory",
  introTitle: "Representation built on judgment, discretion and reach.",
  introBody: [
    "Aurelia Estates is a luxury practice built around editorial presentation: fewer distractions, stronger imagery, considered typography, and a client journey that makes the advisor—not the interface—the center of the experience.",
    "For buyers and sellers, that means clear strategy, rigorous market knowledge, access to private opportunities and thoughtful representation from first conversation through closing.",
  ],
  introCtaLabel: "Meet Avery",
  introCtaHref: "/about",
  introPortrait: images.portrait,
  portfolioKicker: "Selected portfolio",
  portfolioTitle: "Exceptional properties, carefully presented.",
  portfolioCtaLabel: "View all",
  quoteKicker: "A point of view",
  quote: "“Luxury is not more. It is the confidence to remove everything that does not matter.”",
  quoteCite: "Aurelia Estates · Brand Philosophy",
  communitiesKicker: "Local intelligence",
  communitiesTitle: "Featured communities",
  communitiesNote:
    "Neighborhood knowledge should feel specific. Explore the distinct character, architecture and market rhythm of Los Angeles' most sought-after residential enclaves.",
  journalKicker: "The Journal",
  journalTitle: "Notes on property, place and value.",
  journalCtaLabel: "View journal",
};
