import { z } from "zod";

export const AverySearchContentSchema = z.object({
  kicker: z.string(),
  placeholder: z.string(),
  resultsKicker: z.string(),
  resultsTitle: z.string(),
  resultsNote: z.string(),
});

export type AverySearchContent = z.infer<typeof AverySearchContentSchema>;

export const averySearchDefaultContent: AverySearchContent = {
  kicker: "New York property search",
  placeholder: "Address, neighborhood, or building",
  resultsKicker: "Curated results",
  resultsTitle: "Homes worth a closer look",
  resultsNote: "A representative set of listings for this template.",
};
