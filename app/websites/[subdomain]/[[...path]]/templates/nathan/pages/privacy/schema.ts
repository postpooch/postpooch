import { z } from "zod";

const SectionSchema = z.object({
  title: z.string(),
  body: z.string(),
});

export const NathanPrivacyContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  sections: z.array(SectionSchema).min(1),
});

export type NathanPrivacyContent = z.infer<typeof NathanPrivacyContentSchema>;

export const nathanPrivacyDefaultContent: NathanPrivacyContent = {
  eyebrow: "LEGAL",
  title: "Privacy.",
  sections: [
    {
      title: "Demo implementation notice",
      body: "This project is a design prototype. The contact and newsletter forms are front-end demonstrations and do not transmit or store personal data. Before production launch, connect forms to your approved CRM or form provider and replace this notice with counsel-reviewed privacy terms appropriate to your brokerage, state, advertising stack, and data practices.",
    },
    {
      title: "Real estate disclosures",
      body: "All listing content in this demo is fictional placeholder material. Prices, addresses, statistics, sales records, press mentions, and agent credentials must be replaced with verified information before publication. Add all licensing, fair housing, MLS/IDX, brokerage, and state-specific disclosures required for the final agent and market.",
    },
  ],
};
