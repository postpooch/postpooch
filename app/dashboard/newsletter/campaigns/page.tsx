import type { Metadata } from "next";

import { NewsletterCampaignsPanel } from "@/components/dashboard/newsletter/campaigns-panel";

export const metadata: Metadata = {
  title: "Campaigns",
};

export default function NewsletterCampaignsPage() {
  return <NewsletterCampaignsPanel />;
}
