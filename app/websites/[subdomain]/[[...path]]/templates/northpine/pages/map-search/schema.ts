import { z } from "zod";

export const NorthpineMapSearchContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type NorthpineMapSearchContent = z.infer<typeof NorthpineMapSearchContentSchema>;

export const northpineMapSearchDefaultContent: NorthpineMapSearchContent = {
  heroTitle: "Map Search",
  heroSubtitle: "Search the mountains by location, price and property type.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/e1/e186c6737218616be09381716f8708501695aad3ae41c4945f0dc0b0f8b72ae2.avif",
};
