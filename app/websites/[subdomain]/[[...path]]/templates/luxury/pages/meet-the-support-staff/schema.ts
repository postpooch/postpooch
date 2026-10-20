import { z } from "zod";

export const LuxuryTeamContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  heroImage: z.string(),
  introEyebrow: z.string(),
  introText: z.string(),
});

export type LuxuryTeamContent = z.infer<typeof LuxuryTeamContentSchema>;

export const luxuryTeamDefaultContent: LuxuryTeamContent = {
  heroEyebrow: "COLLABORATIVE BY DESIGN",
  heroTitle: "Meet the Team",
  heroSubtitle:
    "A focused group supporting every detail of the client experience.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/29/29ece833dd365c9e9dfa7cac0e5227f0e2c1986df094b2022266a232fcc0ddcd.avif",
  introEyebrow: "PERSONAL SERVICE, FULL SUPPORT",
  introText:
    "Add or remove team members in website settings. The grid adapts automatically.",
};
