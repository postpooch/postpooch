import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { newsletterComposeHref } from "@/lib/newsletter-emails/paths";
import { requireComposeEmailId } from "@/lib/newsletter-emails/compose-access";

export const metadata: Metadata = {
  title: "Review and send",
};

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

/** Legacy prepare step — the flow now lives on one review page. */
export default async function NewsletterComposeFromRedirect({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const emailId = await requireComposeEmailId(params.email);
  redirect(newsletterComposeHref(emailId));
}
