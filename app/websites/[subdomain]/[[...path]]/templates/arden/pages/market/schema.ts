import { z } from "zod";

import { images } from "../../catalog-defaults";

export const ArdenMarketContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  subtitle: z.string(),
  image: z.string(),
  aboutTitle: z.string(),
  aboutCopy: z.array(z.string()),
  marketTitle: z.string(),
  marketCopy: z.array(z.string()),
  listingsEyebrow: z.string(),
  listingsTitle: z.string(),
});

export type ArdenMarketContent = z.infer<typeof ArdenMarketContentSchema>;

export const ardenNapaDefaultContent: ArdenMarketContent = {
  eyebrow: "Market Guide",
  title: "Napa Valley Real Estate",
  subtitle: "Vineyard estates, town homes, and a landscape that continues to define American wine country.",
  image: images.hero,
  aboutTitle: "About Napa Valley",
  aboutCopy: [
    "Napa Valley is one of the most recognized residential and agricultural landscapes in the country. The valley is not a single market, but a collection of towns, appellations, and property types that range from walkable village homes to vineyard estates with agricultural operations, guest houses, and long private drives.",
  ],
  marketTitle: "The Real Estate Market",
  marketCopy: [
    "Demand is typically driven by lifestyle, land, architecture, and scarcity. Properties with privacy, views, water, usable land, and a strong sense of place tend to attract the most interest.",
  ],
  listingsEyebrow: "Current Inventory",
  listingsTitle: "Napa Valley Properties",
};

export const ardenSonomaDefaultContent: ArdenMarketContent = {
  eyebrow: "Market Guide",
  title: "Sonoma Valley Real Estate",
  subtitle: "A more intimate wine country, with historic towns, ranch land, and a quieter sense of place.",
  image: images.dusk,
  aboutTitle: "About Sonoma Valley",
  aboutCopy: [
    "Sonoma Valley has a different rhythm than Napa. It is more intimate, more agricultural in places, and often more connected to historic towns, ranch land, and a slightly quieter sense of country living.",
  ],
  marketTitle: "The Real Estate Market",
  marketCopy: [
    "Buyers often come for privacy, land, and a more understated wine-country lifestyle. Inventory can be limited, and properties with usable acreage, views, and a strong connection to the landscape tend to stand apart.",
  ],
  listingsEyebrow: "Current Inventory",
  listingsTitle: "Sonoma Valley Properties",
};
