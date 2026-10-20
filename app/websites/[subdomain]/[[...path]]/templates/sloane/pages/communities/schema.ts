import { z } from "zod";

export const SloaneCommunitiesContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
});

export type SloaneCommunitiesContent = z.infer<typeof SloaneCommunitiesContentSchema>;

export const sloaneCommunitiesDefaultContent: SloaneCommunitiesContent = {
  eyebrow: "Communities",
  title: "Los Angeles, neighborhood by neighborhood.",
  intro:
    "Explore the character, architecture, and residential patterns of the markets Sloane knows most closely.",
};
