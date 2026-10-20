import { z } from "zod";

export const RoweJournalEntryContentSchema = z.object({
  imageAlt: z.string(),
  writtenByLabel: z.string(),
  editorialNote: z.string(),
  backLabel: z.string(),
  backHref: z.string(),
});

export type RoweJournalEntryContent = z.infer<
  typeof RoweJournalEntryContentSchema
>;

export const roweJournalEntryDefaultContent: RoweJournalEntryContent = {
  imageAlt: "Residential architecture",
  writtenByLabel: "Written by",
  editorialNote:
    "This editorial content is sample copy for the starter project and should be adapted to your agent’s market, compliance requirements, and actual point of view.",
  backLabel: "Back to journal",
  backHref: "/journal",
};
