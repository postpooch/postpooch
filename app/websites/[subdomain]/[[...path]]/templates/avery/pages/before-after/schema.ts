import { z } from "zod";

export const AveryBeforeAfterContentSchema = z.object({
  heroKicker: z.string(),
  heroTitle: z.string(),
  heroSub: z.string(),
});

export type AveryBeforeAfterContent = z.infer<typeof AveryBeforeAfterContentSchema>;

export const averyBeforeAfterDefaultContent: AveryBeforeAfterContent = {
  heroKicker: "Preparation",
  heroTitle: "Before & after",
  heroSub: "Strategic edits that help buyers see the home, not the work.",
};
