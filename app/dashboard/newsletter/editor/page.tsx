import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { NewsletterEmailEditor } from "@/components/dashboard/newsletter/email-editor";
import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import { getNewsletterEmailForProfile } from "@/lib/newsletter-emails/store";

type EditorPageProps = {
  searchParams: Promise<{ email?: string }>;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function generateMetadata({
  searchParams,
}: EditorPageProps): Promise<Metadata> {
  const params = await searchParams;
  if (params.email && UUID_PATTERN.test(params.email)) {
    try {
      const { profile } = await requireAuthenticatedProfile();
      const email = await getNewsletterEmailForProfile(params.email, profile.id);
      if (email) {
        return {
          title: email.isBlank ? "Blank newsletter" : "Newsletter draft",
        };
      }
    } catch {
      // Fall through to default title.
    }
  }
  return { title: "Newsletter editor" };
}

/**
 * Full-bleed Templatical editor. Chrome is stripped by NewsletterShell
 * when the path includes `/newsletter/editor` (same pattern as social canvas).
 * The email draft is identified by `?email=<newsletter_emails.id>`.
 */
export default async function NewsletterEditorPage({
  searchParams,
}: EditorPageProps) {
  const params = await searchParams;
  const emailId = params.email?.trim() ?? "";

  if (!UUID_PATTERN.test(emailId)) {
    redirect("/dashboard/newsletter");
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const email = await getNewsletterEmailForProfile(emailId, profile.id);

    if (!email) {
      return (
        <EditorMissingState
          title="Email not found"
          detail="This draft is missing or you don’t have access to it."
        />
      );
    }

    return (
      <NewsletterEmailEditor
        emailId={email.id}
        title={email.isBlank ? "Blank newsletter" : "Newsletter draft"}
        detail={email.isBlank ? "Start from an empty canvas" : "Draft"}
      />
    );
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

function EditorMissingState({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="flex h-[calc(100dvh-3.75rem)] items-center justify-center bg-[#ebe6e1] p-6 lg:h-dvh">
      <div className="max-w-sm rounded-[18px] bg-white px-6 py-8 text-center shadow-[0_18px_55px_rgba(36,25,20,.12)] ring-1 ring-pp-sand/70">
        <p className="text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
          {title}
        </p>
        <p className="mt-2 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
          {detail}
        </p>
        <Link
          href="/dashboard/newsletter"
          className="mt-5 inline-flex rounded-[12px] bg-pp-teal px-4 py-2.5 text-sm font-semibold text-pp-white transition hover:bg-pp-teal-dark"
        >
          Back to templates
        </Link>
      </div>
    </div>
  );
}
