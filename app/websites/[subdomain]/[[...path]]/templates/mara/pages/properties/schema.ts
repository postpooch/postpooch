import { z } from "zod";

export const MaraPropertiesContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroCopy: z.string(),
  heroImage: z.string(),
  toolbarSuffix: z.string(),
});

export type MaraPropertiesContent = z.infer<typeof MaraPropertiesContentSchema>;

export const maraPropertiesDefaultContent: MaraPropertiesContent = {
  heroEyebrow: "Curated inventory",
  heroTitle: "Exceptional homes, selected with care.",
  heroCopy:
    "A mix of current listings, private offerings and recent sales across Toronto’s most enduring neighbourhoods.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/c0/c09e1c30224de4db60ea297b3029896c7c0fb6f42701b2a901c3038ed694acb8.avif",
  toolbarSuffix: "selected properties",
};
