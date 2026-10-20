import { z } from "zod";

export const ArdenPropertyContentSchema = z.object({
  descriptionEyebrow: z.string(),
  descriptionTitle: z.string(),
  featuresEyebrow: z.string(),
  relatedEyebrow: z.string(),
  relatedTitle: z.string(),
});

export type ArdenPropertyContent = z.infer<typeof ArdenPropertyContentSchema>;

export const ardenPropertyDefaultContent: ArdenPropertyContent = {
  descriptionEyebrow: "Property Description",
  descriptionTitle: "A place designed around the landscape.",
  featuresEyebrow: "Features & Amenities",
  relatedEyebrow: "More to Explore",
  relatedTitle: "Related Properties",
};
