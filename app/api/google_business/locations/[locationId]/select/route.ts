import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { googleBusinessError, googleBusinessJson } from "@/lib/google-business/http";
import { GoogleBusinessService } from "@/lib/google-business/service";

export async function POST(_request: Request, context: RouteContext<"/api/google_business/locations/[locationId]/select">) {
  try {
    const { locationId } = await context.params;
    const { profile } = await requireAuthenticatedProfile();
    await new GoogleBusinessService().selectLocation(profile.id, locationId);
    return googleBusinessJson({ ok: true });
  } catch (error) {
    return googleBusinessError(error, "Unable to switch Google Business locations.");
  }
}
