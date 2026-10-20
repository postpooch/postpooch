import { z } from "zod";

export const CoastalCommunityContentSchema = z.object({
  heroEyebrow: z.string(),
  storyTitle: z.string(),
  homesKicker: z.string(),
  homesTitlePrefix: z.string(),
});

export type CoastalCommunityContent = z.infer<typeof CoastalCommunityContentSchema>;

export const coastalCommunityDefaultContent: CoastalCommunityContent = {
  heroEyebrow: "Community",
  storyTitle: "A distinctive way to live on the Southern California coast.",
  homesKicker: "Available Homes",
  homesTitlePrefix: "Properties near",
};
