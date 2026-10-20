import { z } from "zod";

export const ValeHomeContentSchema = z.object({
  heroImage: z.string(),
  heroEyebrowSuffix: z.string(),
  heroTitleLine1: z.string(),
  heroTitleEmphasis: z.string(),
  heroSubtext: z.string(),
  heroCtaLabel: z.string(),
  heroCtaHref: z.string(),
  heroIndexCurrent: z.string(),
  heroIndexTotal: z.string(),
  manifestoEyebrow: z.string(),
  manifestoText: z.string(),
  manifestoAside: z.string(),
  manifestoCtaLabel: z.string(),
  manifestoCtaHref: z.string(),
  featuredEyebrow: z.string(),
  featuredTitle: z.string(),
  featuredCtaLabel: z.string(),
  agentPhoto: z.string(),
  agentEyebrow: z.string(),
  agentTitle: z.string(),
  agentBody: z.string(),
  agentCtaLabel: z.string(),
  journalEyebrow: z.string(),
  journalTitle: z.string(),
  journalCtaLabel: z.string(),
});

export type ValeHomeContent = z.infer<typeof ValeHomeContentSchema>;

export const valeHomeDefaultContent: ValeHomeContent = {
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/c0/c09e1c30224de4db60ea297b3029896c7c0fb6f42701b2a901c3038ed694acb8.avif",
  heroEyebrowSuffix: "Residential real estate",
  heroTitleLine1: "Homes with",
  heroTitleEmphasis: "a point of view.",
  heroSubtext:
    "Thoughtful representation for buying and selling exceptional homes along the coast.",
  heroCtaLabel: "Meet Mara",
  heroCtaHref: "/about",
  heroIndexCurrent: "01",
  heroIndexTotal: "04",
  manifestoEyebrow: "The approach",
  manifestoText:
    "Real estate is personal. The work should feel that way too. I pair market fluency with a design-minded eye to help clients recognize value, prepare beautifully, and move with clarity.",
  manifestoAside: "One advisor from first conversation to closing.",
  manifestoCtaLabel: "How I work",
  manifestoCtaHref: "/services",
  featuredEyebrow: "Selected properties",
  featuredTitle: "Current & recent",
  featuredCtaLabel: "View all",
  agentPhoto:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/08/08e2a796ec5ca813aac8d53ae940a2e186ec378b245043f1119e507aa5115979.avif",
  agentEyebrow: "Meet your advisor",
  agentTitle: "A calm hand in a high-stakes process.",
  agentBody:
    "I built my practice around a simple idea: clients make better decisions when they have good information, a strong point of view, and space to think. My role is to provide all three.",
  agentCtaLabel: "About Mara",
  journalEyebrow: "Journal",
  journalTitle: "Notes from the field",
  journalCtaLabel: "All notes",
};
