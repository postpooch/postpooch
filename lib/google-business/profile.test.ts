import { describe, expect, it } from "vitest";

import {
  addressFormToPayload,
  buildLocationPatch,
  googleBusinessMediaId,
  listingHeroUrl,
  locationPatchFormFrom,
  normalizeSpecialHours,
  specialHoursFormToPayload,
} from "./profile";

const location = {
  title: "North Star Realty",
  description: "Original description",
  websiteUri: "https://example.com",
  primaryPhone: "555-0100",
  additionalPhones: [],
  storefrontAddress: null,
  regularHours: {
    periods: [{ openDay: "MONDAY" as const, openTime: "09:00", closeDay: "MONDAY" as const, closeTime: "17:00" }],
  },
};

describe("normalizeSpecialHours", () => {
  it("keeps closed holiday dates and clock strings", () => {
    expect(normalizeSpecialHours({
      specialHourPeriods: [
        { startDate: { year: 2026, month: 12, day: 25 }, closed: true },
        { startDate: "2026-12-31", openTime: { hours: 9, minutes: 0 }, closeTime: "17:00", closed: false },
      ],
    })).toEqual({
      specialHourPeriods: [
        { startDate: { year: 2026, month: 12, day: 25 }, closed: true },
        { startDate: { year: 2026, month: 12, day: 31 }, closed: false, openTime: "09:00", closeTime: "17:00" },
      ],
    });
  });
});

describe("buildLocationPatch extras", () => {
  it("includes name, address, extra phones, and holiday hours when they change", () => {
    expect(buildLocationPatch(location, locationPatchFormFrom(location, {
      title: "North Star Group",
      description: location.description,
      websiteUri: location.websiteUri,
      primaryPhone: location.primaryPhone,
      additionalPhones: ["555-0199"],
      storefrontAddress: addressFormToPayload({
        line1: "100 Main St",
        line2: "",
        locality: "Phoenix",
        administrativeArea: "AZ",
        postalCode: "85001",
        regionCode: "us",
      }),
      regularHours: location.regularHours,
      specialHours: specialHoursFormToPayload([{
        startDate: "2026-12-25",
        closed: true,
        open: "09:00",
        close: "17:00",
      }]),
    }))).toEqual({
      title: "North Star Group",
      additionalPhones: ["555-0199"],
      primaryPhone: "555-0100",
      storefrontAddress: {
        regionCode: "US",
        addressLines: ["100 Main St"],
        locality: "Phoenix",
        administrativeArea: "AZ",
        postalCode: "85001",
      },
      specialHours: {
        specialHourPeriods: [{ startDate: { year: 2026, month: 12, day: 25 }, closed: true }],
      },
    });
  });
});

describe("googleBusinessMediaId", () => {
  it("keeps the final media key from a resource name", () => {
    expect(googleBusinessMediaId("accounts/1/locations/2/media/abc123")).toBe("abc123");
    expect(googleBusinessMediaId("abc123")).toBe("abc123");
  });
});

describe("listingHeroUrl", () => {
  it("prefers the cover photo", () => {
    expect(listingHeroUrl([
      { id: "1", providerMediaId: "a", url: "https://cdn.example.com/extra.jpg", category: "ADDITIONAL" },
      { id: "2", providerMediaId: "b", url: "https://cdn.example.com/cover.jpg", category: "COVER" },
    ])).toBe("https://cdn.example.com/cover.jpg");
  });
});

describe("buildLocationPatch photos", () => {
  it("includes photos when they change", () => {
    expect(buildLocationPatch({ ...location, photos: [] }, locationPatchFormFrom({ ...location, photos: [] }, {
      description: location.description,
      websiteUri: location.websiteUri,
      primaryPhone: location.primaryPhone,
      regularHours: location.regularHours,
      photos: [{
        id: "local-1",
        providerMediaId: null,
        url: "https://cdn.example.com/storefront.jpg",
        category: "EXTERIOR",
      }],
    })).photos).toEqual([{
      providerMediaId: null,
      url: "https://cdn.example.com/storefront.jpg",
      category: "EXTERIOR",
    }]);
  });
});
