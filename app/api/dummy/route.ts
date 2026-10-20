import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  DummyTemplateError,
  listRecentDummyTemplates,
  MAX_IMAGE_BYTES,
  MAX_TEMPLATE_IMAGES,
  seedSocialTemplate,
} from "@/lib/dummy/social-template";
import { R2ImageUploadError } from "@/lib/images/r2";

export const maxDuration = 180;

const MAX_REQUEST_BYTES =
  MAX_IMAGE_BYTES * MAX_TEMPLATE_IMAGES + 1_000_000;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function jsonError(message: string, status: number) {
  return json({ error: message }, status);
}

function parseBoolean(value: FormDataEntryValue | null, fallback: boolean) {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "on", "yes"].includes(normalized)) return true;
  if (["0", "false", "off", "no"].includes(normalized)) return false;
  return fallback;
}

function parseOptionalString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : null;
}

function isFrameFile(file: File) {
  if (file.type.startsWith("image/")) return true;
  if (file.type === "application/json" || file.type === "text/json") return true;
  return file.name.toLowerCase().endsWith(".json");
}

function collectFrames(form: FormData) {
  const files = [
    ...form.getAll("images"),
    ...form.getAll("image"),
  ].filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const unique: File[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    if (!isFrameFile(file)) continue;
    const token = `${file.name}:${file.size}:${file.lastModified}`;
    if (seen.has(token)) continue;
    seen.add(token);
    unique.push(file);
  }
  return unique;
}

export async function GET() {
  try {
    await requireAuthenticatedProfile();
    const templates = await listRecentDummyTemplates();
    return json({ templates });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonError("Sign in required.", 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonError("A profile is required.", 403);
    }
    console.error("Dummy template list failed:", error);
    return jsonError("Unable to load templates right now.", 500);
  }
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > MAX_REQUEST_BYTES) {
    return jsonError("That upload is too large.", 413);
  }

  try {
    await requireAuthenticatedProfile();
    const form = await request.formData();
    const files = collectFrames(form);

    if (files.length === 0) {
      return jsonError("Choose at least one image or Fabric JSON frame.", 400);
    }
    if (files.length > MAX_TEMPLATE_IMAGES) {
      return jsonError(
        `Templates can have at most ${MAX_TEMPLATE_IMAGES} images.`,
        400,
      );
    }

    for (const file of files) {
      if (file.size > MAX_IMAGE_BYTES) {
        return jsonError("Images must be 20 MB or smaller.", 413);
      }
    }

    const images = await Promise.all(
      files.map(async (file) => Buffer.from(await file.arrayBuffer())),
    );

    const template = await seedSocialTemplate({
      images,
      name: parseOptionalString(form.get("name")),
      text: parseOptionalString(form.get("text")),
      aiPrompt: parseOptionalString(form.get("ai_prompt")),
      editorAccessible: parseBoolean(form.get("editor_accessible"), true),
      automateAccessible: parseBoolean(form.get("automate_accessible"), true),
      firstFileName: files[0]?.name ?? null,
    });

    return json({ template }, 201);
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonError("Sign in required.", 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonError("A profile is required.", 403);
    }
    if (error instanceof DummyTemplateError) {
      return jsonError(error.message, error.status);
    }
    if (error instanceof R2ImageUploadError) {
      const isStorageFailure =
        error.message === "Failed to upload image to R2.";
      const isInvalidImage =
        error.message === "Image cannot be empty." ||
        error.message.startsWith("Image is ") ||
        error.message.startsWith("Unsupported image format.");

      return jsonError(
        isInvalidImage
          ? error.message
          : isStorageFailure
            ? "R2 could not store the image. Please try again."
            : "R2 is not configured for uploads.",
        isInvalidImage ? 400 : isStorageFailure ? 502 : 500,
      );
    }

    console.error("Dummy template seed failed:", error);
    return jsonError("Something went wrong while creating the template.", 500);
  }
}
