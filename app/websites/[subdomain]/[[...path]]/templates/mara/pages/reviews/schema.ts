import { z } from "zod";

export const MaraReviewsContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroCopy: z.string(),
  heroImage: z.string(),
});

export type MaraReviewsContent = z.infer<typeof MaraReviewsContentSchema>;

export const maraReviewsDefaultContent: MaraReviewsContent = {
  heroEyebrow: "Client stories",
  heroTitle: "The work is personal. The results should feel that way too.",
  heroCopy:
    "A few fictional sample testimonials showing how a single-agent practice can present trust without turning the page into a wall of star ratings.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/14/147e6e626a94d6cd791d3c2339b59008ae5d0a3e4c7fff64bde065a5a8091046.avif",
};
