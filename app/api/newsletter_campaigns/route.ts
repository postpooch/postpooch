import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  AuthenticationError,
  MissingProfileError,
  requireAuthenticatedProfile,
} from "@/lib/auth/token_check";
import {
  createNewsletterCampaignSchema,
  createOrReuseNewsletterCampaign,
  recordNewsletterCampaignQueued,
  recordNewsletterCampaignQueueFailure,
} from "@/lib/newsletter-campaigns/store";
import { queueNewsletterCampaign } from "@/lib/newsletter-campaigns/queue";

function response(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return response({ error: "Content-Type must be application/json." }, 415);
  }

  try {
    const { profile } = await requireAuthenticatedProfile();
    const input = createNewsletterCampaignSchema.parse(await request.json());

    const campaign = await createOrReuseNewsletterCampaign({
      profileId: profile.id,
      campaign: input,
    });

    if (
      campaign.reused &&
      (campaign.dispatchStatus === "queued" || campaign.dispatchStatus === "fanout_complete")
    ) {
      return response(
        { campaignId: campaign.campaignId, status: "queued", reused: true },
        202,
      );
    }

    try {
      const messageId = await queueNewsletterCampaign(campaign.campaignId);
      await recordNewsletterCampaignQueued(campaign.campaignId, messageId);
      return response(
        { campaignId: campaign.campaignId, status: "queued", reused: campaign.reused },
        202,
      );
    } catch (error) {
      await recordNewsletterCampaignQueueFailure(campaign.campaignId);
      console.error("Newsletter campaign dispatch enqueue failed", {
        campaignId: campaign.campaignId,
        errorName: error instanceof Error ? error.name : "UnknownError",
      });
      return response(
        {
          campaignId: campaign.campaignId,
          status: "queue_failed",
          error: "The campaign was saved, but sending did not start. Retry is safe.",
          retryable: true,
        },
        503,
      );
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return response({ error: "Sign in required." }, 401);
    }
    if (error instanceof MissingProfileError) {
      return response({ error: "A profile is required." }, 403);
    }
    if (error instanceof ZodError || error instanceof SyntaxError) {
      return response({ error: "Check the campaign details and try again." }, 400);
    }

    const code = error instanceof Error ? error.message : "";
    if (code === "NEWSLETTER_EMAIL_NOT_FOUND" || code === "NEWSLETTER_CAMPAIGN_NOT_FOUND") {
      return response({ error: "Newsletter draft not found." }, 404);
    }
    if (code === "NEWSLETTER_EMAIL_EMPTY") {
      return response({ error: "Add email content before sending." }, 400);
    }
    if (code === "NEWSLETTER_AUDIENCE_NOT_FOUND") {
      return response({ error: "One or more selected audiences are unavailable." }, 400);
    }
    if (code === "NEWSLETTER_SENDER_NOT_READY") {
      return response(
        { error: "Your sending address is still being prepared. Please try again shortly." },
        409,
      );
    }

    console.error("Newsletter campaign creation failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return response({ error: "Unable to save the campaign." }, 500);
  }
}
