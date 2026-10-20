import { describe, expect, it } from "vitest";

import { isNewsletterContactSendable } from "./eligibility";
import type { NewsletterContactOption } from "./types";

function contact(
  status: NewsletterContactOption["emailMarketingStatus"],
  email: string | null = "client@example.com",
): NewsletterContactOption {
  return {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    firstName: "Alex",
    lastName: "Client",
    email,
    emailMarketingStatus: status,
  };
}

describe("isNewsletterContactSendable", () => {
  it("allows valid-email contacts whose status is unknown or subscribed", () => {
    expect(isNewsletterContactSendable(contact("unknown"))).toBe(true);
    expect(isNewsletterContactSendable(contact("subscribed"))).toBe(true);
  });

  it("protects explicit opt-outs and invalid email records", () => {
    expect(isNewsletterContactSendable(contact("unsubscribed"))).toBe(false);
    expect(isNewsletterContactSendable(contact("suppressed"))).toBe(false);
    expect(isNewsletterContactSendable(contact("invalid"))).toBe(false);
    expect(isNewsletterContactSendable(contact("unknown", "   "))).toBe(false);
    expect(isNewsletterContactSendable(contact("unknown", null))).toBe(false);
  });
});
