import { z } from "zod";

export const AureliaContactContentSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  body: z.string(),
});

export type AureliaContactContent = z.infer<typeof AureliaContactContentSchema>;

export const aureliaContactDefaultContent: AureliaContactContent = {
  kicker: "Contact",
  title: "Start a private conversation.",
  body: "Whether you are considering a sale, beginning a search or simply want a thoughtful second opinion, we would be pleased to hear from you.",
};
