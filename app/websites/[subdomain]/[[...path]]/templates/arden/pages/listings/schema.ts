import { z } from "zod";

export const ArdenListingsContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  empty: z.string().optional(),
  noteEyebrow: z.string().optional(),
  noteTitle: z.string().optional(),
  noteCopy: z.string().optional(),
});

export type ArdenListingsContent = z.infer<typeof ArdenListingsContentSchema>;

export const ardenSaleDefaultContent: ArdenListingsContent = {
  eyebrow: "Exclusive Portfolio",
  title: "Properties for Sale",
  intro:
    "A curated collection of distinctive homes, vineyard estates, and private offerings across Napa and Sonoma.",
  noteEyebrow: "Private Representation",
  noteTitle: "Not every property is public.",
  noteCopy: "Contact us for a conversation about private and off-market opportunities.",
};

export const ardenSoldDefaultContent: ArdenListingsContent = {
  eyebrow: "Selected Results",
  title: "Notable Sales",
  intro: "Significant transactions across Napa Valley, Sonoma Valley, and the surrounding North Bay.",
};

export const ardenLeaseDefaultContent: ArdenListingsContent = {
  eyebrow: "Seasonal & Long-Term",
  title: "Exclusive Leases",
  intro:
    "Fully furnished Wine Country residences for extended stays, relocations, and seasonal living.",
  empty: "No leases available at this time.",
};

export const ardenWorldwideDefaultContent: ArdenListingsContent = {
  eyebrow: "Our Network",
  title: "Global Collection",
  intro:
    "Exceptional homes represented by trusted advisors in leading residential markets around the world.",
};
