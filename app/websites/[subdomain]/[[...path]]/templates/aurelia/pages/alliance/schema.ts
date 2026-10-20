import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaAllianceContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  noteKicker: z.string(),
  lead: z.string(),
  paragraphs: z.array(z.string()).min(1),
  citiesKicker: z.string(),
  closeKicker: z.string(),
  closeTitle: z.string(),
  closeCtaLabel: z.string(),
});

export type AureliaAllianceContent = z.infer<typeof AureliaAllianceContentSchema>;

export const aureliaAllianceDefaultContent: AureliaAllianceContent = {
  heroEyebrow: "Aurelia Private Network",
  heroTitle: "Global reach should feel personal.",
  heroSubtitle:
    "A referral and collaboration network connecting trusted independent advisors in major luxury markets.",
  heroImage: images.city,
  noteKicker: "International network",
  lead: "One relationship in Los Angeles. Trusted introductions wherever the search or sale leads next.",
  paragraphs: [
    "The strongest luxury networks are not directories. They are working relationships between advisors who know one another's standards, communication style and local expertise.",
    "Aurelia Private Network is designed to communicate international reach without turning the site into a corporate franchise page.",
  ],
  citiesKicker: "Representative markets",
  closeKicker: "A single point of contact",
  closeTitle: "From local counsel to global coordination.",
  closeCtaLabel: "Connect",
};
