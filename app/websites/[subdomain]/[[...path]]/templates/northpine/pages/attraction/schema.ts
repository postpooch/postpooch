import { z } from "zod";

export const NorthpineAttractionContentSchema = z.object({
  body: z.string(),
  localTitle: z.string(),
  localBody: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});

export type NorthpineAttractionContent = z.infer<
  typeof NorthpineAttractionContentSchema
>;

export const northpineAttractionDefaultContent: NorthpineAttractionContent = {
  body: "One of the pleasures of owning in the mountains is how quickly everyday life opens into the outdoors. This guide is designed as a flexible content page you can populate with an agent's own local recommendations, photography and seasonal notes.",
  localTitle: "Local perspective",
  localBody:
    "For real-estate clients, lifestyle content is useful context. It helps buyers understand drive times, nearby activities and how a specific part of the market fits the way they imagine using a home.",
  ctaLabel: "Explore Communities",
  ctaHref: "/communities",
};
