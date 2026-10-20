import { z } from "zod";

export const HarborJournalPostContentSchema = z.object({
  imageAlt: z.string(),
  ctaTitle: z.string(),
  ctaLabel: z.string(),
  defaultBody: z.array(z.string()),
});

export type HarborJournalPostContent = z.infer<
  typeof HarborJournalPostContentSchema
>;

export const harborJournalPostDefaultContent: HarborJournalPostContent = {
  imageAlt: "Editorial real estate image",
  ctaTitle: "Have a question about your situation?",
  ctaLabel: "Ask Avery ↗",
  defaultBody: [
    "dropcap:The best real estate decisions usually come from context, not headlines. A market can be broadly slower while one street, property type, or price band still behaves very differently.",
    "## Start with the decision, not the noise.",
    "Before looking at averages, define what you are actually trying to decide. Are you choosing a list price, deciding whether to buy now, comparing two neighbourhoods, or weighing a renovation against a move? The useful data changes with the question.",
    "For sellers, the first days on market carry outsized importance because that is when the largest group of active buyers will see the property for the first time. For buyers, the key is separating cosmetic appeal from long-term value: location, lot, layout, building quality, carrying costs, and future resale.",
    "> Good strategy is specific to the property, the timing, and the people making the move.",
    "## Use comparable sales carefully.",
    "Comparable sales are evidence, not a formula. Condition, floor plan, parking, exposure, lot dimensions, renovation quality, building reputation, and even the competitive set available that week can materially affect what buyers will pay.",
    "This demo article is original placeholder copy designed to show the editorial system. Replace it with the agent’s actual expertise and local market commentary before launch.",
  ],
};
