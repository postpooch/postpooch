import { z } from "zod";

export const HarborJournalContentSchema = z.object({
  heroKicker: z.string(),
  heroTitleBefore: z.string(),
  heroTitleItalic: z.string(),
  heroBody: z.string(),
});

export type HarborJournalContent = z.infer<typeof HarborJournalContentSchema>;

export const harborJournalDefaultContent: HarborJournalContent = {
  heroKicker: "The journal",
  heroTitleBefore: "Market notes for people who prefer",
  heroTitleItalic: "useful over noisy.",
  heroBody:
    "Practical perspective on buying, selling, neighbourhoods, property types, and the decisions behind the move.",
};
