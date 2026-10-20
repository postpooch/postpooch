import { z } from "zod";

export const MilaContactContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  lead: z.string(),
  phoneLabel: z.string(),
  emailLabel: z.string(),
  officeLabel: z.string(),
  formKicker: z.string(),
});

export type MilaContactContent = z.infer<typeof MilaContactContentSchema>;

export const milaContactDefaultContent: MilaContactContent = {
  eyebrow: "Contact",
  titleLine1: "What are you",
  titleEmphasis: "thinking about?",
  lead: "A sale plan, a purchase question, or simply bouncing ideas about the market? Send a message or call directly.",
  phoneLabel: "Call Mila",
  emailLabel: "Email",
  officeLabel: "Office",
  formKicker: "I usually reply the same business day.",
};
