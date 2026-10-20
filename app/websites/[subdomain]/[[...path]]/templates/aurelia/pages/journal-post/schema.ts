import { z } from "zod";

export const AureliaJournalPostContentSchema = z.object({
  backLabel: z.string(),
  backHref: z.string(),
});

export type AureliaJournalPostContent = z.infer<typeof AureliaJournalPostContentSchema>;

export const aureliaJournalPostDefaultContent: AureliaJournalPostContent = {
  backLabel: "Back to journal",
  backHref: "/journal",
};
