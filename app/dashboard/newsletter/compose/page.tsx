import type { Metadata } from "next";

import { ComposeReviewPage } from "@/components/dashboard/newsletter/compose/review-page";
import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import {
  listNewsletterAudiencesForProfile,
  listNewsletterContactsForProfile,
} from "@/lib/newsletter-audiences/store";
import { requireComposeEmailId } from "@/lib/newsletter-emails/compose-access";
import { getNewsletterEmailForProfile } from "@/lib/newsletter-emails/store";
import { getNewsletterSenderSetup } from "@/lib/newsletter-senders/setup";

export const metadata: Metadata = {
  title: "Review and send",
};

type ComposePageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function NewsletterComposePage({
  searchParams,
}: ComposePageProps) {
  const params = await searchParams;
  const emailId = await requireComposeEmailId(params.email);
  const { profile } = await requireAuthenticatedProfile();
  const [audiences, contacts, email, sender] = await Promise.all([
    listNewsletterAudiencesForProfile(profile.id),
    listNewsletterContactsForProfile(profile.id),
    getNewsletterEmailForProfile(emailId, profile.id),
    getNewsletterSenderSetup(profile.id),
  ]);
  return (
    <ComposeReviewPage
      emailId={emailId}
      audiences={audiences}
      contacts={contacts}
      senderEmail={sender?.fromEmail ?? ""}
      senderReady={sender?.ready === true}
      contentReady={Boolean(email && !email.isBlank)}
    />
  );
}
