import { z } from "zod";

export const ElenaJournalContentSchema = z.object({
  label: z.string(),
  title: z.string(),
  subtext: z.string(),
});

export type ElenaJournalContent = z.infer<typeof ElenaJournalContentSchema>;

export const elenaJournalDefaultContent: ElenaJournalContent = {
  label: "Journal",
  title: "Notes from the market.",
  subtext:
    "A quieter record of neighborhoods, representation, and the work of making an important move.",
};

export const ElenaJournalPostContentSchema = z.object({
  backLabel: z.string(),
});

export type ElenaJournalPostContent = z.infer<typeof ElenaJournalPostContentSchema>;

export const elenaJournalPostDefaultContent: ElenaJournalPostContent = {
  backLabel: "All notes",
};
