import { z } from "zod";

export const CoastalListingContentSchema = z.object({
  residenceKicker: z.string(),
  introTitle: z.string(),
  extraBody: z.string(),
  ctaLabel: z.string(),
  offeredKicker: z.string(),
});

export type CoastalListingContent = z.infer<typeof CoastalListingContentSchema>;

export const coastalListingDefaultContent: CoastalListingContent = {
  residenceKicker: "Residence",
  introTitle: "A considered home for modern coastal living.",
  extraBody:
    "This listing page is designed to be replaced by live MLS or database content later. The layout supports rich editorial copy, property facts, galleries, and lead capture without tying the visual system to a specific data provider.",
  ctaLabel: "Request a Private Showing",
  offeredKicker: "Offered At",
};
