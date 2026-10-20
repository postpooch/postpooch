import { z } from "zod";

export const NorthpineSitemapContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type NorthpineSitemapContent = z.infer<typeof NorthpineSitemapContentSchema>;

export const northpineSitemapDefaultContent: NorthpineSitemapContent = {
  heroTitle: "Sitemap",
  heroSubtitle: "Explore every major section of the Northpine template.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/eb/ebb292405b3c64bb747542a8f58083e39c131b83e29e54b41d4799920bdaaefc.avif",
};
