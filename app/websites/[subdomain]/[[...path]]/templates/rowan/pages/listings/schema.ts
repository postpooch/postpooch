import { z } from "zod";

export const RowanListingsContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  titleEmphasis: z.string(),
  meta: z.string(),
});

export type RowanListingsContent = z.infer<typeof RowanListingsContentSchema>;

export const rowanListingsDefaultContent: RowanListingsContent = {
  eyebrow: "Current opportunities",
  title: "Homes worth",
  titleEmphasis: "looking closer at.",
  meta: "Architectural homes, mountain residences and private estates selected for setting, design and character.",
};
