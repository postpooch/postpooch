import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AveryBuyersGuideContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSub: z.string(),
  heroImage: z.string(),
  processKicker: z.string(),
  processTitle: z.string(),
  processNote: z.string(),
});

export type AveryBuyersGuideContent = z.infer<typeof AveryBuyersGuideContentSchema>;

export const averyBuyersGuideDefaultContent: AveryBuyersGuideContent = {
  heroKicker: "For buyers",
  heroTitle: "Buying in New York",
  heroSub: "A practical guide to a market that has its own language, process, and pace.",
  heroImage: images.city3,
  processKicker: "The process",
  processTitle: "Complex, not mysterious.",
  processNote: "A good process makes room for emotion without letting it run the transaction.",
};
