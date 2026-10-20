import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
} from "@/lib/auth/token_check";
import { CityNotFoundError } from "@/lib/social-media/cities";
import { CrmValidationError } from "@/lib/crm/repository";
import {
  ContextRecordNotFoundError,
  ContextRetryNotAllowedError,
  IdempotencyKeyReusedError,
  ProcessingAttemptSupersededError,
} from "@/lib/social-media/context/repository";

export function socialJson(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export function socialError(error: unknown, fallback: string) {
  if (error instanceof AuthenticationError) return socialJson({ error: "Sign in required." }, 401);
  if (error instanceof MissingProfileError) return socialJson({ error: "A PostPooch profile is required." }, 403);
  if (error instanceof CityNotFoundError) return socialJson({ error: error.message }, 404);
  if (error instanceof ContextRecordNotFoundError) return socialJson({ error: error.message }, 404);
  if (error instanceof ContextRetryNotAllowedError) return socialJson({ error: error.message }, 409);
  if (error instanceof CrmValidationError) return socialJson({ error: error.message }, 422);
  if (error instanceof IdempotencyKeyReusedError) {
    return socialJson({ error: { code: error.code, message: error.message } }, 409);
  }
  if (error instanceof ProcessingAttemptSupersededError) {
    return socialJson({ error: { code: error.code, message: error.message } }, 409);
  }
  console.error(fallback, error);
  return socialJson({ error: fallback }, 500);
}
