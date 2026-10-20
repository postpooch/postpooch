import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  isSchedulePlatform,
  type SchedulePlatform,
} from "@/lib/schedule-platforms";
import {
  MAX_AUTOMATIC_SCHEDULES,
  type PostingSlot,
  type ScheduleDayId,
} from "@/lib/schedule-slots";
import {
  ScheduleSyncError,
  syncAutomaticSchedules,
} from "@/lib/schedules/sync-automatic";

type UpdateBody = {
  slots?: unknown;
  timezone?: unknown;
};

const DAY_IDS = new Set<ScheduleDayId>([
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
]);

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function jsonError(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}

function parsePlatforms(value: unknown): SchedulePlatform[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const platforms: SchedulePlatform[] = [];
  for (const entry of value) {
    if (!isSchedulePlatform(entry)) return null;
    platforms.push(entry);
  }
  return platforms;
}

function parseSlots(value: unknown): PostingSlot[] | null {
  if (!Array.isArray(value)) return null;
  if (value.length > MAX_AUTOMATIC_SCHEDULES) return null;

  const slots: PostingSlot[] = [];

  for (const entry of value) {
    if (!entry || typeof entry !== "object") return null;
    const day = (entry as { day?: unknown }).day;
    const minutes = (entry as { minutes?: unknown }).minutes;
    const platforms = parsePlatforms(
      (entry as { platforms?: unknown }).platforms,
    );

    if (typeof day !== "string" || !DAY_IDS.has(day as ScheduleDayId)) {
      return null;
    }
    if (typeof minutes !== "number" || !Number.isInteger(minutes)) {
      return null;
    }
    if (!platforms) return null;

    slots.push({
      day: day as ScheduleDayId,
      minutes,
      platforms,
    });
  }

  return slots;
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("Content-Type must be application/json.", 415);
  }

  let body: UpdateBody;
  try {
    body = (await request.json()) as UpdateBody;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const slots = parseSlots(body.slots);
  if (!slots) {
    return jsonError(
      `Send up to ${MAX_AUTOMATIC_SCHEDULES} valid weekly posting times with platforms.`,
      400,
    );
  }

  const timezone =
    typeof body.timezone === "string" ? body.timezone : undefined;

  try {
    const { profile } = await requireAuthenticatedProfile();
    const result = await syncAutomaticSchedules({
      profile,
      slots,
      timezone,
    });

    return jsonResponse({
      ok: true,
      schedules: result.schedules,
      created: result.created,
      deleted: result.deleted,
      updated: result.updated,
      timezone: result.timezone,
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonError("Sign in required.", 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonError("A profile is required to save schedules.", 403);
    }
    if (error instanceof ScheduleSyncError) {
      return jsonError(error.message, error.status);
    }

    console.error("Automatic schedule update failed:", error);
    return jsonError("Unable to save your posting schedule right now.", 500);
  }
}
