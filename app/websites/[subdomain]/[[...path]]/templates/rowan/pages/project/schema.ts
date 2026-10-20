import { z } from "zod";

import { IMG } from "../../catalog-defaults";

export const RowanProjectContentSchema = z.object({
  summaryEyebrow: z.string(),
  editorialEyebrow: z.string(),
  editorialSecondaryImage: z.string(),
  interestCtaLabel: z.string(),
  interestCtaHref: z.string(),
  nextEyebrow: z.string(),
});

export type RowanProjectContent = z.infer<typeof RowanProjectContentSchema>;

export const rowanProjectDefaultContent: RowanProjectContent = {
  summaryEyebrow: "Project profile",
  editorialEyebrow: "The idea",
  editorialSecondaryImage: IMG.interior,
  interestCtaLabel: "I’m interested ↗",
  interestCtaHref: "/#contact",
  nextEyebrow: "Next project",
};
