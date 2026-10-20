import { z } from "zod";

export const MilaOverMilaContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitleLine1: z.string(),
  heroTitleEmphasis: z.string(),
  heroLead: z.string(),
  photoNoteSuffix: z.string(),
  storyEyebrow: z.string(),
  storyTitle: z.string(),
  storyParagraphs: z.array(z.string()).min(1),
  values: z
    .array(
      z.object({
        number: z.string(),
        title: z.string(),
        text: z.string(),
      }),
    )
    .min(1),
  quote: z.string(),
  ctaEyebrow: z.string(),
  ctaTitle: z.string(),
  ctaLabel: z.string(),
});

export type MilaOverMilaContent = z.infer<typeof MilaOverMilaContentSchema>;

export const milaOverMilaDefaultContent: MilaOverMilaContent = {
  heroEyebrow: "Pleased to meet you",
  heroTitleLine1: "Mila van den Berg.",
  heroTitleEmphasis: "A broker who pays attention.",
  heroLead:
    "I believe good brokerage starts with listening — not to deliver a standard pitch, but to build a plan that fits your home, timing, and life.",
  photoNoteSuffix: "experience in homes & real estate",
  storyEyebrow: "How I work",
  storyTitle:
    "The calm of one point of contact, with the reach of a strong network.",
  storyParagraphs: [
    "For photography, styling, structural questions, mortgage advice, and legal expertise I work with trusted professionals. You do not have to coordinate every line yourself; I orchestrate and stay responsible for the whole.",
    "I care about strong presentation — and even more about a strategy that fits. Sometimes that means a broad launch, sometimes a quiet first test. Sometimes the highest price leads; sometimes certainty or timing does. Good guidance lives in those trade-offs.",
  ],
  values: [
    {
      number: "01",
      title: "Attention",
      text: "I take the time to truly understand your situation and home.",
    },
    {
      number: "02",
      title: "Clarity",
      text: "You get advice in plain language and always know where we stand.",
    },
    {
      number: "03",
      title: "Presentation",
      text: "Imagery, copy, and timing should reach the right audience together.",
    },
    {
      number: "04",
      title: "Results",
      text: "I steer toward the outcome that best fits your priorities.",
    },
  ],
  quote:
    "A home transaction is large enough to handle professionally — and personal enough never to become distant.",
  ctaEyebrow: "Shall we meet?",
  ctaTitle: "Tell me what you are considering. I am happy to think along.",
  ctaLabel: "Schedule a conversation",
};
