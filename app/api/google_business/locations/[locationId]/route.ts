import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { googleBusinessError, googleBusinessJson } from "@/lib/google-business/http";
import { GoogleBusinessService } from "@/lib/google-business/service";
import { formatValidationError, googleBusinessLocationPatchSchema } from "@/lib/google-business/validation";

export async function PATCH(request: Request, context: RouteContext<"/api/google_business/locations/[locationId]">) {
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return googleBusinessJson({ error: "Content-Type must be application/json." }, 415);
    }
    const parsed = googleBusinessLocationPatchSchema.safeParse(await request.json());
    if (!parsed.success) return googleBusinessJson({ error: formatValidationError(parsed.error) }, 400);
    const { locationId } = await context.params;
    const { profile } = await requireAuthenticatedProfile();
    const { location, photos } = await new GoogleBusinessService().updateLocation(profile.id, locationId, parsed.data);
    return googleBusinessJson({ location, photos });
  } catch (error) {
    return googleBusinessError(error, "Google did not accept that profile update.");
  }
}
