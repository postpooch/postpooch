import { z } from "zod";

import { images } from "../../catalog-defaults";
import { SimpleHeroContentSchema } from "../simple-schema";

export const ArdenNeighborhoodsContentSchema = SimpleHeroContentSchema;
export type ArdenNeighborhoodsContent = import("../simple-schema").SimpleHeroContent;
export const ardenNeighborhoodsDefaultContent: ArdenNeighborhoodsContent = {
  heroEyebrow: "The Lifestyle",
  heroTitle: "Culture & Community",
  heroSubtitle: "The towns, roads, and landscapes that give Wine Country its character.",
  heroImage: images.landscape,
};

export const ArdenNeighborhoodContentSchema = z.object({
  lifestyleTitle: z.string(),
  lifestyleCopy: z.string(),
  marketTitle: z.string(),
  marketCopy: z.string(),
  listingsEyebrow: z.string(),
  listingsTitle: z.string(),
});
export type ArdenNeighborhoodContent = z.infer<typeof ArdenNeighborhoodContentSchema>;
export const ardenNeighborhoodDefaultContent: ArdenNeighborhoodContent = {
  lifestyleTitle: "The Lifestyle",
  lifestyleCopy:
    "Life here is shaped by easy access to food, wine, landscape, and the outdoors. The most desirable properties tend to feel connected to the setting—through views, gardens, walkability, or a sense of privacy that is difficult to reproduce elsewhere.",
  marketTitle: "Real Estate",
  marketCopy:
    "Inventory is typically limited and highly property-specific. Architecture, land, water, access, condition, and future use can create meaningful differences in value even among nearby homes.",
  listingsEyebrow: "In This Community",
  listingsTitle: "Neighborhood Listings",
};
