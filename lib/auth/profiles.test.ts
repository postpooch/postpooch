import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  createZernioSocialProfile: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  getDbPool: () => ({ query: mocks.query }),
}));

vi.mock("@/lib/zernio/create-social-profile", () => ({
  createZernioSocialProfile: mocks.createZernioSocialProfile,
}));

import { createProfileForUser } from "@/lib/auth/profiles";

describe("createProfileForUser", () => {
  beforeEach(() => {
    mocks.query.mockReset();
    mocks.createZernioSocialProfile.mockReset();
  });

  it("creates the PostPooch profile when optional social setup is unavailable", async () => {
    mocks.query.mockResolvedValue({ rowCount: 1, rows: [] });
    mocks.createZernioSocialProfile.mockRejectedValue(
      new Error("Add a payment method to connect more than 2 accounts."),
    );

    await expect(
      createProfileForUser({
        userId: "11111111-2222-4333-8444-555555555555",
        email: "owner@example.com",
      }),
    ).resolves.toBeUndefined();

    expect(mocks.query).toHaveBeenCalledWith(
      expect.stringContaining("insert into public.profiles"),
      ["11111111-2222-4333-8444-555555555555", null],
    );
  });
});
