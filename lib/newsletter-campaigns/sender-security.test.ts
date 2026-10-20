import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const store = readFileSync(path.resolve("lib/newsletter-campaigns/store.ts"), "utf8");
const route = readFileSync(path.resolve("app/api/newsletter_campaigns/route.ts"), "utf8");

describe("newsletter campaign sender isolation", () => {
  it("loads a ready sender and tenant owned by the campaign profile", () => {
    expect(store).toContain("NEWSLETTER_SENDER_NOT_READY");
    expect(store).toContain("identity.profile_id = $1::uuid");
    expect(store).toContain("tenant.profile_id = identity.profile_id");
    expect(store).toContain("identity.status = 'ready'");
    expect(store).toContain("tenant.status = 'ready'");
  });

  it("does not trust a browser-provided From address", () => {
    expect(route).not.toContain("NEWSLETTER_FROM_EMAIL");
    expect(store).not.toContain("input.campaign.fromEmail,");
  });
});
