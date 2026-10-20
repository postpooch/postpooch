import { NextResponse } from "next/server";

import { AuthenticationError, MissingProfileError } from "@/lib/auth/token_check";
import { GoogleBusinessAccessError } from "@/lib/google-business/service";
import { GoogleBusinessProviderError } from "@/lib/google-business/zernio-provider";
import { R2ImageUploadError } from "@/lib/images/r2";

export function googleBusinessJson(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export function googleBusinessError(error: unknown, fallback: string) {
  if (error instanceof AuthenticationError) return googleBusinessJson({ error: "Sign in required." }, 401);
  if (error instanceof MissingProfileError) return googleBusinessJson({ error: "A PostPooch profile is required." }, 403);
  if (error instanceof GoogleBusinessAccessError) return googleBusinessJson({ error: error.message }, 404);
  if (error instanceof GoogleBusinessProviderError) {
    const status = error.status >= 400 && error.status < 500 ? error.status : 502;
    return googleBusinessJson({ error: error.message }, status);
  }
  if (error instanceof R2ImageUploadError) return googleBusinessJson({ error: error.message }, 400);
  console.error(fallback, error);
  return googleBusinessJson({ error: fallback }, 500);
}
