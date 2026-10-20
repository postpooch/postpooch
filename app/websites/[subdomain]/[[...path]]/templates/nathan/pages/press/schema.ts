import { z } from "zod";

export const NathanPressContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  deck: z.string(),
  featurePropertyIndex: z.number().int().nonnegative(),
  featureEyebrow: z.string(),
  featureTitle: z.string(),
  featureBody: z.string(),
  featureMeta: z.string(),
  mediaEyebrow: z.string(),
  mediaTitle: z.string(),
  mediaCtaLabel: z.string(),
  mediaCtaHref: z.string(),
});

export type NathanPressContent = z.infer<typeof NathanPressContentSchema>;

export const nathanPressDefaultContent: NathanPressContent = {
  eyebrow: "PRESS + COMMENTARY",
  title: "In the conversation.",
  deck: "Nathan contributes market perspective on luxury residential real estate, design-led property, and private sales strategy.",
  featurePropertyIndex: 2,
  featureEyebrow: "FEATURED · ARCHITECTURAL DIGEST",
  featureTitle: "Inside the quiet return of the grand New York apartment",
  featureBody:
    "Why buyers are prioritizing scale, craftsmanship, and separation of space over amenity checklists.",
  featureMeta: "JUNE 12, 2026 ↗",
  mediaEyebrow: "MEDIA INQUIRIES",
  mediaTitle: "For commentary, interviews, or market background.",
  mediaCtaLabel: "Contact Nathan",
  mediaCtaHref: "/contact",
};
