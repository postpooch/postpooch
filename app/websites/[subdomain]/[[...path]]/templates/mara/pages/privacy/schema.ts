import { z } from "zod";

export const MaraPrivacyContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  checklistTitle: z.string(),
  checklist: z.array(z.string()).min(1),
});

export type MaraPrivacyContent = z.infer<typeof MaraPrivacyContentSchema>;

export const maraPrivacyDefaultContent: MaraPrivacyContent = {
  eyebrow: "Privacy",
  title: "Privacy notice",
  intro:
    "This is a demonstration website and does not currently store submitted form data. Before production launch, replace this page with a privacy policy appropriate to the agent’s brokerage, jurisdiction, analytics tools, CRM, newsletter platform and form-processing setup.",
  checklistTitle: "Demo checklist",
  checklist: [
    "Identify the legal entity responsible for personal information.",
    "Describe the information collected and why it is collected.",
    "Document form processors, analytics, CRM and advertising tools.",
    "Explain retention, access and deletion rights as required.",
    "Add brokerage, RECO and MLS disclosures where applicable.",
  ],
};
