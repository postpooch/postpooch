import { z } from "zod";

import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import { readJson } from "@/lib/crm/http";
import { SocialMediaContextRepository } from "@/lib/social-media/context/repository";
import { socialError, socialJson } from "@/lib/social-media/http";

const nullableText = (max: number) => z.union([z.string().trim().min(1).max(max), z.null()]);
const profileInput = z.object({
  identity: z.object({
    display_name: nullableText(120),
    professional_title: nullableText(120),
    brokerage_name: nullableText(160),
    target_audience: nullableText(1000),
    specialties: z.array(z.string().trim().min(1).max(80)).max(20),
    personal_context: nullableText(2000),
    primary_brand_color: z.union([z.string().regex(/^#[0-9A-Fa-f]{6}$/), z.null()]),
    secondary_brand_color: z.union([z.string().regex(/^#[0-9A-Fa-f]{6}$/), z.null()]),
  }).strict(),
  cityIds: z.array(z.string().uuid()).max(20),
  timeZone: z.string().trim().min(1).max(64).refine((value) => {
    try { Intl.DateTimeFormat(undefined, { timeZone: value }); return true; } catch { return false; }
  }, "A valid IANA time zone is required."),
}).strict();

export async function GET() {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const snapshot = await new SocialMediaContextRepository(profile.id).getSnapshot();
    return socialJson({
      data: {
        identity: snapshot.identity,
        cities: snapshot.markets.map(({ cityId: id, cityName, stateCode, color }) => ({ id, cityName, stateCode, color })),
        timeZone: snapshot.timeZone,
        revision: snapshot.revision,
      },
    });
  } catch (error) {
    return socialError(error, "Unable to load your social-media profile right now.");
  }
}

export async function PUT(request: Request) {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const input = await readJson(request, profileInput);
    const repository = new SocialMediaContextRepository(profile.id);
    const result = await repository.saveProfile(input);
    return socialJson({ data: result });
  } catch (error) {
    return socialError(error, "Unable to save your social-media profile right now.");
  }
}
