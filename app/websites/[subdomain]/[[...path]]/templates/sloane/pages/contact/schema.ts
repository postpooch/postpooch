import { z } from "zod";

export const SloaneContactContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  copyEyebrow: z.string(),
  copyTitle: z.string(),
  copyBody: z.string(),
  phoneLabel: z.string(),
  emailLabel: z.string(),
  officeLabel: z.string(),
  formTitle: z.string(),
});

export type SloaneContactContent = z.infer<typeof SloaneContactContentSchema>;

export const sloaneContactDefaultContent: SloaneContactContent = {
  eyebrow: "Contact",
  title: "Tell us what you are considering.",
  intro:
    "Buying, selling, leasing, or simply evaluating a future move—start with the context. We will take it from there.",
  copyEyebrow: "Private inquiries",
  copyTitle: "A clear first conversation.",
  copyBody:
    "Share as much or as little as is useful. Every inquiry begins with your timing, goals, and the decisions you are trying to make—not a sales script.",
  phoneLabel: "Direct",
  emailLabel: "Email",
  officeLabel: "Office",
  formTitle: "Send an inquiry",
};
