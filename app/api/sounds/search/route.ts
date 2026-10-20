import { NextResponse } from "next/server";

/**
 * Stub Freesound proxy — Classic OpenCut required FREESOUND_API_KEY.
 * Returns an empty catalog so the Sounds panel stays usable without credentials.
 */
export async function GET() {
  return NextResponse.json({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
}
