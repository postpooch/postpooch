import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  ensureProfileForUser: vi.fn(),
  runAccountSetup: vi.fn(),
  setSupabaseSessionCookies: vi.fn(),
}));

vi.mock("@/lib/auth/token_control", () => ({
  SESSION_LONG_SECONDS: 60,
  SESSION_SHORT_SECONDS: 30,
  createSupabaseAuthClient: () => ({
    auth: { signInWithPassword: mocks.signInWithPassword },
  }),
  setSupabaseSessionCookies: mocks.setSupabaseSessionCookies,
}));

vi.mock("@/lib/auth/profiles", () => ({
  ensureProfileForUser: mocks.ensureProfileForUser,
}));

vi.mock("@/lib/onboarding/account-setup", () => ({
  runAccountSetup: mocks.runAccountSetup,
}));

import { POST } from "@/app/api/auth/login/route";

describe("login account recovery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.signInWithPassword.mockResolvedValue({
      data: {
        session: { access_token: "access", refresh_token: "refresh" },
        user: {
          id: "11111111-2222-4333-8444-555555555555",
          email: "owner@example.com",
          email_confirmed_at: "2026-10-16T00:00:00.000Z",
        },
      },
      error: null,
    });
    mocks.ensureProfileForUser.mockResolvedValue(undefined);
    mocks.runAccountSetup.mockResolvedValue([]);
  });

  it("repairs a missing base profile before running account setup", async () => {
    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "owner@example.com",
          password: "valid-password",
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.ensureProfileForUser).toHaveBeenCalledWith({
      userId: "11111111-2222-4333-8444-555555555555",
    });
    expect(mocks.ensureProfileForUser.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.runAccountSetup.mock.invocationCallOrder[0]!,
    );
  });
});
