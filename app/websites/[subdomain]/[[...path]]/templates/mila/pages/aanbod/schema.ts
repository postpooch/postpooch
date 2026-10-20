import { z } from "zod";

export const MilaAanbodContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  lead: z.string(),
});

export type MilaAanbodContent = z.infer<typeof MilaAanbodContentSchema>;

export const milaAanbodDefaultContent: MilaAanbodContent = {
  eyebrow: "Listings",
  titleLine1: "Homes that",
  titleEmphasis: "are worth it.",
  lead: "Current listings and a selection of recently guided homes in Utrecht and the surrounding area.",
};
