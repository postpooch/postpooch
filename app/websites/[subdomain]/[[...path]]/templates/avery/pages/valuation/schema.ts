import { z } from "zod";

import { images } from "../../catalog-defaults";

export const AveryValuationContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSub: z.string(),
  heroImage: z.string(),
  boxKicker: z.string(),
  boxTitle: z.string(),
  boxBody: z.string(),
  contextKicker: z.string(),
  contextTitle: z.string(),
  contextNote: z.string(),
  columns: z.array(z.object({ title: z.string(), body: z.string() })).min(1),
});

export type AveryValuationContent = z.infer<typeof AveryValuationContentSchema>;

export const averyValuationDefaultContent: AveryValuationContent = {
  heroKicker: "For sellers",
  heroTitle: "What is your home worth?",
  heroSub:
    "A thoughtful valuation considers the property, the competition, the likely buyer, and the moment in the market.",
  heroImage: images.interior,
  boxKicker: "Private valuation request",
  boxTitle: "Start with your address.",
  boxBody:
    "We will review recent relevant sales, current competition, condition, building context, and the strategic choices that may influence your result.",
  contextKicker: "More than an algorithm",
  contextTitle: "Value is contextual.",
  contextNote:
    "Automated estimates are a starting point. New York apartments often require more judgment.",
  columns: [
    {
      title: "Building",
      body: "Line, floor, exposure, renovation, maintenance, building financials, amenities, and recent in-building trades all shape value.",
    },
    {
      title: "Market",
      body: "Active competition and recently signed contracts often tell a more useful story than closed sales from six months ago.",
    },
    {
      title: "Positioning",
      body: "Preparation, pricing architecture, launch timing, and presentation can materially affect the buyer response you create.",
    },
  ],
};
