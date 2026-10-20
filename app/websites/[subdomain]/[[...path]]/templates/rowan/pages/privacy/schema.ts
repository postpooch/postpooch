import { z } from "zod";

export const RowanPrivacyContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  updatedNote: z.string(),
  aside: z.string(),
  sections: z
    .array(
      z.object({
        heading: z.string(),
        body: z.string(),
      }),
    )
    .min(1),
});

export type RowanPrivacyContent = z.infer<typeof RowanPrivacyContentSchema>;

export const rowanPrivacyDefaultContent: RowanPrivacyContent = {
  eyebrow: "Legal",
  title: "Privacy policy",
  updatedNote: "Last updated: replace before launch.",
  aside: "This is intentionally a demo policy for the concept website.",
  sections: [
    {
      heading: "Before publishing this website",
      body: "Replace this page with a privacy policy written for the real brokerage, jurisdiction, analytics tools, CRM, advertising platforms and contact-form workflow used in production. This text is not legal advice.",
    },
    {
      heading: "Information submitted by visitors",
      body: "A production website may collect information that a visitor chooses to submit, such as a name, email address, phone number, property information or a message. The final policy should identify exactly what is collected, why it is used and how long it is retained.",
    },
    {
      heading: "Analytics and cookies",
      body: "If analytics, advertising pixels or other tracking technologies are added, disclose them accurately and implement consent controls where required. Do not copy a different brokerage’s policy because the actual tools and legal obligations may differ.",
    },
    {
      heading: "Access, correction and deletion",
      body: "The final policy should explain how a visitor can ask to access, correct or delete personal information, where applicable, and provide the correct privacy contact for the business.",
    },
    {
      heading: "Security and third parties",
      body: "Describe the service providers that receive personal information—such as hosting, email, CRM, analytics or transaction systems—and the reasonable safeguards used to protect that information.",
    },
  ],
};
