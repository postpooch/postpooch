import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import { getDbPool } from "@/lib/db/client";
import { R2ImageUploadError, uploadImageToR2 } from "@/lib/images/r2";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function publicUrl(path: string): string {
  const base = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");
  if (!base) throw new Error("Missing R2 public URL configuration.");
  return `${base}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

async function ownedWebsiteId(websiteId: string, profileId: string) {
  const result = await getDbPool().query<{ id: string }>(
    "select id from public.websites where id = $1 and profile_id = $2 limit 1",
    [websiteId, profileId],
  );
  return result.rows[0]?.id ?? null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const { websiteId } = await params;
  if (!UUID_PATTERN.test(websiteId)) return jsonError("Website not found.", 404);
  try {
    const { profile } = await requireAuthenticatedProfile();
    if (!(await ownedWebsiteId(websiteId, profile.id))) return jsonError("Website not found.", 404);
    const prefix = `websites/${websiteId}/%`;
    const result = await getDbPool().query<{ id: string; path: string; created_at: Date }>(
      `select id, path, created_at from public.images
        where path like $1 order by created_at desc limit 100`,
      [prefix],
    );
    return NextResponse.json(
      { images: result.rows.map((image) => ({ ...image, url: publicUrl(image.path) })) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthenticationError) return jsonError("Sign in required.", 401);
    if (error instanceof MissingProfileError) return jsonError("A profile is required.", 403);
    console.error("Website image list failed:", error);
    return jsonError("Unable to load images right now.", 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const { websiteId } = await params;
  if (!UUID_PATTERN.test(websiteId)) return jsonError("Website not found.", 404);
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > MAX_IMAGE_BYTES + 100_000) {
    return jsonError("Image must be 12 MB or smaller.", 413);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    if (!(await ownedWebsiteId(websiteId, profile.id))) return jsonError("Website not found.", 404);
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return jsonError("Choose an image to upload.", 400);
    if (file.size > MAX_IMAGE_BYTES) return jsonError("Image must be 12 MB or smaller.", 413);

    const uploaded = await uploadImageToR2({
      image: file,
      directory: `websites/${websiteId}`,
      maxBytes: MAX_IMAGE_BYTES,
    });
    const inserted = await getDbPool().query<{ id: string }>(
      "insert into public.images (path) values ($1) returning id",
      [uploaded.key],
    );

    return NextResponse.json(
      {
        image: {
          id: inserted.rows[0]?.id,
          path: uploaded.key,
          url: uploaded.url,
          contentType: uploaded.contentType,
          bytes: uploaded.bytes,
        },
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthenticationError) return jsonError("Sign in required.", 401);
    if (error instanceof MissingProfileError) return jsonError("A profile is required.", 403);
    if (error instanceof R2ImageUploadError) return jsonError(error.message, 400);
    console.error("Website image upload failed:", error);
    return jsonError("Unable to upload that image right now.", 500);
  }
}
