import { z } from "zod";

export const LuxuryContactContentSchema = z.object({
  imageEyebrow: z.string(),
  imageTitle: z.string(),
  formEyebrow: z.string(),
  formTitle: z.string(),
  formIntro: z.string(),
});

export type LuxuryContactContent = z.infer<typeof LuxuryContactContentSchema>;

export const luxuryContactDefaultContent: LuxuryContactContent = {
  imageEyebrow: "PRIVATE REPRESENTATION",
  imageTitle: "Let's begin.",
  formEyebrow: "GET IN TOUCH",
  formTitle: "How can we assist you?",
  formIntro:
    "Share a little about your plans. This demo form is ready to connect to an API route, CRM, Supabase table, or email provider.",
};
