import { z } from "zod";

export const HarborCondoGuideContentSchema = z.object({
  heroKicker: z.string(),
  heroTitleBefore: z.string(),
  heroTitleItalic: z.string(),
  heroLead: z.string(),
  heroCta: z.string(),
  heroImage: z.string(),
  heroImageAlt: z.string(),
  listKicker: z.string(),
  listTitleBefore: z.string(),
  listTitleItalic: z.string(),
  listIntro: z.string(),
});

export type HarborCondoGuideContent = z.infer<
  typeof HarborCondoGuideContentSchema
>;

export const harborCondoGuideDefaultContent: HarborCondoGuideContent = {
  heroKicker: "Toronto West condo guide",
  heroTitleBefore: "Find the building that fits",
  heroTitleItalic: "how you live.",
  heroLead:
    "A curated starting point for comparing building character, suite style, location, fees, and day-to-day lifestyle.",
  heroCta: "Ask about a building ↗",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/27/27f5377c6b6e7b88fe3a19f275b21c3a6c25464cbd8f6ee843bfb705caf96f93.avif",
  heroImageAlt: "Modern residential towers",
  listKicker: "Selected buildings",
  listTitleBefore: "A starting list, not",
  listTitleItalic: "a ranking.",
  listIntro:
    "Building names below are fictional placeholders for the demo. The production version should use the agent’s actual local inventory and expertise.",
};
