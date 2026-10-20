import { z } from "zod";

export const NathanSoldContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  deck: z.string(),
  caseLabel: z.string(),
  caseMeta: z.string(),
  caseNumber: z.string(),
  caseTitle: z.string(),
  caseBody: z.string(),
  ledgerEyebrow: z.string(),
  testimonialQuote: z.string(),
  testimonialAttribution: z.string(),
  ctaLabel: z.string(),
  ctaHref: z.string(),
});

export type NathanSoldContent = z.infer<typeof NathanSoldContentSchema>;

export const nathanSoldDefaultContent: NathanSoldContent = {
  eyebrow: "SELECTED SALES",
  titleLine1: "Results are a",
  titleEmphasis: "lagging indicator.",
  deck: "The real work happens before the number: positioning, preparation, access, and negotiation.",
  caseLabel: "CASE 01",
  caseMeta: "TRIBECA / 2026",
  caseNumber: "$21.4M",
  caseTitle: "Record-setting penthouse sale",
  caseBody:
    "A three-week private campaign identified two qualified buyers before public launch. The property traded above the initial valuation range with reduced market exposure.",
  ledgerEyebrow: "SELECTED LEDGER",
  testimonialQuote:
    "“Nathan gave us fewer opinions and better decisions. Every step felt intentional, and the negotiation was the calmest part of the process.”",
  testimonialAttribution: "— PRIVATE SELLER, DOWNTOWN MANHATTAN",
  ctaLabel: "Discuss your property",
  ctaHref: "/contact",
};
