import { z } from "zod";

export const RowePropertyContentSchema = z.object({
  imageAlt: z.string(),
  interiorAlt: z.string(),
  architectureAlt: z.string(),
  detailsLabel: z.string(),
  showingCtaLabel: z.string(),
  showingCtaHref: z.string(),
  disclaimerLabel: z.string(),
  disclaimerBody: z.string(),
});

export type RowePropertyContent = z.infer<typeof RowePropertyContentSchema>;

export const rowePropertyDefaultContent: RowePropertyContent = {
  imageAlt: "Demo luxury residence",
  interiorAlt: "Demo residence interior",
  architectureAlt: "Demo residence architecture",
  detailsLabel: "Residence details",
  showingCtaLabel: "Request a private showing",
  showingCtaHref: "/contact",
  disclaimerLabel: "Demo listing",
  disclaimerBody:
    "Property names, prices, locations, and specifications on this starter site are fictional. Replace with verified listing data before publishing.",
};
