import { z } from "zod";

export const AtelierHomeContentSchema = z.object({
  introEyebrow: z.string(),
  introTitle: z.string(),
  introTitleEmphasis: z.string(),
  introTitleEnd: z.string(),
  collectionEyebrow: z.string(),
  collectionTitle: z.string(),
  collectionCopy: z.string(),
  collectionCta: z.string(),
  portraitEyebrow: z.string(),
  portraitTitle: z.string(),
  portraitTitleEmphasis: z.string(),
  portraitText: z.string(),
  portraitQuote: z.string(),
  portraitCta: z.string(),
  communitiesEyebrow: z.string(),
  communitiesTitle: z.string(),
  communitiesCopy: z.string(),
  journalEyebrow: z.string(),
  journalTitle: z.string(),
  journalCta: z.string(),
});

export type AtelierHomeContent = z.infer<typeof AtelierHomeContentSchema>;

export const atelierHomeDefaultContent: AtelierHomeContent = {
  introEyebrow: "A modern standard of representation",
  introTitle: "We believe luxury is not a price point. It is",
  introTitleEmphasis: "attention, clarity,",
  introTitleEnd: "and the confidence that every detail has been considered.",
  collectionEyebrow: "Current collection",
  collectionTitle: "Properties of distinction",
  collectionCopy:
    "A curated selection of private, on-market, and forthcoming opportunities.",
  collectionCta: "Explore all properties",
  portraitEyebrow: "Meet your advisor",
  portraitTitle: "Local knowledge.",
  portraitTitleEmphasis: "Global perspective.",
  portraitText:
    "For nearly two decades, Elena has represented architecturally significant homes, waterfront estates, central-city residences, and private land throughout Austin. Her work combines rigorous pricing strategy with editorial storytelling and an unusually personal level of service.",
  portraitQuote:
    "The best transactions feel calm because the hard work happened before anyone saw it.",
  portraitCta: "More about Elena",
  communitiesEyebrow: "Neighborhood guide",
  communitiesTitle: "Where Austin becomes home",
  communitiesCopy: "Explore six distinct ways of living in and around the city.",
  journalEyebrow: "The Edit",
  journalTitle: "Market, design & place",
  journalCta: "Read the journal",
};
