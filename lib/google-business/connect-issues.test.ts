import { describe, expect, it } from "vitest";

import {
  GOOGLE_BUSINESS_ADD_LOCATION_URL,
  googleBusinessConnectFailurePath,
  googleBusinessConnectNotice,
  issueFromCallbackParams,
  issueFromCompleteResponse,
  issueFromStartResponse,
  parseConnectIssue,
} from "./connect-issues";

function params(entries: Record<string, string>) {
  return new URLSearchParams(entries);
}

describe("issueFromCallbackParams", () => {
  it("maps missing Google permissions from the Zernio callback", () => {
    expect(
      issueFromCallbackParams(
        params({
          error: "missing_google_permissions",
          platform: "googlebusiness",
          error_message:
            'Google Business Profile requires the "Manage your Business Profile" permission. Please reconnect and make sure all permissions are checked on the Google consent screen.',
          is_user_fixable: "true",
        }),
      ),
    ).toBe("missing_permissions");
  });

  it("maps an empty location list from the Zernio callback", () => {
    expect(
      issueFromCallbackParams(params({ error: "no_google_locations", platform: "googlebusiness" })),
    ).toBe("no_locations");
  });

  it("maps a closed Google consent screen", () => {
    expect(issueFromCallbackParams(params({ error: "access_denied" }))).toBe("cancelled");
  });

  it("uses a user-fixable fallback for unknown provider errors", () => {
    expect(
      issueFromCallbackParams(params({ error: "something_new", is_user_fixable: "true" })),
    ).toBe("needs_attention");
  });

  it("falls back when the callback is missing both success and error params", () => {
    expect(issueFromCallbackParams(params({}))).toBe("unavailable");
  });
});

describe("parseConnectIssue", () => {
  it("accepts known codes and the legacy connect_error flag", () => {
    expect(parseConnectIssue("missing_permissions")).toBe("missing_permissions");
    expect(parseConnectIssue("1")).toBe("unavailable");
    expect(parseConnectIssue("not-a-real-code")).toBe("unavailable");
    expect(parseConnectIssue(undefined)).toBeNull();
  });
});

describe("issueFromCompleteResponse", () => {
  it("maps save-time failures in this pipeline", () => {
    expect(issueFromCompleteResponse(409, "Finish account setup before connecting Google Business.")).toBe(
      "setup_incomplete",
    );
    expect(issueFromCompleteResponse(404, "That Google Business location is not available to this account.")).toBe(
      "account_unavailable",
    );
    expect(
      issueFromCompleteResponse(500, "No Google Business Profile locations were returned for this account."),
    ).toBe("no_locations");
    expect(issueFromCompleteResponse(502, "Unable to finish the Google Business connection.")).toBe("save_failed");
    expect(issueFromCompleteResponse(429)).toBe("rate_limited");
    expect(issueFromCompleteResponse(403, "A PostPooch profile is required.")).toBe("setup_incomplete");
  });
});

describe("issueFromStartResponse", () => {
  it("maps failures before Google authorization opens", () => {
    expect(issueFromStartResponse(409)).toBe("setup_incomplete");
    expect(issueFromStartResponse(502)).toBe("start_failed");
  });
});

describe("googleBusinessConnectNotice", () => {
  it("keeps copy specific and actionable", () => {
    expect(googleBusinessConnectNotice("missing_permissions").title).toMatch(/permission/i);
    expect(googleBusinessConnectNotice("no_locations").title).toMatch(/add your business/i);
    expect(GOOGLE_BUSINESS_ADD_LOCATION_URL).toBe("https://business.google.com/add");
    expect(googleBusinessConnectFailurePath("no_locations")).toBe(
      "/dashboard/google_business?connect_issue=no_locations",
    );
  });
});
