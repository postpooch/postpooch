import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  addPostProjectMedia,
  PostProjectError,
} from "@/lib/post-projects";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type AddMediaBody = {
  projectId?: unknown;
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

  let body: AddMediaBody;
  try {
    body = (await request.json()) as AddMediaBody;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  if (typeof body.projectId !== "string" || !UUID_PATTERN.test(body.projectId)) {
    return jsonError("A valid project id is required.", 400);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const media = await addPostProjectMedia(body.projectId, profile.id);

    return NextResponse.json(
      {
        media: {
          id: media.id,
          displayOrder: media.display_order,
          imageDesign: media.image_design,
        },
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonError("Sign in required.", 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonError("A profile is required to add a slide.", 403);
    }
    if (error instanceof PostProjectError) {
      return jsonError(
        error.message,
        error.code === "max_slides" ? 409 : 404,
      );
    }

    console.error("Post project media create failed:", error);
    return jsonError("Unable to add a slide right now.", 500);
  }
}
