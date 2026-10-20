import { z } from "zod";

const ValueSchema = z.object({
  number: z.string(),
  title: z.string(),
  text: z.string(),
});

export const VossAboutContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitleLine1: z.string(),
  heroTitleEmphasis: z.string(),
  heroDeck: z.string(),
  portraitImage: z.string(),
  portraitLabel: z.string(),
  approachEyebrow: z.string(),
  leadSerif: z.string(),
  storyColumns: z.array(z.string()).min(1),
  values: z.array(ValueSchema).min(1),
  pressEyebrow: z.string(),
  pressNames: z.array(z.string()).min(1),
  pressDisclaimer: z.string(),
  closingEyebrow: z.string(),
  closingQuote: z.string(),
  closingCtaLabel: z.string(),
  closingCtaHref: z.string(),
});

export type VossAboutContent = z.infer<typeof VossAboutContentSchema>;

export const vossAboutDefaultContent: VossAboutContent = {
  heroEyebrow: "About Mara",
  heroTitleLine1: "A broker's rigor.",
  heroTitleEmphasis: "An editor's eye.",
  heroDeck:
    "Mara built her practice around a simple idea: clients deserve advice that is more selective than the market itself.",
  portraitImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/1c/1cffa5dc69e8edc590b371e019252bbfb77b0b3a18487615068e4b0b9fdccbaf.avif",
  portraitLabel: "New York · Since 2012",
  approachEyebrow: "The approach",
  leadSerif:
    "Mara is a fictional demo agent created for this website concept. Her positioning is intentionally specific: private, direct representation for design-aware buyers and sellers navigating New York at the high end.",
  storyColumns: [
    "The real version of this page should tell the agent's actual story with concrete proof points: where they have real expertise, how they advise differently, what clients can expect during a search or sale, and which credentials matter.",
    "Rather than stacking generic superlatives, the site is designed to let the work feel confident through restraint — fewer claims, more specificity, and photography that carries emotional weight.",
  ],
  values: [
    {
      number: "01",
      title: "Curate before you show.",
      text: "Time is a luxury. A search should get sharper as it goes, not wider.",
    },
    {
      number: "02",
      title: "Tell the difficult truth early.",
      text: "Bad light, weak resale, noisy mechanicals — useful advice includes what not to buy.",
    },
    {
      number: "03",
      title: "Position, don't decorate.",
      text: "A listing wins because its story, price, audience and launch sequence work together.",
    },
  ],
  pressEyebrow: "As featured / affiliations",
  pressNames: [
    "ARCHITECTURAL DIGEST",
    "WSJ",
    "THE REAL DEAL",
    "MANSION GLOBAL",
    "REBNY",
  ],
  pressDisclaimer:
    "Placeholder press names for layout only. Remove or replace with the agent's verified features and memberships.",
  closingEyebrow: "A note from Mara",
  closingQuote:
    "“The right home is not the one with the longest amenity list. It's the one that makes your life make more sense.”",
  closingCtaLabel: "Start a conversation",
  closingCtaHref: "/contact",
};
