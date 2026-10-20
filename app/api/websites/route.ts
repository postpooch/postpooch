import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { getTemplateRouter } from "@/app/websites/[subdomain]/[[...path]]/templates/registry";
import { getWebsiteTemplate } from "@/app/websites/website-templates";
import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import { getDbPool } from "@/lib/db/client";
import { getWebsiteEditorForProfile } from "@/lib/websites/editor";
import { ensureWebsiteTemplateContent } from "@/lib/websites/template-content";

const MAX_BODY_BYTES = 10_000;
const RESERVED_SUBDOMAINS = new Set([
  "api",
  "app",
  "auth",
  "dashboard",
  "help",
  "mail",
  "support",
  "websites",
  "www",
]);

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

function baseSubdomain(email: string | undefined, profileId: string): string {
  const local = email?.split("@")[0] ?? `agent-${profileId.slice(0, 8)}`;
  let value = local
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  if (value.length < 3 || RESERVED_SUBDOMAINS.has(value)) value = `agent-${value || profileId.slice(0, 8)}`;
  return value.slice(0, 24).replace(/-+$/g, "");
}

export async function GET() {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const website = await getWebsiteEditorForProfile(profile.id);
    return NextResponse.json(
      { website },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthenticationError) return jsonError("Sign in required.", 401);
    if (error instanceof MissingProfileError) return jsonError("A profile is required.", 403);
    console.error("Website editor load failed:", error);
    return jsonError("Unable to load your website right now.", 500);
  }
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonError("Content-Type must be application/json.", 415);
  }
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > MAX_BODY_BYTES) return jsonError("Request is too large.", 413);

  let body: { template?: unknown };
  try {
    body = (await request.json()) as { template?: unknown };
  } catch {
    return jsonError("Invalid request body.", 400);
  }
  if (
    typeof body.template !== "string" ||
    !getWebsiteTemplate(body.template) ||
    !getTemplateRouter(body.template)
  ) {
    return jsonError("Choose a valid website template.", 400);
  }

  try {
    const { user, profile } = await requireAuthenticatedProfile();
    const client = await getDbPool().connect();
    try {
      await client.query("begin");
      await client.query("select pg_advisory_xact_lock(hashtext($1))", [profile.id]);
      const existing = await client.query<{ id: string; template: string | null }>(
        `select id, template from public.websites where profile_id = $1 order by created_at asc limit 1 for update`,
        [profile.id],
      );
      const current = existing.rows[0];
      let websiteId: string | null = null;

      if (current) {
        if (current.template !== body.template) {
          await client.query(
            "update public.websites set template = $1 where id = $2",
            [body.template, current.id],
          );
        }
        websiteId = current.id;
      } else {
        const base = baseSubdomain(user.email, profile.id);
        let created = false;
        for (let attempt = 0; attempt < 6 && !created; attempt++) {
          const suffix = attempt === 0 ? "" : `-${randomBytes(2).toString("hex")}`;
          const subdomain = `${base.slice(0, 30 - suffix.length)}${suffix}`;
          const inserted = await client.query<{ id: string }>(
            `insert into public.websites (profile_id, subdomain, template, settings)
             values ($1, $2, $3, '{}'::jsonb)
             on conflict do nothing
             returning id`,
            [profile.id, subdomain, body.template],
          );
          if (inserted.rows[0]?.id) {
            created = true;
            websiteId = inserted.rows[0].id;
          }
        }
        if (!created) throw new Error("Unable to allocate a unique website subdomain.");
      }

      if (websiteId) {
        await ensureWebsiteTemplateContent(client, websiteId, body.template);
      }
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }

    const website = await getWebsiteEditorForProfile(profile.id);
    return NextResponse.json(
      { website },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthenticationError) return jsonError("Sign in required.", 401);
    if (error instanceof MissingProfileError) return jsonError("A profile is required.", 403);
    console.error("Website template selection failed:", error);
    return jsonError("Unable to set up that template right now.", 500);
  }
}
