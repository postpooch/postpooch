import { z } from "zod";

export const AveryHomeContentSchema = z.object({
  heroLine: z.string(),
  heroEmphasis: z.string(),
  heroRest: z.string(),
  heroBody: z.string(),
  listingsCtaLabel: z.string(),
  soldCtaLabel: z.string(),
  insightsCtaLabel: z.string(),
  introKicker: z.string(),
  introTitle: z.string(),
  introBody: z.array(z.string()).min(1),
  introCtaLabel: z.string(),
  introPortrait: z.string(),
  portfolioKicker: z.string(),
  portfolioTitle: z.string(),
  portfolioCopy: z.string(),
  editorialKicker: z.string(),
  editorialTitle: z.string(),
  editorialBody: z.string(),
  editorialCtaLabel: z.string(),
  editorialImage: z.string(),
  insightsKicker: z.string(),
  insightsTitle: z.string(),
});

export type AveryHomeContent = z.infer<typeof AveryHomeContentSchema>;

export const averyHomeDefaultContent: AveryHomeContent = {
  heroLine: "New York,",
  heroEmphasis: "exceptionally",
  heroRest: " considered.",
  heroBody:
    "Distinctive homes. Clear strategy. An editorial eye for the details that move markets and people.",
  listingsCtaLabel: "Current listings ↗",
  soldCtaLabel: "Notable sales ↗",
  insightsCtaLabel: "Market insights ↗",
  introKicker: "Meet Avery",
  introTitle: "Sharp instincts.\nQuiet confidence.",
  introBody: [
    "Avery Laurent advises New York buyers and sellers with a rare combination of market rigor, design fluency, and disarming calm. The work is highly personal, highly prepared, and never one-size-fits-all.",
    "From first conversation through closing, every decision is shaped around one goal: making the complex feel clear.",
  ],
  introCtaLabel: "More about Avery",
  introPortrait: "",
  portfolioKicker: "Selected inventory",
  portfolioTitle: "Featured properties",
  portfolioCopy: "A small edit of homes with compelling architecture, location, or possibility.",
  editorialKicker: "A city of micro-markets",
  editorialTitle: "Know the block,\nnot just the neighborhood.",
  editorialBody:
    "New York rewards specificity. The same avenue can hold different building cultures, buyer pools, light, noise, and value. Good representation lives in those details.",
  editorialCtaLabel: "Explore neighborhoods",
  editorialImage: "",
  insightsKicker: "Field notes",
  insightsTitle: "Real estate insights",
};
