import { validUuid } from "@/lib/crm/http";
import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { disconnectCityFromProfile } from "@/lib/social-media/cities";
import { socialError, socialJson } from "@/lib/social-media/http";

type RouteContext = { params: Promise<{ cityId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { cityId } = await context.params;
    if (!validUuid(cityId)) {
      return socialJson({ error: "That city could not be found." }, 404);
    }

    const { profile } = await requireAuthenticatedProfile();
    const removed = await disconnectCityFromProfile(profile.id, cityId);
    if (!removed) {
      return socialJson({ error: "That city could not be found." }, 404);
    }

    return socialJson({ ok: true });
  } catch (error) {
    return socialError(error, "Unable to remove that city right now.");
  }
}
