import { createHmac, timingSafeEqual } from "node:crypto";
import type { WebhookPayloadReviewNew, WebhookPayloadReviewUpdated } from "@zernio/node";

import { googleBusinessJson } from "@/lib/google-business/http";
import { GoogleBusinessService } from "@/lib/google-business/service";

function validSignature(rawBody: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  if (signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function isReviewPayload(value: unknown): value is WebhookPayloadReviewNew | WebhookPayloadReviewUpdated {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return (
    (payload.event === "review.new" || payload.event === "review.updated") &&
    typeof payload.id === "string" &&
    typeof payload.timestamp === "string" &&
    Boolean(payload.review && typeof payload.review === "object") &&
    Boolean(payload.account && typeof payload.account === "object")
  );
}

export async function POST(request: Request) {
  const secret = process.env.ZERNIO_WEBHOOK_SECRET?.trim();
  const signature = request.headers.get("x-zernio-signature") ?? request.headers.get("x-late-signature");
  if (!secret || !signature) return googleBusinessJson({ error: "Webhook authentication is required." }, 401);
  const rawBody = await request.text();
  if (!validSignature(rawBody, signature, secret)) return googleBusinessJson({ error: "Invalid webhook signature." }, 401);
  let payload: unknown;
  try { payload = JSON.parse(rawBody); } catch { return googleBusinessJson({ error: "Invalid webhook body." }, 400); }
  if ((payload as { event?: unknown }).event === "webhook.test") return googleBusinessJson({ ok: true });
  if (!isReviewPayload(payload)) return googleBusinessJson({ ok: true, ignored: true });
  try {
    const status = await new GoogleBusinessService().processReviewWebhook(payload);
    return googleBusinessJson({ ok: true, status });
  } catch (error) {
    console.error("Google Business webhook processing failed", error);
    return googleBusinessJson({ error: "Webhook processing failed." }, 500);
  }
}
