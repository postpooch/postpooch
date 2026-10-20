import { z } from "zod";

export const AtelierContactContentSchema = z.object({
  visualEyebrow: z.string(),
  visualTitle: z.string(),
  visualImage: z.string(),
  formEyebrow: z.string(),
  formTitle: z.string(),
  submitLabel: z.string(),
  finePrint: z.string(),
});

export type AtelierContactContent = z.infer<typeof AtelierContactContentSchema>;

export const atelierContactDefaultContent: AtelierContactContent = {
  visualEyebrow: "Private advisory",
  visualTitle: "Let’s talk about\nwhat comes next.",
  visualImage:
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=88",
  formEyebrow: "Start a conversation",
  formTitle: "Tell us how we can help.",
  submitLabel: "Send inquiry",
  finePrint:
    "By submitting this form, you agree to be contacted about your real estate inquiry. Replace this text with your brokerage’s required consent language.",
};
