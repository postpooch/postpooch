import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  asNewsletterEditorContent,
  resolveNewsletterEditorContent,
} from "@/lib/newsletter-emails/editor-content";
import {
  getNewsletterEmailForProfile,
  updateNewsletterEmailContent,
} from "@/lib/newsletter-emails/store";
import { isNewsletterEmailId } from "@/lib/newsletter-emails/paths";

const MAX_EDITOR_CONTENT_BYTES = 5 * 1024 * 1024;

type RouteContext = {
  params: Promise<{ emailId: string }>;
};

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function authErrorResponse(error: unknown) {
  if (error instanceof AuthenticationError) {
    return jsonResponse({ error: "Sign in required." }, 401);
  }
  if (error instanceof MissingProfileError) {
    return jsonResponse({ error: "A profile is required." }, 403);
  }
  return null;
}

/**
 * GET returns Templatical JSON for the editor.
 * Legacy MJML / JSON-text rows are converted once and rewritten as jsonb.
 */
export async function GET(_request: Request, context: RouteContext) {
  const { emailId } = await context.params;
  if (!isNewsletterEmailId(emailId)) {
    return jsonResponse({ error: "Invalid email id." }, 400);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const email = await getNewsletterEmailForProfile(emailId, profile.id);
    if (!email) {
      return jsonResponse({ error: "Email not found." }, 404);
    }

    const resolved = resolveNewsletterEditorContent(email.content);
    if (resolved.shouldPersistJson) {
      await updateNewsletterEmailContent({
        emailId: email.id,
        profileId: profile.id,
        content: resolved.content,
      });
    }

    return jsonResponse({
      id: email.id,
      createdAt: email.createdAt,
      content: resolved.content,
    });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("Newsletter email load failed:", error);
    return jsonResponse({ error: "Unable to load this email." }, 500);
  }
}

/**
 * PATCH autosaves Templatical JSON only — never MJML.
 */
export async function PATCH(request: Request, context: RouteContext) {
  const { emailId } = await context.params;
  if (!isNewsletterEmailId(emailId)) {
    return jsonResponse({ error: "Invalid email id." }, 400);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ error: "Content-Type must be application/json." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_EDITOR_CONTENT_BYTES
  ) {
    return jsonResponse({ error: "Email content is too large." }, 413);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_EDITOR_CONTENT_BYTES) {
      return jsonResponse({ error: "Email content is too large." }, 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const patch =
    body && typeof body === "object"
      ? (body as { content?: unknown })
      : null;
  const content = asNewsletterEditorContent(patch?.content);
  if (!content) {
    return jsonResponse({ error: "Invalid editor content." }, 400);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const email = await updateNewsletterEmailContent({
      emailId,
      profileId: profile.id,
      content,
    });
    if (!email) {
      return jsonResponse({ error: "Email not found." }, 404);
    }

    return jsonResponse({
      id: email.id,
      createdAt: email.createdAt,
      content,
    });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;

    console.error("Newsletter email autosave failed:", error);
    return jsonResponse({ error: "Unable to save this email." }, 500);
  }
}
