import { z } from "zod";

const MethodStepSchema = z.object({
  number: z.string(),
  title: z.string(),
  text: z.string(),
});

const ServiceLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  cta: z.string(),
});

export const VossServicesContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  intro: z.string(),
  methodEyebrow: z.string(),
  methodTitleLine1: z.string(),
  methodTitleLine2: z.string(),
  methodTitleEmphasis: z.string(),
  methodSteps: z.array(MethodStepSchema).min(1),
  links: z.array(ServiceLinkSchema).min(1),
});

export type VossServicesContent = z.infer<typeof VossServicesContentSchema>;

export const vossServicesDefaultContent: VossServicesContent = {
  eyebrow: "Representation, considered",
  titleLine1: "Strategy before",
  titleEmphasis: "square footage.",
  intro:
    "A full-service practice without the full-service sprawl. Mara stays directly involved from the first conversation through closing — and often well after.",
  methodEyebrow: "How the work moves",
  methodTitleLine1: "Research.",
  methodTitleLine2: "Position.",
  methodTitleEmphasis: "Execute.",
  methodSteps: [
    {
      number: "01",
      title: "Read the market",
      text: "Comparable sales, active competition, building history, buyer behavior and micro-location all shape the recommendation.",
    },
    {
      number: "02",
      title: "Make the plan",
      text: "Define the price, target, timing, narrative, negotiation range and decision points before the pressure starts.",
    },
    {
      number: "03",
      title: "Stay close",
      text: "Direct communication, concise reporting and one accountable advisor throughout the transaction.",
    },
  ],
  links: [
    {
      label: "New development advisory",
      href: "/new-developments",
      cta: "Explore ↗",
    },
    {
      label: "Closing cost field guide",
      href: "/guides/closing-costs",
      cta: "Read ↗",
    },
    {
      label: "Discuss a sale or search",
      href: "/contact",
      cta: "Contact ↗",
    },
  ],
};
