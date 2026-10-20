import { z } from "zod";

export const NorthpineTestimonialsContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type NorthpineTestimonialsContent = z.infer<
  typeof NorthpineTestimonialsContentSchema
>;

export const northpineTestimonialsDefaultContent: NorthpineTestimonialsContent = {
  heroTitle: "Client Stories",
  heroSubtitle: "What thoughtful service looks like from the other side of the table.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/3d/3d3b1c895df50d8dfc8f97e8098e00293b7d5711d6cd0857d7cae6cadeeeaf05.avif",
};
