import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { z } from "zod";

import { connectCityToProfile, listCitiesForProfile } from "@/lib/social-media/cities";
import { socialError, socialJson } from "@/lib/social-media/http";
import { readJson } from "@/lib/crm/http";

export async function GET() {
  try {
    const { profile } = await requireAuthenticatedProfile();
    return socialJson({ data: await listCitiesForProfile(profile.id) });
  } catch (error) {
    return socialError(error, "Unable to load your cities right now.");
  }
}

const connectCityInput = z.object({
  cityId: z.string().uuid("A valid city is required."),
});

export async function POST(request: Request) {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const input = await readJson(request, connectCityInput);
    const city = await connectCityToProfile(profile.id, input.cityId);
    return socialJson({ data: city }, 201);
  } catch (error) {
    return socialError(error, "Unable to add that city right now.");
  }
}
