import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  message: z.string().min(1).max(5000),
});

/** Stub feedback endpoint — Classic OpenCut wrote to Postgres. */
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
    }

    const entry = {
      id: crypto.randomUUID(),
      message: parsed.data.message,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ entry });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
