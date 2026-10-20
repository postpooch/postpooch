import { z } from "zod";

export const HarborMarketReportContentSchema = z.object({
  image: z.string(),
  imageAlt: z.string(),
  kicker: z.string(),
  titleBefore: z.string(),
  titleItalic: z.string(),
  body: z.string(),
  formLabel: z.string(),
  note: z.string(),
});

export type HarborMarketReportContent = z.infer<
  typeof HarborMarketReportContentSchema
>;

export const harborMarketReportDefaultContent: HarborMarketReportContent = {
  image:
    "https://pub-7c19c2bd664343ff99e9f2c4903fb73f.r2.dev/websites/template-defaults/7f/7f9f8362712075f4d0b6be9882802c5278e9cacbe0f092d3908b73f85881ee3a.avif",
  imageAlt: "Modern condo interior",
  kicker: "Toronto West market report",
  titleBefore: "Recent sales, clearer context,",
  titleItalic: "less guesswork.",
  body: "Get a concise market update with recent neighbourhood sales, current listing conditions, and the trends I’m watching for buyers and sellers.",
  formLabel: "Send me the report",
  note: "Connect this form to your email platform to deliver an automated PDF, newsletter, or custom follow-up.",
};
