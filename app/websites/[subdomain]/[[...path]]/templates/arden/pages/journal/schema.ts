import { z } from "zod";

import { images } from "../../catalog-defaults";
import { SimpleHeroContentSchema } from "../simple-schema";

export const ArdenJournalContentSchema = SimpleHeroContentSchema;
export type ArdenJournalContent = import("../simple-schema").SimpleHeroContent;
export const ardenJournalDefaultContent: ArdenJournalContent = {
  heroEyebrow: "Journal",
  heroTitle: "Ideas for Wine Country Living",
  heroSubtitle:
    "Market perspective, property strategy, and a closer look at the places we call home.",
  heroImage: images.pool,
};

export const ArdenJournalPostContentSchema = z.object({
  byline: z.string(),
});
export type ArdenJournalPostContent = z.infer<typeof ArdenJournalPostContentSchema>;
export const ardenJournalPostDefaultContent: ArdenJournalPostContent = {
  byline: "Arden Vale + Co.",
};
