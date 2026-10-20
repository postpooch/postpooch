import "server-only";

import { redirect } from "next/navigation";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import { getNewsletterEmailForProfile } from "@/lib/newsletter-emails/store";
import { isNewsletterEmailId } from "@/lib/newsletter-emails/paths";

/**
 * Resolve `?email=` for compose pages — must be a draft the profile owns.
 */
export async function requireComposeEmailId(
  emailParam: string | undefined,
): Promise<string> {
  const emailId = emailParam?.trim() ?? "";
  if (!isNewsletterEmailId(emailId)) {
    redirect("/dashboard/newsletter");
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const email = await getNewsletterEmailForProfile(emailId, profile.id);
    if (!email) {
      redirect("/dashboard/newsletter");
    }
    return email.id;
  } catch (error) {
    if (
      error instanceof AuthenticationError ||
      error instanceof MissingProfileError
    ) {
      redirect("/auth/login");
    }
    throw error;
  }
}
