import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  listAutomaticSchedulesForProfile,
  toAutomaticScheduleDtos,
} from "@/lib/schedules";

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET() {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const rows = await listAutomaticSchedulesForProfile(profile.id);

    return jsonResponse({
      schedules: toAutomaticScheduleDtos(rows),
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonResponse({ error: "Sign in required." }, 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonResponse(
        { error: "A profile is required to view schedules." },
        403,
      );
    }

    console.error("Automatic schedule listing failed:", error);
    return jsonResponse({ error: "Unable to load schedules right now." }, 500);
  }
}
