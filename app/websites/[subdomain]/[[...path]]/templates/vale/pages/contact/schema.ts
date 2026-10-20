import { z } from "zod";

export const ValeContactContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  intro: z.string(),
});

export type ValeContactContent = z.infer<typeof ValeContactContentSchema>;

export const valeContactDefaultContent: ValeContactContent = {
  eyebrow: "Contact",
  titleLine1: "Let’s talk about",
  titleEmphasis: "what comes next.",
  intro:
    "Whether you are six months out or ready to move now, a good first conversation is useful.",
};
