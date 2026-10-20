import type { Metadata } from "next";

import { TemplatePreviewHost } from "@/components/dashboard/website/template-preview-host";

export const metadata: Metadata = {
  title: "Website preview",
  robots: { index: false, follow: false },
};

export default function WebsitePreviewPage() {
  return <TemplatePreviewHost />;
}
