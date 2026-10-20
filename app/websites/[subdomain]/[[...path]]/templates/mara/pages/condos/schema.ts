import { z } from "zod";

export const MaraCondosContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroCopy: z.string(),
  heroImage: z.string(),
  introEyebrow: z.string(),
  introTitle: z.string(),
  introBody: z.string(),
});

export type MaraCondosContent = z.infer<typeof MaraCondosContentSchema>;

export const maraCondosDefaultContent: MaraCondosContent = {
  heroEyebrow: "Condo collection",
  heroTitle: "Buildings worth knowing.",
  heroCopy:
    "A selective guide to established, design-forward and full-service condominium addresses across central Toronto.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/f9/f9e1280cde6bc477293a9db3c849e052b4b9b928c8bbb05779ff0287496c5cfc.avif",
  introEyebrow: "Beyond the amenity list",
  introTitle: "Good condo advice is building-specific.",
  introBody:
    "Management, reserve funds, floor plate, ceiling height, exposure, elevator count, staff, suite layouts and renovation history all matter. These profiles are designed to help buyers understand the character of a building before a unit comes to market.",
};
