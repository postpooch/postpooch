import { z } from "zod";

export const SloaneCommunityContentSchema = z.object({
  eyebrow: z.string(),
  introSuffix: z.string(),
  highlightsEyebrow: z.string(),
  mapEyebrow: z.string(),
  listingsEyebrow: z.string(),
  listingsTitleSuffix: z.string(),
  listingsIntro: z.string(),
});

export type SloaneCommunityContent = z.infer<typeof SloaneCommunityContentSchema>;

export const sloaneCommunityDefaultContent: SloaneCommunityContent = {
  eyebrow: "Community",
  introSuffix:
    " The best fit within the neighborhood depends on more than price: street orientation, lot position, architectural history, school boundaries, renovation quality, and even which side of a canyon catches late-day light can meaningfully change the experience and the value.",
  highlightsEyebrow: "Neighborhood highlights",
  mapEyebrow: "Area map",
  listingsEyebrow: "Available properties",
  listingsTitleSuffix: " listings.",
  listingsIntro:
    "Representative inventory shown for this neighborhood. Live listings follow the city and street when they match.",
};
