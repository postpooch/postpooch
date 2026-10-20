import { z } from "zod";

import { images } from "../../catalog-defaults";

export const ArdenSellContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  image: z.string(),
  resultsEyebrow: z.string(),
  resultsTitle: z.string(),
  resultsCopy: z.string(),
});

export type ArdenSellContent = z.infer<typeof ArdenSellContentSchema>;

export const ardenSellDefaultContent: ArdenSellContent = {
  eyebrow: "Private valuation",
  title: "What is your property worth?",
  intro:
    "Request a confidential consultation and custom market position for your home, vineyard, or estate.",
  image: images.dusk,
  resultsEyebrow: "Track Record",
  resultsTitle: "Selected Sales",
  resultsCopy: "Results shaped by preparation, positioning, and access.",
};
