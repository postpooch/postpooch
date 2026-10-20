import { z } from "zod";

export const AtelierCommunitiesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
});

export type AtelierCommunitiesContent = z.infer<
  typeof AtelierCommunitiesContentSchema
>;

export const atelierCommunitiesDefaultContent: AtelierCommunitiesContent = {
  heroEyebrow: "Area guide",
  heroTitle: "Find your Austin.",
  heroSubtitle:
    "Six neighborhoods, six distinct rhythms, one city with an unusually strong sense of place.",
};
