import { NextResponse } from "next/server";
import type { ZodType } from "zod";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import { CrmAccessError, CrmConflictError, CrmValidationError } from "@/lib/crm/repository";

export function crmJson(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

/** Paginated lists: `{ data: T[], meta }` so `crmFetch` can rebuild `CrmListResponse`. */
export function crmListJson<T>(items: readonly T[], page: { page: number; pageSize: number }, total: number) {
  return crmJson({
    data: items,
    meta: { page: page.page, pageSize: page.pageSize, total },
  });
}

export function crmError(error: unknown, fallback: string) {
  if (error instanceof AuthenticationError) return crmJson({ error: "Sign in required." }, 401);
  if (error instanceof MissingProfileError) return crmJson({ error: "A PostPooch profile is required." }, 403);
  if (error instanceof CrmAccessError) return crmJson({ error: error.message }, 404);
  if (error instanceof CrmValidationError) return crmJson({ error: error.message }, 422);
  if (error instanceof CrmConflictError) return crmJson({ error: error.message }, 409);
  console.error(fallback, error);
  return crmJson({ error: fallback }, 500);
}

export async function readJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new CrmValidationError("Content-Type must be application/json.");
  }
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > 100_000) throw new CrmValidationError("Request is too large.");
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new CrmValidationError("Invalid request body.");
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new CrmValidationError(parsed.error.issues[0]?.message ?? "Invalid request body.");
  }
  return parsed.data;
}

export function parsePage(searchParams: URLSearchParams) {
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("pageSize") ?? "25", 10) || 25));
  return { page, pageSize, offset: (page - 1) * pageSize };
}

export function validUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function crmTenant() {
  const { profile } = await requireAuthenticatedProfile();
  const { CrmRepository } = await import("@/lib/crm/repository");
  return new CrmRepository(profile.id);
}
