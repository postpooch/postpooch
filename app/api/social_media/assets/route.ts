import { NextResponse } from "next/server";

import { requireAuthenticatedProfile } from "@/lib/auth/token_check";
import {
  createSocialMediaAsset,
  listSocialMediaAssets,
  SOCIAL_ASSET_MAX_BYTES,
  SocialMediaAssetError,
} from "@/lib/social-media/assets";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { profile } = await requireAuthenticatedProfile();
    return NextResponse.json({ assets: await listSocialMediaAssets(profile.id) });
  } catch (error) {
    if (error instanceof SocialMediaAssetError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Unable to load social-media images." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { profile } = await requireAuthenticatedProfile();
    const form = await request.formData();
    const file = form.get("image");
    const purpose = form.get("purpose");
    if (!(file instanceof File) || typeof purpose !== "string") {
      return NextResponse.json({ error: "An image and purpose are required." }, { status: 400 });
    }
    if (file.size < 1 || file.size > SOCIAL_ASSET_MAX_BYTES) {
      return NextResponse.json({ error: "The image must be 20 MB or smaller." }, { status: 400 });
    }
    const asset = await createSocialMediaAsset({
      profileId: profile.id,
      purpose,
      originalFilename: file.name,
      bytes: Buffer.from(await file.arrayBuffer()),
    });
    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    if (error instanceof SocialMediaAssetError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Unable to upload that image." }, { status: 500 });
  }
}
