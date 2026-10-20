import { z } from "zod";

export const ValeJournalContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  introCopy: z.string(),
  readLabel: z.string(),
});

export type ValeJournalContent = z.infer<typeof ValeJournalContentSchema>;

export const valeJournalDefaultContent: ValeJournalContent = {
  eyebrow: "Journal",
  titleLine1: "Perspective,",
  titleEmphasis: "not noise.",
  introCopy:
    "Notes on property, presentation, buying well, and the quieter details that shape a good real estate decision.",
  readLabel: "Read note ↗",
};
