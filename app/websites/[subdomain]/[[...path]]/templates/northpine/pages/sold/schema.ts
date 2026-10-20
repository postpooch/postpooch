import { z } from "zod";

export const NorthpineSoldContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type NorthpineSoldContent = z.infer<typeof NorthpineSoldContentSchema>;

export const northpineSoldDefaultContent: NorthpineSoldContent = {
  heroTitle: "Recently Sold",
  heroSubtitle: "A selection of recent North Georgia closings.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d8/d8c5af0d1f0348f27c2a73d5e496acb2d687fcf6d79c5441573d67078135f5a0.avif",
};
