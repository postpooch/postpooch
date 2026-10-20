import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AureliaLeasesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  title: z.string(),
  note: z.string(),
});

export type AureliaLeasesContent = z.infer<typeof AureliaLeasesContentSchema>;

export const aureliaLeasesDefaultContent: AureliaLeasesContent = {
  heroEyebrow: "Residences for lease",
  heroTitle: "Featured Leases",
  heroSubtitle: "Exceptional homes for clients seeking flexibility without compromising quality.",
  heroImage: images.coast,
  kicker: "Lease collection",
  title: "Live exceptionally, for now.",
  note: "Long-term and select furnished opportunities across Beverly Hills, Bel Air and Malibu.",
};
