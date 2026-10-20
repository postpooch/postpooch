import { z } from "zod";

export const NorthpineCommunitiesContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  kicker: z.string(),
  ctaLabel: z.string(),
});

export type NorthpineCommunitiesContent = z.infer<
  typeof NorthpineCommunitiesContentSchema
>;

export const northpineCommunitiesDefaultContent: NorthpineCommunitiesContent = {
  heroTitle: "Featured Communities",
  heroSubtitle: "Choose the part of the mountains that fits the way you want to live.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/eb/ebb292405b3c64bb747542a8f58083e39c131b83e29e54b41d4799920bdaaefc.avif",
  kicker: "COMMUNITY GUIDE",
  ctaLabel: "Explore area →",
};
