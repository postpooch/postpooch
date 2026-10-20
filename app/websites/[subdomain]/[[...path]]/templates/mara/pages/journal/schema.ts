import { z } from "zod";

export const MaraJournalContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  intro: z.string(),
});

export type MaraJournalContent = z.infer<typeof MaraJournalContentSchema>;

export const maraJournalDefaultContent: MaraJournalContent = {
  eyebrow: "The journal",
  titleLine1: "Homes, design",
  titleEmphasis: "Toronto.",
  intro:
    "Notes on buying, selling, architecture, buildings and the small details that shape how a home lives.",
};
