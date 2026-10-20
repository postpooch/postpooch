import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalGuideContentSchema = z.object({
  processTitle: z.string(),
  processBody: z.string(),
  quote: z.string(),
  focusTitle: z.string(),
  focusItems: z.array(z.string()).min(1),
  heroImage: z.string(),
});

export type CoastalGuideContent = z.infer<typeof CoastalGuideContentSchema>;

export const coastalBuyDefaultContent: CoastalGuideContent = {
  processTitle: "A thoughtful process creates better decisions.",
  processBody:
    "High-value real estate decisions benefit from clear sequencing. Rather than reacting to each new detail, we define the objective, identify the information that matters, and make each decision in context.",
  quote: "Good representation should make a complex transaction feel more understandable, not more complicated.",
  focusTitle: "What we focus on",
  focusItems: [
    "Decision criteria and timing",
    "Financial and contractual leverage",
    "Property-specific risk and opportunity",
    "Communication and next actions",
  ],
  heroImage: images.interior,
};

export const coastalSellDefaultContent: CoastalGuideContent = {
  ...coastalBuyDefaultContent,
};

export const coastalFinancingDefaultContent: CoastalGuideContent = {
  ...coastalBuyDefaultContent,
};
