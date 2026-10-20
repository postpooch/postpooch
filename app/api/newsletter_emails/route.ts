import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  createBlankNewsletterEmail,
  createNewsletterEmailFromTemplate,
} from "@/lib/newsletter-emails/store";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

type CreateBody = {
  blank?: unknown;
  templateId?: unknown;
};

/**
 * POST /api/newsletter_emails
 * Body: `{ blank: true }` or `{ templateId: "<uuid>" }`
 *
 * Creates a profile-owned newsletter_emails row whose `content` is always
 * Templatical JSON. Template picks convert catalog MJML → JSON once here.
 */
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ error: "Content-Type must be application/json." }, 415);
  }

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const wantBlank = body.blank === true;
  const templateId =
    typeof body.templateId === "string" ? body.templateId.trim() : "";

  if (wantBlank === Boolean(templateId)) {
    return jsonResponse(
      { error: "Provide either blank: true or a templateId." },
      400,
    );
  }

  if (templateId && !UUID_PATTERN.test(templateId)) {
    return jsonResponse({ error: "Invalid template id." }, 400);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();

    if (wantBlank) {
      const email = await createBlankNewsletterEmail(profile.id);
      return jsonResponse({ id: email.id }, 201);
    }

    const email = await createNewsletterEmailFromTemplate({
      profileId: profile.id,
      templateId,
    });
    if (!email) {
      return jsonResponse({ error: "Template not found." }, 404);
    }

    return jsonResponse({ id: email.id }, 201);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonResponse({ error: "Sign in required." }, 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonResponse(
        { error: "A profile is required to create an email." },
        403,
      );
    }

    console.error("Newsletter email creation failed:", error);
    return jsonResponse({ error: "Unable to create an email right now." }, 500);
  }
}
