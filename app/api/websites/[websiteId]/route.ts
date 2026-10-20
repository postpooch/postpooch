import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getTemplateRouter } from "@/app/websites/[subdomain]/[[...path]]/templates/registry";
import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import { getDbPool } from "@/lib/db/client";
import { replaceWebsiteBlogPosts } from "@/lib/websites/blog-post-store";
import { findOwnedWebsite } from "@/lib/websites/editor";
import { replaceWebsiteProperties } from "@/lib/websites/property-store";
import {
  upsertWebsitePage,
  upsertWebsiteTemplateSettings,
} from "@/lib/websites/template-content";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_DOCUMENT_BYTES = 4_000_000;

function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

type PublishBody = {
  settings?: unknown;
  page?: { path?: unknown; content?: unknown };
  propertiesEnabled?: unknown;
  blogPostsEnabled?: unknown;
  properties?: unknown;
  blogPosts?: unknown;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  const { websiteId } = await params;
  if (!UUID_PATTERN.test(websiteId)) return jsonError("Website not found.", 404);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("Content-Type must be application/json.", 415);
  }
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > MAX_DOCUMENT_BYTES) return jsonError("Website document is too large.", 413);

  let body: PublishBody;
  try {
    body = (await request.json()) as PublishBody;
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  if (!body.page || typeof body.page.path !== "string") {
    return jsonError("A page path and content are required.", 400);
  }
  if (typeof body.propertiesEnabled !== "boolean") {
    return jsonError("Choose whether properties should appear on your website.", 400);
  }
  if (typeof body.blogPostsEnabled !== "boolean") {
    return jsonError("Choose whether posts should appear on your website.", 400);
  }
  if (!Array.isArray(body.properties)) {
    return jsonError("A properties list is required.", 400);
  }
  if (!Array.isArray(body.blogPosts)) {
    return jsonError("A posts list is required.", 400);
  }
  if (Buffer.byteLength(JSON.stringify(body), "utf8") > MAX_DOCUMENT_BYTES) {
    return jsonError("Website document is too large.", 413);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const client = await getDbPool().connect();
    let subdomain = "";
    try {
      await client.query("begin");
      const website = await findOwnedWebsite(client, websiteId, profile.id);
      if (!website?.template || !website.subdomain) {
        await client.query("rollback");
        return jsonError("Website not found.", 404);
      }
      const router = getTemplateRouter(website.template);
      if (!router || !router.editorRoutes.some((route) => route.path === body.page?.path)) {
        await client.query("rollback");
        return jsonError("That page does not belong to this template.", 400);
      }

      let settings: unknown;
      let content: unknown;
      try {
        settings = router.resolveSettings(body.settings);
        content = router.resolveContent(body.page.path, body.page.content);
        await replaceWebsiteProperties(client, website.id, body.properties);
        await replaceWebsiteBlogPosts(client, website.id, body.blogPosts);
      } catch (error) {
        const issues = (error as { issues?: unknown }).issues;
        await client.query("rollback");
        return jsonError("Some website fields are invalid.", 422, issues);
      }

      await client.query(
        "update public.websites set properties_enabled = $1, blog_posts_enabled = $2 where id = $3",
        [body.propertiesEnabled, body.blogPostsEnabled, website.id],
      );
      await upsertWebsiteTemplateSettings(
        client,
        website.id,
        website.template,
        settings,
      );
      await upsertWebsitePage(
        client,
        website.id,
        website.template,
        body.page.path,
        content,
      );
      await client.query("commit");
      subdomain = website.subdomain;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }

    revalidatePath(`/websites/${subdomain}`);
    return NextResponse.json(
      { publishedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthenticationError) return jsonError("Sign in required.", 401);
    if (error instanceof MissingProfileError) return jsonError("A profile is required.", 403);
    console.error("Website publish failed:", error);
    return jsonError("Unable to publish your website right now.", 500);
  }
}
