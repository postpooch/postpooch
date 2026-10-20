import { validUuid } from "@/lib/crm/http";
import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { SocialMediaContextRepository } from "@/lib/social-media/context/repository";
import { SocialMediaContextBuilderService } from "@/lib/social-media/context/service";
import { socialError, socialJson } from "@/lib/social-media/http";

export const maxDuration = 60;
type RouteContext = { params: Promise<{ noteId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { noteId } = await context.params;
    if (!validUuid(noteId)) return socialJson({ error: "That note could not be found." }, 404);
    const { profile } = await requireAuthenticatedProfile();
    const result = await new SocialMediaContextBuilderService(
      new SocialMediaContextRepository(profile.id),
    ).retry(noteId);
    if (result.kind === "processing") {
      const response = socialJson({ data: { state: "processing", noteId } }, 202);
      response.headers.set("Retry-After", "3");
      return response;
    }
    if (result.result.state === "conflict") return socialJson({ data: result.result, retry: true }, 409);
    if (result.result.state === "infrastructure_failure") return socialJson({ data: result.result, retryable: true }, 503);
    return socialJson({ data: result.result });
  } catch (error) {
    return socialError(error, "Unable to retry that note right now.");
  }
}
