import { z } from "zod";

export const NorthpinePackingContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type NorthpinePackingContent = z.infer<typeof NorthpinePackingContentSchema>;

export const northpinePackingDefaultContent: NorthpinePackingContent = {
  heroTitle: "Packing Tips",
  heroSubtitle: "A few systems that make packing faster and unpacking much easier.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/3d/3d3b1c895df50d8dfc8f97e8098e00293b7d5711d6cd0857d7cae6cadeeeaf05.avif",
};
