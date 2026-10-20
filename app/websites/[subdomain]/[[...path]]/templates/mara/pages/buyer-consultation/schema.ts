import { z } from "zod";

export const MaraBuyerConsultationContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  lead: z.string(),
  body: z.string(),
});

export type MaraBuyerConsultationContent = z.infer<
  typeof MaraBuyerConsultationContentSchema
>;

export const maraBuyerConsultationDefaultContent: MaraBuyerConsultationContent =
  {
    eyebrow: "Buyer consultation",
    title: "Before we look at homes, let’s define the life.",
    lead: "This conversation is where we turn preferences into a useful search strategy: neighbourhood, architecture, budget, timing, privacy, schools, commute, renovation appetite and what you want the next five years to feel like.",
    body: "No obligation. No automated drip campaign. Just a focused first conversation about whether I’m the right advisor for your move.",
  };
