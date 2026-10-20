import { z } from "zod";

export const AtelierSearchContentSchema = z.object({
  locationLabel: z.string(),
  heading: z.string(),
  mapTitle: z.string(),
  mapNote: z.string(),
});

export type AtelierSearchContent = z.infer<typeof AtelierSearchContentSchema>;

export const atelierSearchDefaultContent: AtelierSearchContent = {
  locationLabel: "Austin, TX",
  heading: "Homes for sale in Austin",
  mapTitle: "Interactive map area",
  mapNote: "Connect your IDX / map provider here",
};
