import { NextResponse } from "next/server";

import { getDbPool } from "@/lib/db/client";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Context = { params: Promise<{ token: string }> };

async function unsubscribe(token: string) {
  if (!UUID_PATTERN.test(token)) return false;
  const result = await getDbPool().query(
    `
      update public.crm_contacts c
      set email_marketing_status = 'unsubscribed',
          email_marketing_status_changed_at = now()
      from public.newsletter_sends s
      join public.newsletter_campaigns campaign
        on campaign.id = s.newsletter_campaign_id
      where s.unsubscribe_token = $1::uuid
        and c.id = s.crm_contact_id
        and c.profile_id = campaign.profile_id
      returning c.id
    `,
    [token],
  );
  return Boolean(result.rows[0]);
}

function html(message: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>PostPooch email preferences</title></head><body style="font-family:system-ui,sans-serif;max-width:560px;margin:80px auto;padding:24px;color:#241914"><h1 style="font-size:24px">${message}</h1><p>You can close this page.</p></body></html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
      },
    },
  );
}

function confirmationHtml(token: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>PostPooch email preferences</title></head><body style="font-family:system-ui,sans-serif;max-width:560px;margin:80px auto;padding:24px;color:#241914"><h1 style="font-size:24px">Unsubscribe from these emails?</h1><form method="post" action="/api/newsletter/unsubscribe/${token}"><input type="hidden" name="List-Unsubscribe" value="One-Click"><button type="submit" style="border:0;border-radius:8px;padding:12px 18px;background:#126e66;color:white;font-weight:600;cursor:pointer">Unsubscribe</button></form></body></html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
      },
    },
  );
}

export async function GET(_request: Request, context: Context) {
  const { token } = await context.params;
  // GET never mutates state: mailbox link scanners commonly prefetch URLs.
  return UUID_PATTERN.test(token)
    ? confirmationHtml(token)
    : html("This unsubscribe link is invalid or expired.", 404);
}

export async function POST(_request: Request, context: Context) {
  const { token } = await context.params;
  const success = await unsubscribe(token);
  return NextResponse.json(
    success ? { status: "unsubscribed" } : { error: "Invalid unsubscribe link." },
    {
      status: success ? 200 : 404,
      headers: { "Cache-Control": "private, no-store" },
    },
  );
}
