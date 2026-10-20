import { z } from "zod";

export const VossNewDevelopmentsContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  intro: z.string(),
  buyersEyebrow: z.string(),
  buyersTitle: z.string(),
  buyersBody: z.string(),
  demoTag: z.string(),
  developersEyebrow: z.string(),
  developersTitleLine1: z.string(),
  developersTitleEmphasis: z.string(),
  developersBody: z.string(),
  developersCtaLabel: z.string(),
  developersCtaHref: z.string(),
});

export type VossNewDevelopmentsContent = z.infer<
  typeof VossNewDevelopmentsContentSchema
>;

export const vossNewDevelopmentsDefaultContent: VossNewDevelopmentsContent = {
  eyebrow: "New development",
  titleLine1: "Buy the building,",
  titleEmphasis: "not the brochure.",
  intro:
    "Sponsor product rewards careful comparison. Mara helps buyers evaluate the details behind the rendering: floor plan quality, exposure, sponsor track record, carrying costs, concessions and long-term resale logic.",
  buyersEyebrow: "For buyers",
  buyersTitle: "Independent advice in a sponsor's sales room.",
  buyersBody:
    "New development can be compelling — and unusually difficult to compare. The work here is to separate genuine product advantages from launch language, negotiate where leverage exists, and model the purchase beyond move-in day.",
  demoTag: "Concept project for design demonstration",
  developersEyebrow: "For developers",
  developersTitleLine1: "Residential strategy",
  developersTitleEmphasis: "before launch.",
  developersBody:
    "For select projects, the practice can support competitive research, unit-mix thinking, pricing logic, buyer feedback loops and a sharper point of view on how the product meets the market.",
  developersCtaLabel: "Discuss a project",
  developersCtaHref: "/contact",
};
