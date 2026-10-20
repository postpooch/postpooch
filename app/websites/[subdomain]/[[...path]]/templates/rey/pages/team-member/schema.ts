import { z } from "zod";

export const ReyTeamMemberContentSchema = z.object({
  meetEyebrow: z.string(),
  quote: z.string(),
  contactCtaPrefix: z.string(),
});

export type ReyTeamMemberContent = z.infer<typeof ReyTeamMemberContentSchema>;

export const reyTeamMemberDefaultContent: ReyTeamMemberContent = {
  meetEyebrow: "Meet",
  quote:
    "Exceptional representation begins with listening carefully enough to understand what the client is really trying to accomplish.",
  contactCtaPrefix: "Contact",
};
