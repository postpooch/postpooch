import { z } from "zod";

import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { readJson } from "@/lib/crm/http";
import { SocialMediaContextRepository, canonicalizeNote } from "@/lib/social-media/context/repository";
import { SocialMediaContextBuilderService } from "@/lib/social-media/context/service";
import { socialError, socialJson } from "@/lib/social-media/http";

export const maxDuration = 60;

const submitNoteInput = z.object({
  note: z.string().transform(canonicalizeNote).pipe(z.string().min(1).max(4000)),
  submissionKey: z.string().uuid(),
  assetIds: z.array(z.string().uuid()).max(10).default([]),
}).strict();

function noteResponse(result: Awaited<ReturnType<SocialMediaContextBuilderService["submit"]>>) {
  if (result.kind === "processing") {
    const response = socialJson({ data: { state: "processing", noteId: result.noteId } }, 202);
    response.headers.set("Retry-After", "3");
    return response;
  }
  if (result.result.state === "conflict") return socialJson({ data: result.result, retry: true }, 409);
  if (result.result.state === "infrastructure_failure") return socialJson({ data: result.result, retryable: true }, 503);
  return socialJson({ data: result.result }, result.replay ? 200 : 201);
}

export async function GET() {
  try {
    const { profile } = await requireAuthenticatedProfile();
    return socialJson({ data: await new SocialMediaContextRepository(profile.id).listNotes() });
  } catch (error) {
    return socialError(error, "Unable to load note history right now.");
  }
}

export async function POST(request: Request) {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const input = await readJson(request, submitNoteInput);
    const repository = new SocialMediaContextRepository(profile.id);
    return noteResponse(await new SocialMediaContextBuilderService(repository).submit(input.note, input.submissionKey, input.assetIds));
  } catch (error) {
    return socialError(error, "Unable to process that note right now.");
  }
}
