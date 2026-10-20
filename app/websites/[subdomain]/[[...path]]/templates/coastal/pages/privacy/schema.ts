import { z } from "zod";

export const CoastalPrivacyContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  intro: z.string(),
  noteTitle: z.string(),
  noteBody: z.string(),
});

export type CoastalPrivacyContent = z.infer<typeof CoastalPrivacyContentSchema>;

export const coastalPrivacyDefaultContent: CoastalPrivacyContent = {
  heroEyebrow: "Legal",
  heroTitle: "Privacy Policy",
  intro:
    "This demo template does not collect or store personal information. If you connect the included forms to a CRM, database, analytics provider, or email platform, replace this placeholder with a policy that accurately describes your data practices.",
  noteTitle: "Template note",
  noteBody:
    "Privacy, accessibility, fair housing, brokerage disclosures, licensing, and MLS/IDX attribution requirements vary by implementation. Add the notices required for the agent, market, brokerage, and data sources used in production.",
};
