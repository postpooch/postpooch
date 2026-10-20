import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import {
  newsletterAudienceError,
  newsletterAudienceResponse,
  parseAudienceRequest,
} from "@/lib/newsletter-audiences/http";
import { newsletterAudienceInput } from "@/lib/newsletter-audiences/input";
import {
  deleteNewsletterAudience,
  NewsletterAudienceNotFoundError,
  updateNewsletterAudience,
} from "@/lib/newsletter-audiences/store";

type Context = { params: Promise<{ audienceId: string }> };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function audienceIdFrom(context: Context) {
  const { audienceId } = await context.params;
  if (!UUID_PATTERN.test(audienceId)) throw new NewsletterAudienceNotFoundError();
  return audienceId;
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const audience = newsletterAudienceInput.parse(
      await parseAudienceRequest(request),
    );
    const updated = await updateNewsletterAudience({
      profileId: profile.id,
      audienceId: await audienceIdFrom(context),
      audience,
    });
    return newsletterAudienceResponse({ audience: updated });
  } catch (error) {
    return newsletterAudienceError(error, "Unable to update that audience.");
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { profile } = await requireAuthenticatedProfile();
    await deleteNewsletterAudience({
      profileId: profile.id,
      audienceId: await audienceIdFrom(context),
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return newsletterAudienceError(error, "Unable to delete that audience.");
  }
}
