import { z } from "zod";

import { images } from "../../catalog-defaults";

const StatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const SloaneHomeContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSubtext: z.string(),
  scrollNote: z.string(),
  heroSlide1: z.string(),
  heroSlide2: z.string(),
  heroSlide3: z.string(),
  heroSlide4: z.string(),
  statementKicker: z.string(),
  statementTitle: z.string(),
  listingsEyebrow: z.string(),
  listingsTitle: z.string(),
  listingsIntro: z.string(),
  listingsCta: z.string(),
  aboutEyebrow: z.string(),
  aboutTitle: z.string(),
  aboutParagraphs: z.array(z.string()).min(1),
  aboutCta: z.string(),
  stats: z.array(StatSchema).min(1),
  testimonialEyebrow: z.string(),
  testimonialSide: z.string(),
  testimonialCta: z.string(),
  communitiesEyebrow: z.string(),
  communitiesTitle: z.string(),
  communitiesIntro: z.string(),
  communitiesCta: z.string(),
  pressEyebrow: z.string(),
  pressTitle: z.string(),
  pressCta: z.string(),
  journalEyebrow: z.string(),
  journalTitle: z.string(),
  newsletterEyebrow: z.string(),
  newsletterTitle: z.string(),
  newsletterBody: z.string(),
  newsletterCta: z.string(),
});

export type SloaneHomeContent = z.infer<typeof SloaneHomeContentSchema>;

export const sloaneHomeDefaultContent: SloaneHomeContent = {
  heroKicker: "Los Angeles · Coastal California",
  heroTitle: "Property, perspective, and access.",
  heroSubtext:
    "Private representation for buyers and sellers who value discretion, design, and informed decision-making.",
  scrollNote: "Scroll to explore",
  heroSlide1: images.house1,
  heroSlide2: images.house2,
  heroSlide3: images.pool,
  heroSlide4: images.house4,
  statementKicker: "Sloane Reed Real Estate",
  statementTitle: "Luxury is not a price point. It is the quality of the advice.",
  listingsEyebrow: "Exclusive listings",
  listingsTitle: "A considered collection of exceptional homes.",
  listingsIntro:
    "A curated selection of current, upcoming, and recently represented properties across Los Angeles and the coast.",
  listingsCta: "View all listings",
  aboutEyebrow: "About",
  aboutTitle: "Meet Sloane Reed",
  aboutParagraphs: [
    "Sloane advises a design-minded clientele across Los Angeles, pairing neighborhood fluency with disciplined negotiation and editorial-quality marketing. Her approach is intentionally personal: fewer assumptions, better questions, and a clear point of view about what makes a property valuable.",
    "From discreet off-market opportunities to fully launched campaigns, every assignment is shaped around the client—not a formula.",
  ],
  aboutCta: "Read more",
  stats: [
    { value: "18+", label: "Years of experience" },
    { value: "$1.2B", label: "Career sales volume" },
    { value: "Top 1%", label: "Los Angeles advisors" },
    { value: "24/7", label: "Client-first access" },
  ],
  testimonialEyebrow: "Client perspective",
  testimonialSide:
    "Representation is measured in outcomes, but also in how the process feels. Clear communication, calm execution, and thoughtful strategy are the standard.",
  testimonialCta: "Read client stories",
  communitiesEyebrow: "Neighborhoods",
  communitiesTitle: "Know the city at street level.",
  communitiesIntro:
    "A market is never just a zip code. Explore the architecture, rhythms, and micro-neighborhoods that shape value across Los Angeles.",
  communitiesCta: "Explore all communities",
  pressEyebrow: "In the press",
  pressTitle: "Media & market commentary.",
  pressCta: "View all press",
  journalEyebrow: "Journal",
  journalTitle: "Market intelligence with a point of view.",
  newsletterEyebrow: "Private notes",
  newsletterTitle: "The Reed Report",
  newsletterBody:
    "A concise monthly note with new listings, meaningful price movement, design discoveries, and neighborhood intelligence.",
  newsletterCta: "Subscribe",
};
