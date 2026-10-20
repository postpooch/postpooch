import { z } from "zod";

export const MaraNeighborhoodContentSchema = z.object({
  profileEyebrow: z.string(),
  profileBody: z.string(),
  galleryEyebrow: z.string(),
  galleryTitle: z.string(),
  galleryImages: z.array(z.string()).min(1),
  inventoryEyebrow: z.string(),
  inventoryTitle: z.string(),
  inventoryCta: z.string(),
});

export type MaraNeighborhoodContent = z.infer<
  typeof MaraNeighborhoodContentSchema
>;

export const maraNeighborhoodDefaultContent: MaraNeighborhoodContent = {
  profileEyebrow: "Neighbourhood profile",
  profileBody:
    "The strongest neighbourhood choice is rarely about a ranking. It is about fit: the streets you enjoy walking, the architecture you respond to, how you spend weekends, and how much friction you want between home and the rest of your life.",
  galleryEyebrow: "A feel for the area",
  galleryTitle: "Homes, streets and daily rhythm.",
  galleryImages: [
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/41/41eb0c1386682c0547e1dcf8cc58d0942e7afc159494b924f2a347ce17ac9efc.avif",
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/02/026a4caae588a676a55b07bf9ce16f9f07fe729a2f8f55aca47826f9dc2b09db.avif",
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/6a/6a156750626adc1888432f6081f03bd4b31a468877aaee253ee2f31bdf288079.avif",
  ],
  inventoryEyebrow: "Selected inventory",
  inventoryTitle: "Homes worth watching.",
  inventoryCta: "All properties",
};
