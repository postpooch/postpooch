import type { Metadata } from "next";

import { TemplatesGallery } from "@/components/dashboard/social-media/templates-gallery";
import { getEditorTemplateCards } from "@/lib/social-templates/store";
import type { EditorTemplateCard } from "@/lib/social-templates/types";

export const metadata: Metadata = {
  title: "Editor",
};

/** Template gallery — search and pick a starting point for the canvas. */
export default async function SocialEditorPage() {
  let templates: EditorTemplateCard[] = [];
  let templatesError = "";

  try {
    templates = await getEditorTemplateCards();
  } catch (error) {
    console.error("Editor template listing failed:", error);
    templatesError = "Unable to load templates right now.";
  }

  return (
    <TemplatesGallery templates={templates} templatesError={templatesError} />
  );
}