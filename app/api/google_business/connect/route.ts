import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { googleBusinessError, googleBusinessJson } from "@/lib/google-business/http";
import { googleBusinessCallbackUrl, GoogleBusinessService } from "@/lib/google-business/service";

export async function POST(request: Request) {
  try {
    const { profile } = await requireAuthenticatedProfile();
    if (!profile.social_profile_id) return googleBusinessJson({ error: "Finish account setup before connecting Google Business." }, 409);
    const authUrl = await new GoogleBusinessService().startConnection(
      profile.social_profile_id,
      googleBusinessCallbackUrl(request),
    );
    return googleBusinessJson({ authUrl });
  } catch (error) {
    return googleBusinessError(error, "Unable to start the Google Business connection.");
  }
}
