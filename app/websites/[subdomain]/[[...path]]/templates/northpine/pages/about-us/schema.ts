import { z } from "zod";

export const NorthpineAboutContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  approachKicker: z.string(),
  approachTitle: z.string(),
  approachLead: z.string(),
  approachBodyOne: z.string(),
  approachBodyTwo: z.string(),
  differenceKicker: z.string(),
  differenceTitle: z.string(),
  teamKicker: z.string(),
  teamTitle: z.string(),
});

export type NorthpineAboutContent = z.infer<typeof NorthpineAboutContentSchema>;

export const northpineAboutDefaultContent: NorthpineAboutContent = {
  heroTitle: "About Northpine",
  heroSubtitle: "Local market knowledge, thoughtful marketing and a service-first approach.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/3d/3d3b1c895df50d8dfc8f97e8098e00293b7d5711d6cd0857d7cae6cadeeeaf05.avif",
  approachKicker: "OUR APPROACH",
  approachTitle: "Real estate should feel informed, not overwhelming.",
  approachLead:
    "We combine detailed local knowledge with polished presentation and straightforward communication.",
  approachBodyOne:
    "Northpine was built for clients who value context. We explain not only what a property is, but how its road, view, water, neighborhood, maintenance profile and resale position fit together.",
  approachBodyTwo:
    "Our job is to make the trade-offs visible, the process organized and the decisions easier to make.",
  differenceKicker: "THE DIFFERENCE",
  differenceTitle: "Built around the details.",
  teamKicker: "OUR TEAM",
  teamTitle: "Small team. High-touch service.",
};
