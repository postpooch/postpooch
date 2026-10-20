import { z } from "zod";

export const MilaDienstenContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  lead: z.string(),
  cardCta: z.string(),
});

export type MilaDienstenContent = z.infer<typeof MilaDienstenContentSchema>;

export const milaDienstenDefaultContent: MilaDienstenContent = {
  eyebrow: "Services",
  titleLine1: "One broker.",
  titleEmphasis: "Three clear roles.",
  lead: "Whether you are selling, buying, or first want to know your home’s value: you get personal advice, a clear strategy, and direct contact.",
  cardCta: "See the approach",
};
