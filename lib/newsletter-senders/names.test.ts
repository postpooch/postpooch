import { describe, expect, it } from "vitest";

import { newsletterSenderNames } from "@/lib/newsletter-senders/names";

describe("newsletterSenderNames", () => {
  it("creates stable unique names under the owned sending domain", () => {
    expect(newsletterSenderNames("11111111-2222-4333-8444-555555555555")).toEqual({
      tenantName: "pp-11111111222243338444555555555555",
      identityDomain: "mail-11111111222243338444555555555555.postpoochmail.com",
      fromEmail:
        "sender-11111111222243338444555555555555@mail-11111111222243338444555555555555.postpoochmail.com",
      mailFromDomain:
        "bounce.mail-11111111222243338444555555555555.postpoochmail.com",
    });
  });

  it("rejects values that are not account UUIDs", () => {
    expect(() => newsletterSenderNames("not-an-id")).toThrow("profile ID");
  });
});
