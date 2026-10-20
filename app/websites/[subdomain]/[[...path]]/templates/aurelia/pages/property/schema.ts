import { z } from "zod";

export const AureliaPropertyContentSchema = z.object({
  residenceKicker: z.string(),
  residenceTitle: z.string(),
  residenceExtra: z.string(),
  inquiryKicker: z.string(),
  inquiryTitle: z.string(),
  inquiryBody: z.string(),
  relatedKicker: z.string(),
  relatedTitle: z.string(),
});

export type AureliaPropertyContent = z.infer<typeof AureliaPropertyContentSchema>;

export const aureliaPropertyDefaultContent: AureliaPropertyContent = {
  residenceKicker: "Residence",
  residenceTitle: "Designed for a life of ease and privacy.",
  residenceExtra:
    "Thoughtful proportions and an understated material palette create rooms that feel expansive without becoming impersonal. The residence is arranged to make everyday life as considered as large-scale entertaining.",
  inquiryKicker: "Private showing",
  inquiryTitle: "Request property details.",
  inquiryBody:
    "For additional photography, disclosures or a private appointment, send a confidential inquiry.",
  relatedKicker: "Continue exploring",
  relatedTitle: "More properties",
};
