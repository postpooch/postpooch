import { z } from "zod";

export const NathanInsightContentSchema = z.object({
  asideLabel: z.string(),
  authorPrefix: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  backLabel: z.string(),
  backHref: z.string(),
});

export type NathanInsightContent = z.infer<typeof NathanInsightContentSchema>;

export const nathanInsightDefaultContent: NathanInsightContent = {
  asideLabel: "FIELD NOTE",
  authorPrefix: "By",
  ctaLabel: "Discuss what this means for your move →",
  ctaHref: "/contact",
  backLabel: "← Back to all insights",
  backHref: "/insights",
};
