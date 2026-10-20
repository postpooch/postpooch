import { z } from "zod";

export const LuxuryPrivacyContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  notice: z.string(),
  collectedHeading: z.string(),
  collectedText: z.string(),
  usedHeading: z.string(),
  usedText: z.string(),
  contactHeading: z.string(),
});

export type LuxuryPrivacyContent = z.infer<typeof LuxuryPrivacyContentSchema>;

export const luxuryPrivacyDefaultContent: LuxuryPrivacyContent = {
  eyebrow: "LEGAL",
  title: "Privacy Policy",
  notice:
    "This is placeholder copy, not legal advice. Replace it with a policy written for the realtor’s actual data practices, vendors, jurisdiction, and advertising tools.",
  collectedHeading: "Information collected",
  collectedText:
    "Describe information submitted through contact, valuation, newsletter, account, and property-search forms, along with any analytics or cookie data.",
  usedHeading: "How information is used",
  usedText:
    "Describe lead response, property services, marketing communications, analytics, security, compliance, and vendor processing.",
  contactHeading: "Contact",
};
