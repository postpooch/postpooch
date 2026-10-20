import {
  newsletterComposeHref,
  newsletterEditorHref,
} from "@/lib/newsletter-emails/paths";

export type ComposeMainStageId = "templates" | "design" | "send";

export type ComposeMainStage = {
  id: ComposeMainStageId;
  label: string;
};

/** Top breadcrumb stages — templates → editor → review & send. */
export const COMPOSE_MAIN_STAGES: ComposeMainStage[] = [
  { id: "templates", label: "Templates" },
  { id: "design", label: "Design" },
  { id: "send", label: "Send" },
];

export { newsletterComposeHref, newsletterEditorHref };

export function composeStageHref(
  stageId: ComposeMainStageId,
  emailId: string,
): string {
  switch (stageId) {
    case "templates":
      return "/dashboard/newsletter";
    case "design":
      return newsletterEditorHref(emailId);
    case "send":
      return newsletterComposeHref(emailId);
  }
}
