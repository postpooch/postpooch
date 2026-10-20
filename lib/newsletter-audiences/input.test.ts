import { describe, expect, it } from "vitest";

import { newsletterAudienceInput } from "./input";

const CONTACT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

describe("newsletterAudienceInput", () => {
  it("trims the name and deduplicates selected contacts", () => {
    expect(
      newsletterAudienceInput.parse({
        name: "  Past clients  ",
        contactIds: [CONTACT_ID, CONTACT_ID],
      }),
    ).toEqual({
      name: "Past clients",
      contactIds: [CONTACT_ID],
    });
  });

  it("requires a name and at least one valid CRM contact id", () => {
    expect(
      newsletterAudienceInput.safeParse({ name: "", contactIds: [] }).success,
    ).toBe(false);
    expect(
      newsletterAudienceInput.safeParse({
        name: "Buyers",
        contactIds: ["not-a-contact"],
      }).success,
    ).toBe(false);
  });
});
