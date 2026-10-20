import { z } from "zod";

export const SloaneTeamContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
});

export type SloaneTeamContent = z.infer<typeof SloaneTeamContentSchema>;

export const sloaneTeamDefaultContent: SloaneTeamContent = {
  eyebrow: "Meet the team",
  title: "Small by design. Connected by nature.",
  intro:
    "A senior, hands-on team built to move quickly while giving each client direct access to the people doing the work.",
};
