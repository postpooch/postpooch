import { z } from "zod";

import { images } from "../../catalog-defaults";

export const ReyTeamContentSchema = z.object({
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroImage: z.string(),
  introTitleLine1: z.string(),
  introTitleEmphasis: z.string(),
  introBodyOne: z.string(),
  introBodyTwo: z.string(),
  profileCtaLabel: z.string(),
});

export type ReyTeamContent = z.infer<typeof ReyTeamContentSchema>;

export const reyTeamDefaultContent: ReyTeamContent = {
  heroEyebrow: "The Elena Vale Group",
  heroTitle: "A small team with an exacting standard.",
  heroImage: images.team,
  introTitleLine1: "One standard.",
  introTitleEmphasis: "Every detail.",
  introBodyOne:
    "Our team combines neighborhood intelligence, editorial presentation, negotiation, and responsive client care. Each advisor brings a distinct point of view, but every client benefits from the group's full attention.",
  introBodyTwo:
    "We deliberately remain boutique in scale so that strategy stays senior-led and communication stays direct.",
  profileCtaLabel: "View profile",
};
