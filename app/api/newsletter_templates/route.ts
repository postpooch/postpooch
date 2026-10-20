import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  listNewsletterTemplateCards,
  NEWSLETTER_TEMPLATE_PAGE_SIZE,
} from "@/lib/newsletter-templates/store";
import type { NewsletterTemplateCursor } from "@/lib/newsletter-templates/types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function decodeCursor(
  rawCursor: string | null,
): NewsletterTemplateCursor | undefined {
  if (!rawCursor) return undefined;

  try {
    const parsed = JSON.parse(
      Buffer.from(rawCursor, "base64url").toString("utf8"),
    ) as { createdAt?: unknown; id?: unknown };
    if (
      typeof parsed.createdAt !== "string" ||
      !Number.isFinite(Date.parse(parsed.createdAt)) ||
      typeof parsed.id !== "string" ||
      !UUID_PATTERN.test(parsed.id)
    ) {
      return undefined;
    }

    return { createdAt: parsed.createdAt, id: parsed.id };
  } catch {
    return undefined;
  }
}

function encodeCursor(cursor: NewsletterTemplateCursor | null) {
  return cursor
    ? Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url")
    : null;
}

export async function GET(request: Request) {
  const rawCursor = new URL(request.url).searchParams.get("cursor");
  const cursor = decodeCursor(rawCursor);
  if (rawCursor && !cursor) {
    return jsonResponse({ error: "Invalid template cursor." }, 400);
  }

  try {
    await requireAuthenticatedProfile();
    const page = await listNewsletterTemplateCards({
      limit: NEWSLETTER_TEMPLATE_PAGE_SIZE,
      cursor,
    });

    return jsonResponse({
      templates: page.templates,
      nextCursor: encodeCursor(page.nextCursor),
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonResponse({ error: "Sign in required." }, 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonResponse(
        { error: "A profile is required to view templates." },
        403,
      );
    }

    console.error("Newsletter template listing failed:", error);
    return jsonResponse({ error: "Unable to load templates right now." }, 500);
  }
}
