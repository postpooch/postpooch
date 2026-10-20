import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  displayProjectName,
  listPostProjectsForProfile,
  type PostProjectCursor,
} from "@/lib/post-projects";

const PAGE_SIZE = 12;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

function decodeCursor(rawCursor: string | null): PostProjectCursor | undefined {
  if (!rawCursor) return undefined;

  try {
    const parsed = JSON.parse(
      Buffer.from(rawCursor, "base64url").toString("utf8"),
    ) as { createdAt?: unknown; id?: unknown };
    if (
      typeof parsed.createdAt !== "string" ||
      !Number.isFinite(Date.parse(parsed.createdAt)) ||
      typeof parsed.id !== "string" ||
      !UUID_PATTERN.test(parsed.id)
    ) {
      return undefined;
    }

    return { createdAt: parsed.createdAt, id: parsed.id };
  } catch {
    return undefined;
  }
}

function encodeCursor(cursor: PostProjectCursor | null) {
  return cursor
    ? Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url")
    : null;
}

export async function GET(request: Request) {
  const rawCursor = new URL(request.url).searchParams.get("cursor");
  const cursor = decodeCursor(rawCursor);
  if (rawCursor && !cursor) {
    return jsonResponse({ error: "Invalid project cursor." }, 400);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const page = await listPostProjectsForProfile({
      profileId: profile.id,
      limit: PAGE_SIZE,
      cursor,
    });

    return jsonResponse({
      projects: page.projects.map((project) => ({
        id: project.id,
        createdAt: project.created_at,
        name: displayProjectName(project.name),
        imageDesign: project.preview_image_design,
      })),
      nextCursor: encodeCursor(page.nextCursor),
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonResponse({ error: "Sign in required." }, 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonResponse({ error: "A profile is required to view projects." }, 403);
    }

    console.error("Post project listing failed:", error);
    return jsonResponse({ error: "Unable to load projects right now." }, 500);
  }
}
