import { z } from "zod";

export const SloanePressContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
});

export type SloanePressContent = z.infer<typeof SloanePressContentSchema>;

export const sloanePressDefaultContent: SloanePressContent = {
  eyebrow: "Press",
  title: "Media, market commentary, and selected features.",
  intro:
    "Selected editorial coverage and conversations about design, luxury residential real estate, and Los Angeles market behavior.",
};
