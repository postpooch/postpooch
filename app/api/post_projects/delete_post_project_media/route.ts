import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  deletePostProjectMedia,
  PostProjectError,
} from "@/lib/post-projects";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type DeleteMediaBody = {
  projectId?: unknown;
  mediaId?: unknown;
};

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("Content-Type must be application/json.", 415);
  }

  let body: DeleteMediaBody;
  try {
    body = (await request.json()) as DeleteMediaBody;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  if (typeof body.projectId !== "string" || !UUID_PATTERN.test(body.projectId)) {
    return jsonError("A valid project id is required.", 400);
  }
  if (typeof body.mediaId !== "string" || !UUID_PATTERN.test(body.mediaId)) {
    return jsonError("A valid media id is required.", 400);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    await deletePostProjectMedia({
      projectId: body.projectId,
      profileId: profile.id,
      mediaId: body.mediaId,
    });

    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonError("Sign in required.", 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonError("A profile is required to delete a slide.", 403);
    }
    if (error instanceof PostProjectError) {
      return jsonError(
        error.message,
        error.code === "last_slide" ? 409 : 404,
      );
    }

    console.error("Post project media delete failed:", error);
    return jsonError("Unable to delete that slide right now.", 500);
  }
}
