import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  displayProjectName,
  getPostProjectForProfile,
} from "@/lib/post-projects";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !UUID_PATTERN.test(id)) {
    return jsonResponse({ error: "A valid project id is required." }, 400);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const project = await getPostProjectForProfile(id, profile.id);

    if (!project) {
      return jsonResponse({ error: "Project not found." }, 404);
    }

    return jsonResponse({
      project: {
        id: project.id,
        createdAt: project.created_at,
        name: displayProjectName(project.name),
        media: project.media.map((item) => ({
          id: item.id,
          displayOrder: item.display_order,
          imageDesign: item.image_design,
        })),
      },
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonResponse({ error: "Sign in required." }, 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonResponse({ error: "A profile is required to view this project." }, 403);
    }

    console.error("Post project lookup failed:", error);
    return jsonResponse({ error: "Unable to load the project right now." }, 500);
  }
}
