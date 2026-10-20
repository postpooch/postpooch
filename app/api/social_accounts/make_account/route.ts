import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  ZernioConnectError,
  buildConnectCallbackUrl,
  getPlatformConnectAuthUrl,
  isConnectablePlatform,
  platformDisplayName,
} from "@/lib/zernio/connect-account";

type MakeAccountBody = {
  platform?: unknown;
};

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function jsonError(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("Content-Type must be application/json.", 415);
  }

  let body: MakeAccountBody;

  try {
    body = (await request.json()) as MakeAccountBody;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  if (!isConnectablePlatform(body.platform)) {
    return jsonError("Choose Instagram or Facebook to connect.", 400);
  }

  const platform = body.platform;

  try {
    const { profile } = await requireAuthenticatedProfile();

    if (!profile.social_profile_id) {
      return jsonError(
        "Finish account setup before connecting a channel.",
        409,
      );
    }

    const redirectUrl = buildConnectCallbackUrl(request);
    const authUrl = await getPlatformConnectAuthUrl({
      platform,
      socialProfileId: profile.social_profile_id,
      redirectUrl,
    });

    return jsonResponse({ authUrl });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonError("Sign in required.", 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonError("A profile is required to connect a channel.", 403);
    }
    if (error instanceof ZernioConnectError) {
      return jsonError(error.message, error.status);
    }

    console.error(
      `Failed to start ${platformDisplayName(platform)} connect:`,
      error,
    );
    return jsonError(
      `Unable to start the ${platformDisplayName(platform)} connection right now.`,
      500,
    );
  }
}
