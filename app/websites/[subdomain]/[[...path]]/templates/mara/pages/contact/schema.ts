import { z } from "zod";

export const MaraContactContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
});

export type MaraContactContent = z.infer<typeof MaraContactContentSchema>;

export const maraContactDefaultContent: MaraContactContent = {
  eyebrow: "Contact Mara",
  title: "Let’s talk about what comes next.",
  intro:
    "Buying, selling, planning ahead, or simply trying to make sense of the market—I’m happy to begin with a private conversation.",
};
