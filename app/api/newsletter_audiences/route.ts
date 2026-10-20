import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import {
  newsletterAudienceError,
  newsletterAudienceResponse,
  parseAudienceRequest,
} from "@/lib/newsletter-audiences/http";
import { newsletterAudienceInput } from "@/lib/newsletter-audiences/input";
import {
  createNewsletterAudience,
  listNewsletterAudiencesForProfile,
} from "@/lib/newsletter-audiences/store";

export async function GET() {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const audiences = await listNewsletterAudiencesForProfile(profile.id);
    return newsletterAudienceResponse({ audiences });
  } catch (error) {
    return newsletterAudienceError(error, "Unable to load audiences.");
  }
}

export async function POST(request: Request) {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const audience = newsletterAudienceInput.parse(
      await parseAudienceRequest(request),
    );
    const created = await createNewsletterAudience({
      profileId: profile.id,
      audience,
    });
    return newsletterAudienceResponse({ audience: created }, 201);
  } catch (error) {
    return newsletterAudienceError(error, "Unable to create that audience.");
  }
}
