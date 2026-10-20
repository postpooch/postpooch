import { z } from "zod";

export const NorthpineAgentContentSchema = z.object({
  heroEyebrow: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  roleEyebrow: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
  bioTitle: z.string(),
  bioBody: z.string(),
});

export type NorthpineAgentContent = z.infer<typeof NorthpineAgentContentSchema>;

export const northpineAgentDefaultContent: NorthpineAgentContent = {
  heroEyebrow: "MEET THE TEAM",
  heroSubtitle: "A mountain-market advisor with a design eye and a practical approach.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/eb/ebb292405b3c64bb747542a8f58083e39c131b83e29e54b41d4799920bdaaefc.avif",
  roleEyebrow: "BROKER · REALTOR®",
  ctaLabel: "Work With Avery",
  ctaHref: "/contact",
  bioTitle: "Local knowledge is more than knowing street names.",
  bioBody:
    "It is knowing which ridges keep their view, which roads feel easy after dark, where rental rules differ, how well and septic systems shape ownership, and why two cabins with the same square footage can live completely differently.",
};
