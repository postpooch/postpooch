import { z } from "zod";

const SectionSchema = z.object({
  title: z.string().optional(),
  body: z.string(),
  strongPrefix: z.string().optional(),
});

export const RowePrivacyContentSchema = z.object({
  label: z.string(),
  title: z.string(),
  updatedLabel: z.string(),
  updatedDate: z.string(),
  sections: z.array(SectionSchema).min(1),
});

export type RowePrivacyContent = z.infer<typeof RowePrivacyContentSchema>;

export const rowePrivacyDefaultContent: RowePrivacyContent = {
  label: "Legal / Privacy",
  title: "Privacy policy.",
  updatedLabel: "Last updated",
  updatedDate: "August 2026",
  sections: [
    {
      strongPrefix: "Template notice.",
      body: " This is starter copy, not legal advice. Replace it with a policy reviewed for your jurisdiction, analytics stack, CRM, advertising tools, and brokerage requirements.",
    },
    {
      title: "Information you provide",
      body: "When you submit an inquiry or newsletter form, the site may collect information such as your name, email address, phone number, real-estate interests, and any details you choose to include in your message.",
    },
    {
      title: "How information is used",
      body: "Information may be used to respond to inquiries, provide requested real-estate services, improve the website, maintain business records, and send communications you have asked to receive.",
    },
    {
      title: "Analytics and cookies",
      body: "If analytics, advertising pixels, embedded media, or third-party CRM tools are added, update this section to describe those technologies and any consent controls required in the markets where you operate.",
    },
    {
      title: "Sharing",
      body: "Personal information should only be shared with service providers or transaction professionals when necessary to operate the website, fulfill a request, comply with law, or support an authorized real-estate transaction.",
    },
    {
      title: "Contact",
      body: "For privacy questions, contact hello@averyrowe.com. Replace this address and all placeholder business details before launch.",
    },
  ],
};
