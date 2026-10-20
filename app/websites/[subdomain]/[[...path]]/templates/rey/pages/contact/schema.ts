import { z } from "zod";

import { images } from "../../catalog-defaults";

export const ReyContactContentSchema = z.object({
  image: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  deck: z.string(),
  submitLabel: z.string(),
  officeLabel: z.string(),
  directLabel: z.string(),
  emailLabel: z.string(),
});

export type ReyContactContent = z.infer<typeof ReyContactContentSchema>;

export const reyContactDefaultContent: ReyContactContent = {
  image: images.portrait,
  eyebrow: "Private inquiries",
  title: "Let's talk.",
  deck: "Tell us what you are considering. All inquiries are handled with discretion and responded to promptly.",
  submitLabel: "Send inquiry",
  officeLabel: "Office",
  directLabel: "Direct",
  emailLabel: "Email",
};
