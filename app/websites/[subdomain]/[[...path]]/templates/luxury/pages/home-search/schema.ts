import { z } from "zod";

export const LuxuryHomeSearchContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type LuxuryHomeSearchContent = z.infer<
  typeof LuxuryHomeSearchContentSchema
>;

export const luxuryHomeSearchDefaultContent: LuxuryHomeSearchContent = {
  heroEyebrow: "FIND YOUR NEXT HOME",
  heroTitle: "Property Search",
  heroSubtitle:
    "A working front-end search interface ready to connect to your listings source.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/3a/3a69575e291b8a5ba281c0651b1ea1134a21c0e3475d85ba18fa2f31bac5e0aa.avif",
};
