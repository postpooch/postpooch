import { z } from "zod";

export const RoweJournalContentSchema = z.object({
  label: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  deck: z.string(),
  imageAlt: z.string(),
});

export type RoweJournalContent = z.infer<typeof RoweJournalContentSchema>;

export const roweJournalDefaultContent: RoweJournalContent = {
  label: "Journal / Market & design",
  titleLine1: "Notes from",
  titleEmphasis: "inside the market.",
  deck: "Short perspectives on pricing, presentation, architecture, and the decisions surrounding a move.",
  imageAlt: "Residential architecture",
};
