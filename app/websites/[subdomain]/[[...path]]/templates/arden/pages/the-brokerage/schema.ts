import { z } from "zod";

import { images } from "../../catalog-defaults";

export const ArdenBrokerageContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  cities: z.array(z.string()),
  splitEyebrow: z.string(),
  splitTitle: z.string(),
  splitCopy: z.array(z.string()),
  splitImage: z.string(),
});

export type ArdenBrokerageContent = z.infer<typeof ArdenBrokerageContentSchema>;

export const ardenBrokerageDefaultContent: ArdenBrokerageContent = {
  eyebrow: "Our Network",
  title: "The Brokerage",
  intro:
    "Independent in approach, international in reach. Arden Vale + Co. collaborates with a hand-selected network of leading advisors across the world's most important residential markets.",
  cities: [
    "NEW YORK",
    "LONDON",
    "SAN FRANCISCO",
    "PARIS",
    "LOS ANGELES",
    "ASPEN",
    "PALM BEACH",
    "MEXICO CITY",
  ],
  splitEyebrow: "Local service, wider reach",
  splitTitle: "A network built around the client.",
  splitCopy: [
    "Our referral and co-brokerage relationships give buyers and sellers direct access to trusted specialists far beyond Wine Country, without sacrificing the personal service of a boutique team.",
    "For sellers, that network becomes a distribution channel. For buyers, it becomes access.",
  ],
  splitImage: images.pool,
};
