import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaGlobalContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  title: z.string(),
  note: z.string(),
  searchPlaceholder: z.string(),
});

export type AureliaGlobalContent = z.infer<typeof AureliaGlobalContentSchema>;

export const aureliaGlobalDefaultContent: AureliaGlobalContent = {
  heroEyebrow: "International network",
  heroTitle: "Global Collection",
  heroSubtitle:
    "Selected opportunities represented through a trusted network of independent luxury advisors.",
  heroImage: images.city,
  kicker: "Worldwide access",
  title: "Remarkable homes, beyond Los Angeles.",
  note: "A considered international collection presented through trusted independent advisors.",
  searchPlaceholder: "Country, city or keyword",
};
