import { z } from "zod";

export const LuxuryPressContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  logos: z.array(z.string()),
  listEyebrow: z.string(),
  listTitle: z.string(),
});

export type LuxuryPressContent = z.infer<typeof LuxuryPressContentSchema>;

export const luxuryPressDefaultContent: LuxuryPressContent = {
  heroEyebrow: "AS SEEN IN",
  heroTitle: "Selected Press",
  heroSubtitle:
    "Recognition, market commentary, and exceptional properties featured in leading publications.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/b9/b9b5b108e0d0c5343299e64fd71452110cff0a590e55c982151b79bfed6ba13f.avif",
  logos: [
    "ARCHITECTURAL DIGEST",
    "THE WALL STREET JOURNAL",
    "MANSION GLOBAL",
    "DWELL",
    "ROBB REPORT",
    "BUSINESS JOURNAL",
  ],
  listEyebrow: "IN THE NEWS",
  listTitle: "Recent features and recognition.",
};
