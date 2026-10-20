import { z } from "zod";

export const VossPressContentSchema = z.object({
  eyebrow: z.string(),
  titleLine1: z.string(),
  titleEmphasis: z.string(),
  intro: z.string(),
  disclaimer: z.string(),
  inquiryEyebrow: z.string(),
  inquiryTitleLine1: z.string(),
  inquiryTitleLine2: z.string(),
  inquiryBody: z.string(),
});

export type VossPressContent = z.infer<typeof VossPressContentSchema>;

export const vossPressDefaultContent: VossPressContent = {
  eyebrow: "Press / speaking / partnerships",
  titleLine1: "One clear voice.",
  titleEmphasis: "Use it selectively.",
  intro:
    "A dedicated home for verified editorial coverage, market commentary, podcast appearances, speaking inquiries and brand partnerships.",
  disclaimer:
    "All publication entries above are placeholders for the design concept. Replace with verified coverage and live links before publication.",
  inquiryEyebrow: "Media inquiries",
  inquiryTitleLine1: "For interviews, panels,",
  inquiryTitleLine2: "podcasts or partnerships.",
  inquiryBody:
    "Typical topics: Manhattan luxury trends, buyer psychology, pricing strategy, new development, design-led resale, and navigating private inventory.",
};
