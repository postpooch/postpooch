import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import { getDbPool } from "@/lib/db/client";
import { deleteImageFromR2, R2ImageDeleteError } from "@/lib/images/r2";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ websiteId: string; imageId: string }> },
) {
  const { websiteId, imageId } = await params;
  if (!UUID_PATTERN.test(websiteId) || !UUID_PATTERN.test(imageId)) {
    return jsonError("Image not found.", 404);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const result = await getDbPool().query<{ path: string }>(
      `select i.path
         from public.images i
         join public.websites w on w.id = $1 and w.profile_id = $2
        where i.id = $3 and i.path like $4
        limit 1`,
      [websiteId, profile.id, imageId, `websites/${websiteId}/%`],
    );
    const image = result.rows[0];
    if (!image) return jsonError("Image not found.", 404);

    const reference = await getDbPool().query<{ used: boolean }>(
      `select (
         exists(
           select 1
             from public.website_template_settings
            where website_id = $1
              and settings::text like '%' || $2 || '%'
         )
         or exists(
           select 1
             from public.pages
            where website_id = $1
              and content::text like '%' || $2 || '%'
         )
       ) as used`,
      [websiteId, image.path],
    );
    if (reference.rows[0]?.used) {
      return jsonError("Remove this image from every page before deleting it.", 409);
    }

    const duplicates = await getDbPool().query<{ count: string }>(
      "select count(*)::text as count from public.images where path = $1 and id <> $2",
      [image.path, imageId],
    );
    if (Number(duplicates.rows[0]?.count ?? 0) === 0) {
      await deleteImageFromR2({ key: image.path });
    }
    await getDbPool().query("delete from public.images where id = $1", [imageId]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof AuthenticationError) return jsonError("Sign in required.", 401);
    if (error instanceof MissingProfileError) return jsonError("A profile is required.", 403);
    if (error instanceof R2ImageDeleteError) return jsonError(error.message, 502);
    console.error("Website image delete failed:", error);
    return jsonError("Unable to delete that image right now.", 500);
  }
}
