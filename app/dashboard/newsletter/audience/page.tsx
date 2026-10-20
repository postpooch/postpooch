import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { NewsletterAudiencePanel } from "@/components/dashboard/newsletter/audience-panel";
import { getAuthenticatedProfile } from "@/lib/auth/token_check";
import {
  listNewsletterAudiencesForProfile,
  listNewsletterContactsForProfile,
} from "@/lib/newsletter-audiences/store";

export const metadata: Metadata = {
  title: "Audience",
};

export default async function NewsletterAudiencePage() {
  const authenticated = await getAuthenticatedProfile();
  if (!authenticated) redirect("/auth/login");
  const { profile } = authenticated;
  const [audiences, contacts] = await Promise.all([
    listNewsletterAudiencesForProfile(profile.id),
    listNewsletterContactsForProfile(profile.id),
  ]);

  return (
    <NewsletterAudiencePanel
      initialAudiences={audiences}
      contacts={contacts}
    />
  );
}
