import { z } from "zod";

export const HarborPrivacyContentSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  sections: z.array(
    z.object({
      heading: z.string(),
      body: z.string(),
    }),
  ),
});

export type HarborPrivacyContent = z.infer<typeof HarborPrivacyContentSchema>;

export const harborPrivacyDefaultContent: HarborPrivacyContent = {
  kicker: "Privacy",
  title: "Privacy policy",
  sections: [
    {
      heading: "Before launch",
      body: "This concept project does not transmit form data to a server. Before production, replace this placeholder with a privacy policy reviewed for the agent’s jurisdiction, brokerage requirements, analytics stack, CRM, advertising tools, and contact-form processing.",
    },
    {
      heading: "What this demo stores",
      body: "Nothing. The included inquiry forms only update local interface state to demonstrate the interaction.",
    },
    {
      heading: "Production checklist",
      body: "Document the personal information collected, why it is collected, which service providers process it, retention practices, consent choices, cookie/analytics behavior, and how visitors can request access or deletion where applicable.",
    },
  ],
};
