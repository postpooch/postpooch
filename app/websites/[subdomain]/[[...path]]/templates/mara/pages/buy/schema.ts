import { z } from "zod";

const ServiceBlockSchema = z.object({
  number: z.string(),
  title: z.string(),
  copy: z.string(),
});

export const MaraServicePageContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroCopy: z.string(),
  heroImage: z.string(),
  approachEyebrow: z.string(),
  approachTitle: z.string(),
  approachBody: z.string(),
  blocks: z.array(ServiceBlockSchema).min(1),
  quote: z.string(),
  quoteAttribution: z.string(),
  nextEyebrow: z.string(),
  nextTitle: z.string(),
  nextBody: z.string(),
  nextImage: z.string(),
  primaryCtaLabel: z.string(),
  primaryCtaHref: z.string(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
  formTitle: z.string(),
});


export type MaraBuyContent = z.infer<typeof MaraServicePageContentSchema>;
export const MaraBuyContentSchema = MaraServicePageContentSchema;

export const maraBuyDefaultContent: MaraBuyContent = {
  heroEyebrow: "Private buyer advisory",
  heroTitle: "Find a home that fits more than a checklist.",
  heroCopy:
    "A highly personal search shaped by your lifestyle, taste and long-term plans.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/2b/2b454d8dbe7d185190cd98a4cece67540048a5fcdf393fa36af59d9608bb46a7.avif",
  approachEyebrow: "The approach",
  approachTitle: "A search built around you.",
  approachBody:
    "You should never feel rushed into a home because it photographs well or checks enough boxes. My job is to combine market knowledge with close visual judgment so you can understand both the life a property offers today and the choices it gives you tomorrow.",
  blocks: [
    {
      number: "01",
      title: "Define the life, then the search.",
      copy: "We start with the way you want to live—your daily rhythm, architecture preferences, commute, privacy, schools, entertaining and future plans. That becomes the filter.",
    },
    {
      number: "02",
      title: "Read the property beyond the listing.",
      copy: "I look closely at proportion, renovation quality, light, planning constraints, resale logic and the details that are easy to miss during a fast showing.",
    },
    {
      number: "03",
      title: "Negotiate with context.",
      copy: "Price is only one part of a strong offer. Timing, conditions, presentation and understanding the seller’s priorities can create leverage without creating noise.",
    },
    {
      number: "04",
      title: "Stay useful after the keys.",
      copy: "Trades, designers, architects, movers, neighbourhood introductions—my role does not disappear when the transaction closes.",
    },
  ],
  quote:
    "The best transaction is the one where you understand exactly why the decision makes sense.",
  quoteAttribution: "Mara Vale",
  nextEyebrow: "Next step",
  nextTitle: "Start with a private buyer consultation.",
  nextBody:
    "No pressure, no portal overload. We will define the search and build a clear plan for the market you are entering.",
  nextImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/53/532d4d2f6e2422e829a62006bf86d3dfba8a3ee91e402589f4de18146d951c5f.avif",
  primaryCtaLabel: "Plan your search",
  primaryCtaHref: "/buyer-consultation",
  secondaryCtaLabel: "Create a search brief",
  secondaryCtaHref: "/property-alerts",
  formTitle: "Ready to plan the search?",
};
