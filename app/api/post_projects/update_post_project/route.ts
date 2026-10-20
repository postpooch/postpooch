import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  normalizeProjectName,
  toFabricImageDesign,
  updatePostProjectSlide,
  type PostProjectDocument,
} from "@/lib/post-projects";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_PROJECT_BYTES = 5_000_000;

type UpdateProjectBody = {
  id?: unknown;
  mediaId?: unknown;
  name?: unknown;
  imageDesign?: unknown;
};

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function isProjectDocument(value: unknown): value is PostProjectDocument {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function handleUpdate(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("Content-Type must be application/json.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_PROJECT_BYTES) {
    return jsonError("The project is too large to save.", 413);
  }

  let body: UpdateProjectBody;
  try {
    body = (await request.json()) as UpdateProjectBody;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  if (typeof body.id !== "string" || !UUID_PATTERN.test(body.id)) {
    return jsonError("A valid project id is required.", 400);
  }
  if (typeof body.mediaId !== "string" || !UUID_PATTERN.test(body.mediaId)) {
    return jsonError("A valid media id is required.", 400);
  }
  if (!isProjectDocument(body.imageDesign)) {
    return jsonError("A valid Fabric project document is required.", 400);
  }

  const imageDesign = toFabricImageDesign(body.imageDesign);
  const serializedDesign = JSON.stringify(imageDesign);
  if (Buffer.byteLength(serializedDesign, "utf8") > MAX_PROJECT_BYTES) {
    return jsonError("The project is too large to save.", 413);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const media = await updatePostProjectSlide({
      projectId: body.id,
      profileId: profile.id,
      mediaId: body.mediaId,
      name: normalizeProjectName(body.name),
      imageDesign,
    });

    // Ownership is part of the UPDATE predicate. A missing and a foreign project
    // intentionally have the same response so the endpoint cannot disclose ids.
    if (!media) {
      return jsonError("Project not found.", 404);
    }

    return NextResponse.json(
      { id: body.id, mediaId: media.id, savedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonError("Sign in required.", 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonError("A profile is required to save a project.", 403);
    }

    console.error("Post project update failed:", error);
    return jsonError("Unable to save the project right now.", 500);
  }
}

export async function PATCH(request: Request) {
  return handleUpdate(request);
}

// Keep POST available for callers that treat this named route as an action.
export async function POST(request: Request) {
  return handleUpdate(request);
}
