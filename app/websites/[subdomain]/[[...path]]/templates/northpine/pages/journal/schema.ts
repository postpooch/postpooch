import { z } from "zod";

export const NorthpineJournalContentSchema = z.object({
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
});

export type NorthpineJournalContent = z.infer<typeof NorthpineJournalContentSchema>;

export const northpineJournalDefaultContent: NorthpineJournalContent = {
  heroTitle: "The Journal",
  heroSubtitle: "Market perspective, local guides and notes on mountain-home ownership.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/61/61e4795a98c262ec429a4e9fc02bbf6de30eeb0c6213297a202eea4d4e9284fb.avif",
};
