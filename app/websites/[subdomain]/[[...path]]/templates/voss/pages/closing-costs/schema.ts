import { z } from "zod";

const GuideColumnSchema = z.object({
  label: z.string(),
  title: z.string(),
  items: z.array(z.string()).min(1),
});

export const VossClosingCostsContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  intro: z.string(),
  columns: z.array(GuideColumnSchema).min(1),
  warningEyebrow: z.string(),
  warningTitle: z.string(),
  warningBody: z.string(),
  warningCtaLabel: z.string(),
  warningCtaHref: z.string(),
});

export type VossClosingCostsContent = z.infer<
  typeof VossClosingCostsContentSchema
>;

export const vossClosingCostsDefaultContent: VossClosingCostsContent = {
  eyebrow: "Field guide · New York",
  titleLine1: "Budget beyond",
  titleEmphasis: "the purchase price.",
  intro:
    "A deliberately non-numeric demo framework for explaining closing-cost categories. Insert current, attorney-reviewed figures and thresholds before publishing this page.",
  columns: [
    {
      label: "BUYER · CONDO",
      title: "Typical categories",
      items: [
        "Attorney fees",
        "Title insurance and searches",
        "Mortgage recording tax, if financing",
        "Lender / appraisal fees",
        "Mansion tax where applicable",
        "Building move / application charges",
      ],
    },
    {
      label: "BUYER · CO-OP",
      title: "Typical categories",
      items: [
        "Attorney fees",
        "Lien / UCC searches",
        "Financing and bank fees",
        "Mansion tax where applicable",
        "Board / managing-agent charges",
        "Move deposits and fees",
      ],
    },
    {
      label: "SELLER",
      title: "Typical categories",
      items: [
        "Brokerage commission",
        "Attorney fees",
        "NYC / NYS transfer taxes",
        "Building fees and move charges",
        "Flip tax, where applicable",
        "Loan payoff and miscellaneous adjustments",
      ],
    },
  ],
  warningEyebrow: "Important",
  warningTitle: "Rules, rates and thresholds change.",
  warningBody:
    "This concept intentionally avoids publishing percentages or legal advice. Your production version should be reviewed by a New York real-estate attorney and kept current.",
  warningCtaLabel: "Ask Mara about your scenario",
  warningCtaHref: "/contact",
};
