import { z } from "zod";

export const NorthpinePublicServicesContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type NorthpinePublicServicesContent = z.infer<
  typeof NorthpinePublicServicesContentSchema
>;

export const northpinePublicServicesDefaultContent: NorthpinePublicServicesContent = {
  heroTitle: "Public Services",
  heroSubtitle: "A practical starting point for getting oriented after a move.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/61/61e4795a98c262ec429a4e9fc02bbf6de30eeb0c6213297a202eea4d4e9284fb.avif",
};
