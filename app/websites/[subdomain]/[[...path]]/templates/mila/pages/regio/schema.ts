import { z } from "zod";

export const MilaRegioContentSchema = z.object({
  heroEyebrowPrefix: z.string(),
  storyEyebrow: z.string(),
  storyTitlePrefix: z.string(),
  storyTitleSuffix: z.string(),
  listingsEyebrow: z.string(),
  listingsTitlePrefix: z.string(),
  listingsCta: z.string(),
});

export type MilaRegioContent = z.infer<typeof MilaRegioContentSchema>;

export const milaRegioDefaultContent: MilaRegioContent = {
  heroEyebrowPrefix: "Broker for",
  storyEyebrow: "Local perspective",
  storyTitlePrefix: "Living in",
  storyTitleSuffix: "calls for a feel for the place.",
  listingsEyebrow: "Listings",
  listingsTitlePrefix: "Homes in",
  listingsCta: "View all listings",
};
