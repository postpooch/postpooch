import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { WebsiteEditor } from "@/components/dashboard/website/website-editor";
import { TemplatePicker } from "@/components/dashboard/website/template-picker";
import {
  WEBSITE_TEMPLATES,
  websiteTemplatePreviewUrl,
} from "@/app/websites/website-templates";
import { getAuthenticatedProfile } from "@/lib/auth/token_check";
import { getWebsiteEditorForProfile } from "@/lib/websites/editor";

export const metadata: Metadata = {
  title: "Website",
};

function getR2PublicBaseUrl(): string {
  const value = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.trim();
  if (!value) {
    throw new Error(
      "CLOUDFLARE_R2_PUBLIC_BASE_URL is required to load website template previews.",
    );
  }
  return value;
}

export default async function WebsitePage({
  searchParams,
}: {
  searchParams: Promise<{ templates?: string }>;
}) {
  const authenticated = await getAuthenticatedProfile();
  if (!authenticated) redirect("/auth/login");

  const baseUrl = getR2PublicBaseUrl();
  const editor = await getWebsiteEditorForProfile(authenticated.profile.id);
  const showTemplates = (await searchParams).templates === "1";

  const templates = WEBSITE_TEMPLATES.map((template) => ({
    ...template,
    previewUrl: websiteTemplatePreviewUrl(baseUrl, template.previewFile),
  }));

  if (editor && !showTemplates) {
    const template = WEBSITE_TEMPLATES.find((item) => item.id === editor.template);
    return <WebsiteEditor initialDocument={editor} templateName={template?.name ?? editor.template} />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <TemplatePicker templates={templates} currentTemplateId={editor?.template ?? null} />
    </div>
  );
}
