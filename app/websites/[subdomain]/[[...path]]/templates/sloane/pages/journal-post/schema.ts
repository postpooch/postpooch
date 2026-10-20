import { z } from "zod";

export const SloaneJournalPostContentSchema = z.object({});

export type SloaneJournalPostContent = z.infer<typeof SloaneJournalPostContentSchema>;

export const sloaneJournalPostDefaultContent: SloaneJournalPostContent = {};
