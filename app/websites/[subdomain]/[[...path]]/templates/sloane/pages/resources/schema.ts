import { z } from "zod";

const ResourceCardSchema = z.object({
  num: z.string(),
  title: z.string(),
  text: z.string(),
  href: z.string(),
});

export const SloaneResourcesContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  cta: z.string(),
  cards: z.array(ResourceCardSchema).min(1),
});

export type SloaneResourcesContent = z.infer<typeof SloaneResourcesContentSchema>;

export const sloaneResourcesDefaultContent: SloaneResourcesContent = {
  eyebrow: "Resources",
  title: "Useful before you are ready.",
  intro: "Clear, concise guidance for the decisions that happen before a transaction becomes urgent.",
  cta: "Read the guide",
  cards: [
    {
      num: "01",
      title: "Buying with Sloane",
      text: "A practical framework for defining your search, evaluating value, and writing a competitive offer.",
      href: "/resources/buying",
    },
    {
      num: "02",
      title: "Preparing your finances",
      text: "How to prepare for a luxury purchase before the right property appears.",
      href: "/resources/financing",
    },
    {
      num: "03",
      title: "Selling with Sloane",
      text: "A design-led approach to preparation, positioning, launch strategy, and negotiation.",
      href: "/resources/selling",
    },
    {
      num: "04",
      title: "Property valuation",
      text: "Request a private opinion of value grounded in recent sales, current competition, and property-specific nuance.",
      href: "/resources/valuation",
    },
  ],
};
