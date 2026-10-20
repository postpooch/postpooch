import { z } from "zod";

export const AtelierTeamContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
});

export type AtelierTeamContent = z.infer<typeof AtelierTeamContentSchema>;

export const atelierTeamDefaultContent: AtelierTeamContent = {
  heroEyebrow: "Atelier North",
  heroTitle: "Small team. Senior attention.",
  heroSubtitle:
    "A focused group spanning advisory, operations, and property storytelling.",
};
