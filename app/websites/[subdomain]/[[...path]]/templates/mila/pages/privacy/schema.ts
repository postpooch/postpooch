import { z } from "zod";

export const MilaPrivacyContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  lead: z.string(),
  sections: z
    .array(
      z.object({
        heading: z.string(),
        body: z.string(),
      }),
    )
    .min(1),
});

export type MilaPrivacyContent = z.infer<typeof MilaPrivacyContentSchema>;

export const milaPrivacyDefaultContent: MilaPrivacyContent = {
  eyebrow: "Privacy",
  title: "Privacy statement",
  lead: "This demo includes brief sample text. For a live brokerage site, align the final statement with the forms, analytics, CRM, and marketing tools you actually use.",
  sections: [
    {
      heading: "What data is processed?",
      body: "Contact and search forms may process name, email address, phone number, housing preferences, and other information you provide voluntarily.",
    },
    {
      heading: "Why is data used?",
      body: "To respond to your request, deliver services, flag matching homes, and — only where permitted — send relevant updates.",
    },
    {
      heading: "Retention and sharing",
      body: "Personal data is not kept longer than needed for the purpose for which it was collected. Data is shared with service providers only when necessary to deliver the service or when legally required.",
    },
    {
      heading: "Your rights",
      body: "You may request access to, correction of, or deletion of personal data and, where applicable, object to processing or withdraw consent.",
    },
    {
      heading: "Contact",
      body: "For privacy questions, contact hello@milawonen.nl.",
    },
  ],
};
