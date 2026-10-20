import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AveryConciergeContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSub: z.string(),
  heroImage: z.string(),
  leadKicker: z.string(),
  leadTitle: z.string(),
  leadBody: z.array(z.string()).min(1),
  ctaLabel: z.string(),
  stepsKicker: z.string(),
});

export type AveryConciergeContent = z.infer<typeof AveryConciergeContentSchema>;

export const averyConciergeDefaultContent: AveryConciergeContent = {
  heroKicker: "Seller services",
  heroTitle: "Private client services",
  heroSub: "A coordinated path from ‘not ready to list’ to market-ready.",
  heroImage: images.kitchen,
  leadKicker: "Preparation without chaos",
  leadTitle: "One strategy. The right specialists.",
  leadBody: [
    "For homes that need more than a photographer, Avery coordinates a trusted network of stagers, painters, organizers, contractors, movers, storage teams, and creative partners.",
    "The scope is tailored to the likely return. Sometimes the answer is a renovation. More often, it is editing, repair, paint, lighting, and decisive staging.",
  ],
  ctaLabel: "Discuss your property",
  stepsKicker: "How it works",
};
