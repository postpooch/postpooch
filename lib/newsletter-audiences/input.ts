import { z } from "zod";

export const newsletterAudienceInput = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Give this audience a name.")
    .max(80, "Audience names must be 80 characters or fewer."),
  contactIds: z
    .array(z.string().uuid("One or more contacts are invalid."))
    .min(1, "Choose at least one contact.")
    .max(10_000, "An audience can contain up to 10,000 selected contacts.")
    .transform((ids) => [...new Set(ids)]),
});

export type NewsletterAudienceInput = z.infer<typeof newsletterAudienceInput>;
