import { z } from "zod";

import { images } from "../../catalog-defaults";

export const ReyCommunitiesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  introTitleLine1: z.string(),
  introTitleLine2: z.string(),
  introTitleEmphasis: z.string(),
  introBodyOne: z.string(),
  introBodyTwo: z.string(),
});

export type ReyCommunitiesContent = z.infer<typeof ReyCommunitiesContentSchema>;

export const reyCommunitiesDefaultContent: ReyCommunitiesContent = {
  heroEyebrow: "Neighborhoods & lifestyles",
  heroTitle: "Southern California, considered closely.",
  heroImage: images.communitiesHero,
  introTitleLine1: "Every address",
  introTitleLine2: "has its own",
  introTitleEmphasis: "rhythm.",
  introBodyOne:
    "The best real estate advice is local in the deepest sense: understanding not just prices, but streets, architecture, light, privacy, schools, access, and how a place actually feels to live in.",
  introBodyTwo: "Explore a selection of the markets our team knows intimately.",
};
