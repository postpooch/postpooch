import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  DummyTemplateError,
  listRecentNewsletterTemplates,
  MAX_IMAGE_BYTES,
  MAX_MJML_BYTES,
  seedNewsletterTemplate,
} from "@/lib/dummy/newsletter-template";
import { R2ImageUploadError } from "@/lib/images/r2";

export const maxDuration = 180;

const MAX_REQUEST_BYTES = MAX_MJML_BYTES + MAX_IMAGE_BYTES + 1_000_000;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function jsonError(message: string, status: number) {
  return json({ error: message }, status);
}

function parseOptionalString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : null;
}

function isMjmlFile(file: File) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".mjml")) return true;
  if (
    file.type === "text/xml" ||
    file.type === "application/xml" ||
    file.type === "text/plain" ||
    file.type === "text/html" ||
    file.type === "application/octet-stream"
  ) {
    return name.endsWith(".mjml") || name.endsWith(".xml");
  }
  return false;
}

function isPreviewImage(file: File) {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|gif|webp|avif)$/i.test(file.name);
}

function collectMjmlFile(form: FormData) {
  const candidates = [
    ...form.getAll("mjml"),
    ...form.getAll("file"),
    ...form.getAll("template"),
  ].filter((entry): entry is File => entry instanceof File && entry.size > 0);

  for (const file of candidates) {
    if (isMjmlFile(file) || file.name.toLowerCase().endsWith(".mjml")) {
      return file;
    }
  }

  // Allow a single unnamed .mjml-looking upload even if MIME is odd.
  const first = candidates[0];
  if (first && first.name.toLowerCase().endsWith(".mjml")) return first;
  return null;
}

function collectPreviewImage(form: FormData) {
  const candidates = [
    ...form.getAll("preview"),
    ...form.getAll("preview_image"),
    ...form.getAll("image"),
  ].filter((entry): entry is File => entry instanceof File && entry.size > 0);

  for (const file of candidates) {
    if (isPreviewImage(file)) return file;
  }
  return null;
}

export async function GET() {
  try {
    await requireAuthenticatedProfile();
    const templates = await listRecentNewsletterTemplates();
    return json({ templates });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return jsonError("Sign in required.", 401);
    }
    if (error instanceof MissingProfileError) {
      return jsonError("A profile is required.", 403);
    }
    console.error("Dummy newsletter template list failed:", error);
    return jsonError("Unable to load newsletter templates right now.", 500);
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
    const mjmlFile = collectMjmlFile(form);

    if (!mjmlFile) {
      return jsonError("Choose an MJML file.", 400);
    }
    if (mjmlFile.size > MAX_MJML_BYTES) {
      return jsonError("MJML files must be 5 MB or smaller.", 413);
    }

    const previewFile = collectPreviewImage(form);
    if (previewFile && previewFile.size > MAX_IMAGE_BYTES) {
      return jsonError("Preview images must be 20 MB or smaller.", 413);
    }

    const mjmlBytes = Buffer.from(await mjmlFile.arrayBuffer());
    const previewImage = previewFile
      ? Buffer.from(await previewFile.arrayBuffer())
      : null;

    const template = await seedNewsletterTemplate({
      mjmlBytes,
      name: parseOptionalString(form.get("name")),
      previewImage,
      firstFileName: mjmlFile.name,
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

    console.error("Dummy newsletter template seed failed:", error);
    return jsonError(
      "Something went wrong while creating the newsletter template.",
      500,
    );
  }
}
