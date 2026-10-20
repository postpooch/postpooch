import { z } from "zod";

export const HarborContactContentSchema = z.object({
  kicker: z.string(),
  titleBefore: z.string(),
  titleItalic: z.string(),
  body: z.string(),
});

export type HarborContactContent = z.infer<typeof HarborContactContentSchema>;

export const harborContactDefaultContent: HarborContactContent = {
  kicker: "Contact",
  titleBefore: "Let’s talk about",
  titleItalic: "your next move.",
  body: "Buying, selling, planning ahead, or simply trying to understand your options? Send a note. I’ll get back to you personally.",
};
