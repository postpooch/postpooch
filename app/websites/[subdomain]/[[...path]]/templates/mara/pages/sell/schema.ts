import { z } from "zod";

const ServiceBlockSchema = z.object({
  number: z.string(),
  title: z.string(),
  copy: z.string(),
});

export const MaraServicePageContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroCopy: z.string(),
  heroImage: z.string(),
  approachEyebrow: z.string(),
  approachTitle: z.string(),
  approachBody: z.string(),
  blocks: z.array(ServiceBlockSchema).min(1),
  quote: z.string(),
  quoteAttribution: z.string(),
  nextEyebrow: z.string(),
  nextTitle: z.string(),
  nextBody: z.string(),
  nextImage: z.string(),
  primaryCtaLabel: z.string(),
  primaryCtaHref: z.string(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
  formTitle: z.string(),
});


export type MaraSellContent = z.infer<typeof MaraServicePageContentSchema>;
export const MaraSellContentSchema = MaraServicePageContentSchema;

export const maraSellDefaultContent: MaraSellContent = {
  heroEyebrow: "Bespoke seller representation",
  heroTitle: "Make the value of your home unmistakable.",
  heroCopy:
    "Thoughtful positioning, elevated presentation and disciplined negotiation for distinctive Toronto homes.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/50/5078b4e76a33543bab16333cc97b4a323d71c5f71edbcd331adf59a061583b0c.avif",
  approachEyebrow: "The approach",
  approachTitle: "A sale built around the property.",
  approachBody:
    "Distinctive homes need more than a standard marketing checklist. I build the strategy around what makes the property matter, then sequence every touchpoint so buyers understand that value quickly and emotionally.",
  blocks: [
    {
      number: "01",
      title: "Position before we promote.",
      copy: "We identify the most compelling reason to own your home, study its likely buyer, and build pricing around evidence, competition and real market behaviour.",
    },
    {
      number: "02",
      title: "Edit the home with intention.",
      copy: "Preparation is strategic. I focus attention on architecture, light, flow and the improvements that will genuinely change perception or value.",
    },
    {
      number: "03",
      title: "Create desire, not just exposure.",
      copy: "Editorial photography, cinematic video, precise copy, private outreach and targeted digital distribution build a campaign that feels appropriate to the property.",
    },
    {
      number: "04",
      title: "Control the negotiation.",
      copy: "Clear communication, disciplined follow-up and a strong read on buyer motivation keep momentum high while protecting your leverage.",
    },
  ],
  quote:
    "The best transaction is the one where you understand exactly why the decision makes sense.",
  quoteAttribution: "Mara Vale",
  nextEyebrow: "Next step",
  nextTitle: "Begin with a considered valuation.",
  nextBody:
    "I’ll look at the property, comparable evidence, likely buyer profile and the preparation that could materially influence your result.",
  nextImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/46/46593d401009cd82c8b99b88113df341d33bcae080d666f69c58d72b2d560dc7.avif",
  primaryCtaLabel: "Request a valuation",
  primaryCtaHref: "/valuation",
  formTitle: "Thinking about a sale?",
};
