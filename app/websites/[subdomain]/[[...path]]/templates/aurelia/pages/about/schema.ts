import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaAboutContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  portrait: z.string(),
  profileKicker: z.string(),
  noteKicker: z.string(),
  lead: z.string(),
  paragraphs: z.array(z.string()).min(1),
  globalTitle: z.string(),
  globalBody: z.string(),
  designTitle: z.string(),
  designBody: z.string(),
  recognitionKicker: z.string(),
  recognitionLogos: z.array(z.string()).min(1),
  listingsKicker: z.string(),
  listingsTitle: z.string(),
});

export type AureliaAboutContent = z.infer<typeof AureliaAboutContentSchema>;

export const aureliaAboutDefaultContent: AureliaAboutContent = {
  heroEyebrow: "The advisor",
  heroTitle: "Avery Morgan",
  heroSubtitle: "A disciplined, personal approach to Los Angeles luxury real estate.",
  heroImage: images.city,
  portrait: images.portrait,
  profileKicker: "Advisor profile",
  noteKicker: "Get to know Avery",
  lead: "A private-client practice shaped by preparation, taste and long-term relationships.",
  paragraphs: [
    "Avery Morgan advises a deliberately focused roster of clients across Beverly Hills, Bel Air, Holmby Hills, Malibu and the Hollywood Hills. The work combines granular neighborhood knowledge with a broad network of architects, attorneys, wealth advisors and real estate professionals.",
    "The philosophy is straightforward: the best result is not always the loudest launch. Some properties benefit from broad market exposure; others require careful sequencing, private introductions and controlled access. The strategy is built around the client rather than a predetermined marketing formula.",
  ],
  globalTitle: "Global reach, local judgment",
  globalBody:
    "International relationships matter most when they are useful at the local level. Avery's network connects Los Angeles clients with trusted advisors in key markets while maintaining a single point of accountability throughout the transaction.",
  designTitle: "Design fluency",
  designBody:
    "Architecture and design are treated as market fundamentals. Understanding why a house works—its siting, material choices, proportions and relationship to the land—helps both buyers evaluate value and sellers position a property with greater precision.",
  recognitionKicker: "Recognition",
  recognitionLogos: ["Architectural\nDigest", "Mansion\nGlobal", "Robb\nReport", "The Real\nDeal"],
  listingsKicker: "Current opportunities",
  listingsTitle: "Exclusive listings",
};
