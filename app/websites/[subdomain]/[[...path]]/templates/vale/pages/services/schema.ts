import { z } from "zod";

export const ValeServicesContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  introCopy: z.string(),
  image: z.string(),
  imageCaption: z.string(),
  imageNote: z.string(),
  discussCtaLabel: z.string(),
});

export type ValeServicesContent = z.infer<typeof ValeServicesContentSchema>;

export const valeServicesDefaultContent: ValeServicesContent = {
  eyebrow: "Services",
  titleLine1: "Advice for the",
  titleEmphasis: "whole move.",
  introCopy:
    "From the first what-if conversation to the final signature, the work is structured to make complex decisions feel clear.",
  image:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/22/228c1262f11ff6aceeea884710e3f1ddeb5777616e8787af74c8cc785ea2d6cc.avif",
  imageCaption: "Every engagement is tailored.",
  imageNote: "No package theater. No unnecessary handoffs.",
  discussCtaLabel: "Discuss your plans",
};
