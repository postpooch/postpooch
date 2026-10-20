import { describe, expect, it, vi } from "vitest";

import { runAccountSetup } from "@/lib/onboarding/account-setup";

describe("runAccountSetup", () => {
  it("runs newsletter setup and future setup steps through one wrapper", async () => {
    const calls: string[] = [];
    const result = await runAccountSetup(
      {
        profileId: "11111111-2222-4333-8444-555555555555",
        email: "owner@example.com",
        emailVerified: true,
      },
      {
        newsletterSetup: vi.fn(async () => calls.push("newsletter")),
        additionalSteps: [
          { name: "future-step", run: async () => calls.push("future") },
        ],
      },
    );

    expect(calls).toEqual(["newsletter", "future"]);
    expect(result).toEqual([
      { name: "newsletter-sender", status: "complete" },
      { name: "future-step", status: "complete" },
    ]);
  });

  it("reports the exact failed step and stops dependent setup", async () => {
    await expect(
      runAccountSetup(
        {
          profileId: "11111111-2222-4333-8444-555555555555",
          email: "owner@example.com",
          emailVerified: false,
        },
        {
          newsletterSetup: async () => {
            throw new Error("database unavailable");
          },
          additionalSteps: [],
        },
      ),
    ).rejects.toThrow("newsletter-sender");
  });
});
