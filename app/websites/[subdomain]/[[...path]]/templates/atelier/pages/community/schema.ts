import { z } from "zod";

export const AtelierCommunityContentSchema = z.object({
  kicker: z.string(),
  extraParagraph: z.string(),
  loveEyebrow: z.string(),
  loveTitle: z.string(),
  listingsTitle: z.string(),
  searchCta: z.string(),
});

export type AtelierCommunityContent = z.infer<typeof AtelierCommunityContentSchema>;

export const atelierCommunityDefaultContent: AtelierCommunityContent = {
  kicker: "Austin neighborhood guide",
  extraParagraph:
    "As with every Austin neighborhood, micro-location matters. Lot orientation, street character, renovation quality, architecture, and proximity to the places you actually use can create meaningful differences in value from one block to the next.",
  loveEyebrow: "What to love",
  loveTitle: "The details that define the neighborhood.",
  listingsTitle: "Explore current opportunities",
  searchCta: "Search the market",
};
