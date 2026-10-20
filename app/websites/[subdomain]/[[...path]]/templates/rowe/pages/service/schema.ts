import { z } from "zod";

export const RoweServiceContentSchema = z.object({
  labelPrefix: z.string(),
  imageAlt: z.string(),
  formatLabel: z.string(),
  durationLabel: z.string(),
  bestForLabel: z.string(),
  feeLabel: z.string(),
  bodyLabel: z.string(),
  includesTitle: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  otherLabel: z.string(),
});

export type RoweServiceContent = z.infer<typeof RoweServiceContentSchema>;

export const roweServiceDefaultContent: RoweServiceContent = {
  labelPrefix: "Services /",
  imageAlt: "Residential architecture",
  formatLabel: "Format",
  durationLabel: "Duration",
  bestForLabel: "Best for",
  feeLabel: "Fee",
  bodyLabel: "The engagement",
  includesTitle: "What it can include",
  ctaLabel: "Discuss this service",
  ctaHref: "/contact",
  otherLabel: "Other services",
};
