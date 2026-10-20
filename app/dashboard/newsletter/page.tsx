import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { NewsletterWorkspace } from "@/components/dashboard/newsletter/workspace";
import { getAuthenticatedProfile } from "@/lib/auth/token_check";
import {
  listNewsletterAudiencesForProfile,
  listNewsletterContactsForProfile,
} from "@/lib/newsletter-audiences/store";
import { listNewsletterCampaignsForProfile } from "@/lib/newsletter-campaigns/store";
import {
  listNewsletterTemplateCards,
  NEWSLETTER_TEMPLATE_PAGE_SIZE,
} from "@/lib/newsletter-templates/store";
import type {
  NewsletterTemplateCard,
  NewsletterTemplateCursor,
} from "@/lib/newsletter-templates/types";

export const metadata: Metadata = {
  title: "Newsletter",
};

function encodeCursor(cursor: NewsletterTemplateCursor | null) {
  return cursor
    ? Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url")
    : null;
}

/** Template gallery — blank canvas plus paginated rows from newsletter_templates. */
export default async function NewsletterTemplatesPage() {
  const authenticated = await getAuthenticatedProfile();
  if (!authenticated) redirect("/auth/login");

  let templates: NewsletterTemplateCard[] = [];
  let nextCursor: string | null = null;
  let templatesError = "";

  try {
    const page = await listNewsletterTemplateCards({
      limit: NEWSLETTER_TEMPLATE_PAGE_SIZE,
    });
    templates = page.templates;
    nextCursor = encodeCursor(page.nextCursor);
  } catch (error) {
    console.error("Newsletter template listing failed:", error);
    templatesError = "Unable to load templates right now.";
  }

  const [campaigns, audiences, contacts] = await Promise.all([
    listNewsletterCampaignsForProfile(authenticated.profile.id),
    listNewsletterAudiencesForProfile(authenticated.profile.id),
    listNewsletterContactsForProfile(authenticated.profile.id),
  ]);

  return (
    <NewsletterWorkspace
      campaigns={campaigns}
      audiences={audiences}
      contacts={contacts}
      initialTemplates={templates}
      initialNextCursor={nextCursor}
      templatesError={templatesError}
    />
  );
}
