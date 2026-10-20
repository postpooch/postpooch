import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  AuthenticationError,
  MissingProfileError,
} from "@/lib/auth/token_check";
import {
  NewsletterAudienceConflictError,
  NewsletterAudienceContactError,
  NewsletterAudienceNotFoundError,
} from "./store";

export function newsletterAudienceResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export function newsletterAudienceError(error: unknown, fallback: string) {
  if (error instanceof AuthenticationError) {
    return newsletterAudienceResponse({ error: "Sign in required." }, 401);
  }
  if (error instanceof MissingProfileError) {
    return newsletterAudienceResponse({ error: "A profile is required." }, 403);
  }
  if (error instanceof NewsletterAudienceNotFoundError) {
    return newsletterAudienceResponse({ error: error.message }, 404);
  }
  if (error instanceof NewsletterAudienceContactError || error instanceof ZodError) {
    const message =
      error instanceof ZodError
        ? (error.issues[0]?.message ?? "Check the audience details.")
        : error.message;
    return newsletterAudienceResponse({ error: message }, 422);
  }
  if (error instanceof NewsletterAudienceConflictError) {
    return newsletterAudienceResponse({ error: error.message }, 409);
  }
  if (error instanceof SyntaxError) {
    return newsletterAudienceResponse({ error: "Invalid request body." }, 400);
  }
  console.error(fallback, {
    errorName: error instanceof Error ? error.name : "UnknownError",
  });
  return newsletterAudienceResponse({ error: fallback }, 500);
}

export async function parseAudienceRequest(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new SyntaxError("Content-Type must be application/json.");
  }
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 500_000) {
    throw new SyntaxError("Request is too large.");
  }
  return request.json();
}
