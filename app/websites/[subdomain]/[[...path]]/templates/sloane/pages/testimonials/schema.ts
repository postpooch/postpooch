import { z } from "zod";

export const SloaneTestimonialsContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
});

export type SloaneTestimonialsContent = z.infer<typeof SloaneTestimonialsContentSchema>;

export const sloaneTestimonialsDefaultContent: SloaneTestimonialsContent = {
  eyebrow: "Testimonials",
  title: "What clients remember after closing.",
  intro:
    "The strongest measure of representation is not a slogan. It is whether clients would choose the same advisor again.",
};
