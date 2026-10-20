import { z } from "zod";

import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { readJson } from "@/lib/crm/http";
import { retireSocialMediaAsset } from "@/lib/social-media/asset-retirement";
import { socialError, socialJson } from "@/lib/social-media/http";

export const maxDuration = 60;

const inputSchema = z.object({ submissionKey: z.string().uuid() }).strict();

export async function DELETE(request: Request, context: { params: Promise<{ assetId: string }> }) {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const { assetId } = await context.params;
    const id = z.string().uuid().parse(assetId);
    const input = await readJson(request, inputSchema);
    const result = await retireSocialMediaAsset({
      profileId: profile.id,
      assetId: id,
      submissionKey: input.submissionKey,
    });
    return socialJson({ data: result }, result.state === "processing" ? 202 : 200);
  } catch (error) {
    return socialError(error, "Unable to retire that image right now.");
  }
}
