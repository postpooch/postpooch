import { z } from "zod";

const CondoBlockSchema = z.object({
  number: z.string(),
  title: z.string(),
  copy: z.string(),
});

export const MaraCondoContentSchema = z.object({
  profileEyebrow: z.string(),
  profileBody: z.string(),
  blocks: z.array(CondoBlockSchema).min(1),
  formTitlePrefix: z.string(),
});

export type MaraCondoContent = z.infer<typeof MaraCondoContentSchema>;

export const maraCondoDefaultContent: MaraCondoContent = {
  profileEyebrow: "Building profile",
  profileBody:
    "For a serious condo search, the building itself is part of the purchase. This profile format gives an agent room to explain the character, plan quality, service level, ownership experience and resale considerations that are difficult to understand from an MLS listing alone.",
  blocks: [
    {
      number: "01",
      title: "What stands out",
      copy: "Generous common areas, strong materials and a sense of arrival that feels residential rather than transient.",
    },
    {
      number: "02",
      title: "Who it suits",
      copy: "Buyers who value service, privacy, established neighbourhood context and well-proportioned living spaces.",
    },
    {
      number: "03",
      title: "What to inspect",
      copy: "Exposure, suite-specific renovation quality, status certificate, reserve fund and the exact relationship to neighbouring buildings.",
    },
    {
      number: "04",
      title: "How I can help",
      copy: "I track opportunities within the building and can help assess both on-market and discreet off-market possibilities.",
    },
  ],
  formTitlePrefix: "Ask about",
};
