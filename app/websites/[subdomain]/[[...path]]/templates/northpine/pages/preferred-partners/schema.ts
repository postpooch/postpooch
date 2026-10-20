import { z } from "zod";

export const NorthpinePartnersContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  intro: z.string(),
});

export type NorthpinePartnersContent = z.infer<typeof NorthpinePartnersContentSchema>;

export const northpinePartnersDefaultContent: NorthpinePartnersContent = {
  heroTitle: "Preferred Partners",
  heroSubtitle:
    "A local bench of professionals to help before, during and after a real estate transaction.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/d8/d8c5af0d1f0348f27c2a73d5e496acb2d687fcf6d79c5441573d67078135f5a0.avif",
  intro:
    "These demo partners illustrate the kind of resource directory a premium agent site can provide. In production, populate this page from your platform's vendor/partner data.",
};
