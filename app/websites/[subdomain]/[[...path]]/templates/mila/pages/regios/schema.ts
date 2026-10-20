import { z } from "zod";

export const MilaRegiosContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  lead: z.string(),
  cardCtaPrefix: z.string(),
});

export type MilaRegiosContent = z.infer<typeof MilaRegiosContentSchema>;

export const milaRegiosDefaultContent: MilaRegiosContent = {
  eyebrow: "Areas",
  titleLine1: "Local knowledge,",
  titleEmphasis: "at street level.",
  lead: "I work in Utrecht and the green municipalities around it. A compact working area means I can truly follow developments, price differences, and living quality.",
  cardCtaPrefix: "Explore",
};
