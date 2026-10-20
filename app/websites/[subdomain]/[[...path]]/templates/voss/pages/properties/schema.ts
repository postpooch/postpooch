import { z } from "zod";

export const VossPropertiesContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  intro: z.string(),
});

export type VossPropertiesContent = z.infer<typeof VossPropertiesContentSchema>;

export const vossPropertiesDefaultContent: VossPropertiesContent = {
  eyebrow: "Current portfolio",
  titleLine1: "Exceptional addresses.",
  titleEmphasis: "No filler.",
  intro:
    "A curated selection of public and private opportunities across Manhattan. Contact Mara for off-market inventory and active buyer searches.",
};
