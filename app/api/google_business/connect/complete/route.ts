import { z } from "zod";

import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { googleBusinessError, googleBusinessJson } from "@/lib/google-business/http";
import { googleBusinessWebhookUrl, GoogleBusinessService } from "@/lib/google-business/service";

const bodySchema = z.object({ accountId: z.string().trim().min(1).max(200) }).strict();

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return googleBusinessJson({ error: "Content-Type must be application/json." }, 415);
    }
    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return googleBusinessJson({ error: "A valid connected account is required." }, 400);
    const { profile } = await requireAuthenticatedProfile();
    if (!profile.social_profile_id) return googleBusinessJson({ error: "Finish account setup before connecting Google Business." }, 409);
    const service = new GoogleBusinessService();
    const connected = await service.completeConnection({
      profileId: profile.id,
      zernioProfileId: profile.social_profile_id,
      accountId: parsed.data.accountId,
    });
    if (connected.selectedLocationId) {
      await service.syncLocation(connected.selectedLocationId, async () => {});
    }
    const webhookConfigured = await service.ensureReviewWebhook(googleBusinessWebhookUrl(request));
    return googleBusinessJson({ ok: true, webhookConfigured, ...connected });
  } catch (error) {
    return googleBusinessError(error, "Unable to finish the Google Business connection.");
  }
}
