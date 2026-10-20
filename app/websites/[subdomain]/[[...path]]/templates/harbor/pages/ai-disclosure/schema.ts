import { z } from "zod";

export const HarborAiDisclosureContentSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      body: z.string(),
    }),
  ),
});

export type HarborAiDisclosureContent = z.infer<
  typeof HarborAiDisclosureContentSchema
>;

export const harborAiDisclosureDefaultContent: HarborAiDisclosureContent = {
  kicker: "Disclosure",
  title: "AI & content disclosure",
  sections: [
    {
      heading: "Concept-site notice",
      body: "This website concept was created with AI-assisted design and development. The fictional agent identity, sample testimonials, property addresses, building names, market content, and listing details are placeholders and must not be represented as factual.",
    },
    {
      heading: "Before publishing",
      body: "Replace placeholder content with verified agent, brokerage, listing, client, and market information. Any AI-assisted consumer-facing content should be reviewed for accuracy, fair-housing compliance, brokerage policy, advertising requirements, and local real-estate regulations.",
    },
  ],
};
