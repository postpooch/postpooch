import { NextResponse } from "next/server";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import { queueNewsletterCampaign } from "@/lib/newsletter-campaigns/queue";
import {
  getOwnedNewsletterCampaign,
  recordNewsletterCampaignQueued,
  recordNewsletterCampaignQueueFailure,
} from "@/lib/newsletter-campaigns/store";

type Context = { params: Promise<{ campaignId: string }> };

function response(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function POST(_request: Request, context: Context) {
  const { campaignId } = await context.params;
  try {
    const { profile } = await requireAuthenticatedProfile();
    const campaign = await getOwnedNewsletterCampaign(campaignId, profile.id);
    if (!campaign) return response({ error: "Campaign not found." }, 404);
    if (campaign.status === "cancelled") {
      return response({ error: "A cancelled campaign cannot be started." }, 409);
    }

    try {
      const messageId = await queueNewsletterCampaign(campaign.id);
      await recordNewsletterCampaignQueued(campaign.id, messageId);
      return response({ campaignId: campaign.id, status: "queued" }, 202);
    } catch (error) {
      await recordNewsletterCampaignQueueFailure(campaign.id);
      console.error("Newsletter campaign dispatch retry failed", {
        campaignId: campaign.id,
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
      return response(
        {
          campaignId: campaign.id,
          status: "queue_failed",
          error: "AWS still could not confirm dispatch. You can retry again safely.",
          retryable: true,
        },
        503,
      );
    }
  } catch (error) {
    if (error instanceof AuthenticationError) return response({ error: "Sign in required." }, 401);
    if (error instanceof MissingProfileError) return response({ error: "A profile is required." }, 403);
    return response({ error: "Unable to retry this campaign." }, 500);
  }
}

