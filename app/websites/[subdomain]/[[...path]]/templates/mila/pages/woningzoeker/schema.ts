import { z } from "zod";

export const MilaWoningzoekerContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitleLine1: z.string(),
  heroTitleEmphasis: z.string(),
  heroBody: z.string(),
  heroImage: z.string(),
  formEyebrow: z.string(),
  formTitle: z.string(),
  formBody: z.string(),
});

export type MilaWoningzoekerContent = z.infer<typeof MilaWoningzoekerContentSchema>;

export const milaWoningzoekerDefaultContent: MilaWoningzoekerContent = {
  heroEyebrow: "Home seeker",
  heroTitleLine1: "See new listings",
  heroTitleEmphasis: "before you scroll forever.",
  heroBody:
    "Tell me what you are looking for. I keep you focused on matching homes — including properties first shared within my network.",
  heroImage:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/ef/ef1b0720a48738e2811260bcb76c81ad8668d9493f002bb0ce36dd1be3ca7330.avif",
  formEyebrow: "Your living profile",
  formTitle: "Make your wishes concrete.",
  formBody:
    "The sharper your profile, the more relevant what I send. You are not locked in and can unsubscribe anytime.",
};
