import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalAboutContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  heading: z.string(),
  bodyOne: z.string(),
  bodyTwo: z.string(),
  ctaLabel: z.string(),
  filmsEyebrow: z.string(),
  filmsTitle: z.string(),
  films: z.array(z.object({ n: z.string(), title: z.string() })).min(1),
  filmImages: z.array(z.string()).min(1),
});

export type CoastalAboutContent = z.infer<typeof CoastalAboutContentSchema>;

export const coastalAboutDefaultContent: CoastalAboutContent = {
  heroEyebrow: "About",
  heroTitle: "Meet Alexandra",
  heroImage: images.media,
  heading: "Calm strategy. Exceptional presentation. Personal service.",
  bodyOne:
    "Her work is grounded in a simple idea: luxury service is not about adding noise. It is about making the right details feel effortless. That means candid advice, excellent creative, deep preparation, and a clear understanding of what matters to each client.",
  bodyTwo:
    "Across purchases, sales, and relocations, Alexandra coordinates specialists, marketing, due diligence, and negotiation while staying close to the human decisions behind the transaction.",
  ctaLabel: "Contact Alexandra",
  filmsEyebrow: "Selected Films",
  filmsTitle: "Property & Lifestyle Stories",
  films: [
    { n: "01", title: "Inside a Modern Harbor Home" },
    { n: "02", title: "Designing for Coastal Light" },
    { n: "03", title: "A Day in Newport Beach" },
  ],
  filmImages: [images.hero1, images.hero2, images.street],
};
