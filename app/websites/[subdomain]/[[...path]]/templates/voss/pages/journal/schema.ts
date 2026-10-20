import { z } from "zod";

export const VossJournalContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  cardExcerpt: z.string(),
  readLabel: z.string(),
});

export type VossJournalContent = z.infer<typeof VossJournalContentSchema>;

export const vossJournalDefaultContent: VossJournalContent = {
  eyebrow: "Market notes & perspective",
  titleLine1: "Useful opinions.",
  titleEmphasis: "Minimal noise.",
  cardExcerpt:
    "A concise editorial preview lives here. Connect this card to a CMS-backed article route when the agent is ready to publish ongoing market commentary.",
  readLabel: "Read the note",
};
