import { NextResponse } from "next/server";

import {
  updateFacebookAccountId,
  updateInstagramAccountId,
} from "@/lib/auth/profiles";
import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  ZernioConnectError,
  isConnectablePlatform,
  platformDisplayName,
  verifyConnectedAccount,
} from "@/lib/zernio/connect-account";

type GetAccountIdBody = {
  platform?: unknown;
  accountId?: unknown;
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

  let body: GetAccountIdBody;

  try {
    body = (await request.json()) as GetAccountIdBody;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  if (!isConnectablePlatform(body.platform)) {
    return jsonError("Choose Instagram or Facebook to save.", 400);
  }

  const accountId =
    typeof body.accountId === "string" ? body.accountId.trim() : "";

  if (!accountId) {
    return jsonError("A connected account id is required.", 400);
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

    const verified = await verifyConnectedAccount({
      socialProfileId: profile.social_profile_id,
      platform,
      accountId,
    });

    if (!verified) {
      return jsonError(
        "That account could not be verified for your profile.",
        404,
      );
    }

    if (platform === "instagram") {
      await updateInstagramAccountId(profile.id, verified.accountId);
    } else {
      await updateFacebookAccountId(profile.id, verified.accountId);
    }

    return jsonResponse({
      ok: true,
      platform: verified.platform,
      accountId: verified.accountId,
      username: verified.username,
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonError("Sign in required.", 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonError("A profile is required to save a channel.", 403);
    }
    if (error instanceof ZernioConnectError) {
      return jsonError(error.message, error.status);
    }

    console.error(
      `Failed to save ${platformDisplayName(platform)} account:`,
      error,
    );
    return jsonError(
      `Unable to save the ${platformDisplayName(platform)} connection right now.`,
      500,
    );
  }
}
