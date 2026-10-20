import { z } from "zod";

export const RoweContactContentSchema = z.object({
  label: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  deck: z.string(),
  directLabel: z.string(),
  intentLabel: z.string(),
  intents: z.array(z.string()).min(1),
  messagePlaceholder: z.string(),
  submitLabel: z.string(),
  successNote: z.string(),
});

export type RoweContactContent = z.infer<typeof RoweContactContentSchema>;

export const roweContactDefaultContent: RoweContactContent = {
  label: "Contact / Direct inquiry",
  titleLine1: "Tell me what",
  titleEmphasis: "you’re considering.",
  deck: "Buying, selling, weighing a quiet move, or simply trying to understand the market? Start with the context. I’ll respond personally.",
  directLabel: "Direct",
  intentLabel: "I’m interested in",
  intents: [
    "Buying",
    "Selling",
    "Private listing",
    "Portfolio advice",
    "New development",
    "Other",
  ],
  messagePlaceholder:
    "Timing, neighborhood, property, price range, or just the question you’re trying to solve.",
  submitLabel: "Send inquiry",
  successNote:
    "Thanks — this demo form is working on the front end. Connect it to your CRM, Formspree, HubSpot, or server action before launch.",
};
