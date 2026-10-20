import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { googleBusinessError, googleBusinessJson } from "@/lib/google-business/http";
import { GoogleBusinessService } from "@/lib/google-business/service";

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request, context: RouteContext<"/api/google_business/locations/[locationId]/photos">) {
  try {
    const length = Number(request.headers.get("content-length"));
    if (Number.isFinite(length) && length > MAX_IMAGE_BYTES + 100_000) {
      return googleBusinessJson({ error: "Image must be 12 MB or smaller." }, 413);
    }
    const { locationId } = await context.params;
    const { profile } = await requireAuthenticatedProfile();
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File)) return googleBusinessJson({ error: "Choose an image to upload." }, 400);
    if (file.size > MAX_IMAGE_BYTES) return googleBusinessJson({ error: "Image must be 12 MB or smaller." }, 413);
    const uploaded = await new GoogleBusinessService().uploadLocationPhoto(profile.id, locationId, file);
    return googleBusinessJson({
      image: {
        url: uploaded.url,
        path: uploaded.key,
        contentType: uploaded.contentType,
        bytes: uploaded.bytes,
      },
    }, 201);
  } catch (error) {
    return googleBusinessError(error, "Unable to upload that photo right now.");
  }
}
