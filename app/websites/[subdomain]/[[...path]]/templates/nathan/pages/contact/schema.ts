import { z } from "zod";

export const NathanContactContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleLine2: z.string(),
  deck: z.string(),
  directLabel: z.string(),
  formSuccessTitle: z.string(),
  formSuccessBody: z.string(),
  formSubmitLabel: z.string(),
  formNote: z.string(),
});

export type NathanContactContent = z.infer<typeof NathanContactContentSchema>;

export const nathanContactDefaultContent: NathanContactContent = {
  eyebrow: "PRIVATE CLIENT INQUIRIES",
  titleLine1: "Start with a",
  titleLine2: "conversation.",
  deck: "Tell us what you are considering. You do not need to have every detail figured out before reaching out.",
  directLabel: "DIRECT",
  formSuccessTitle: "Received.",
  formSuccessBody:
    "Nathan's team will follow up shortly. For time-sensitive inquiries, use the direct contact details alongside.",
  formSubmitLabel: "Send inquiry",
  formNote:
    "By submitting, you agree to be contacted regarding your inquiry. No spam, no list resale.",
};
