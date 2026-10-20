import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { googleBusinessError, googleBusinessJson } from "@/lib/google-business/http";
import { GoogleBusinessService } from "@/lib/google-business/service";

export async function GET() {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const dashboard = await new GoogleBusinessService().getDashboard(profile.id);
    return googleBusinessJson({ dashboard });
  } catch (error) {
    return googleBusinessError(error, "Unable to load Google Business right now.");
  }
}
