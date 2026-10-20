import { z } from "zod";

import { images } from "../../catalog-defaults";

export const CoastalJournalContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  readLabel: z.string(),
});

export type CoastalJournalContent = z.infer<typeof CoastalJournalContentSchema>;

export const coastalJournalDefaultContent: CoastalJournalContent = {
  heroEyebrow: "Journal",
  heroTitle: "Ideas, Market Notes & Local Perspective",
  heroImage: images.journal,
  readLabel: "Read Article →",
};
