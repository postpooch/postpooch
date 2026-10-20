import { z } from "zod";

export const VossContactContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  deck: z.string(),
  image: z.string(),
  imageAlt: z.string(),
  imageCaptionRight: z.string(),
});

export type VossContactContent = z.infer<typeof VossContactContentSchema>;

export const vossContactDefaultContent: VossContactContent = {
  eyebrow: "Private consultation",
  titleLine1: "What are you",
  titleEmphasis: "thinking about?",
  deck: "Buying, selling, or simply deciding what to do next — send a note and include as much or as little context as you like.",
  image:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d8/d8602121b4628ca463240cd4798797df10468c157ea50b545c201b0266488e51.avif",
  imageAlt: "New York City street",
  imageCaptionRight: "Private New York Real Estate",
};
