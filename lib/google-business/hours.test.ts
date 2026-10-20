import { describe, expect, it } from "vitest";

import {
  googleBusinessClockTime,
  hoursFormFrom,
  hoursFormToPayload,
  normalizeRegularHours,
  onePeriodPerDay,
} from "./hours";
import { buildLocationPatch, locationPatchFormFrom } from "./profile";
import type { GoogleBusinessLocation } from "./types";
const location = {
  description: "Original description",
  websiteUri: "https://example.com",
  primaryPhone: "555-0100",
  regularHours: {
    periods: [{ openDay: "MONDAY" as const, openTime: "09:00", closeDay: "MONDAY" as const, closeTime: "17:00" }],
  },
} satisfies Pick<GoogleBusinessLocation, "description" | "websiteUri" | "primaryPhone" | "regularHours">;

describe("googleBusinessClockTime", () => {
  it("normalizes Google TimeOfDay objects and clock strings", () => {
    expect(googleBusinessClockTime({ hours: 9, minutes: 5 })).toBe("09:05");
    expect(googleBusinessClockTime({ hours: 17 })).toBe("17:00");
    expect(googleBusinessClockTime("9:00")).toBe("09:00");
    expect(googleBusinessClockTime("09:00:00")).toBe("09:00");
    expect(googleBusinessClockTime({ hours: 24, minutes: 0 })).toBe("00:00");
  });

  it("rejects values that are not clock times", () => {
    expect(googleBusinessClockTime({ minutes: 30 })).toBeNull();
    expect(googleBusinessClockTime("25:00")).toBeNull();
    expect(googleBusinessClockTime(null)).toBeNull();
  });
});

describe("normalizeRegularHours", () => {
  it("keeps valid HH:MM periods and converts TimeOfDay objects", () => {
    expect(normalizeRegularHours({
      periods: [
        { openDay: "TUESDAY", openTime: { hours: 8, minutes: 30 }, closeDay: "TUESDAY", closeTime: { hours: 18, minutes: 0 } },
        { openDay: "NOPE", openTime: "09:00", closeDay: "MONDAY", closeTime: "17:00" },
      ],
    })).toEqual({
      periods: [{ openDay: "TUESDAY", openTime: "08:30", closeDay: "TUESDAY", closeTime: "18:00" }],
    });
  });
});

describe("buildLocationPatch", () => {
  it("sends only the description when hours are Google TimeOfDay objects", () => {
    const googleHours = {
      periods: [{ openDay: "MONDAY" as const, openTime: { hours: 9, minutes: 0 } as unknown as string, closeDay: "MONDAY" as const, closeTime: { hours: 17, minutes: 0 } as unknown as string }],
    };
    const formHours = hoursFormToPayload(hoursFormFrom(googleHours));
    expect(buildLocationPatch(
      { ...location, regularHours: googleHours },
      locationPatchFormFrom({ ...location, regularHours: googleHours }, { description: "Updated description", websiteUri: location.websiteUri, primaryPhone: location.primaryPhone, regularHours: formHours }),
    )).toEqual({ description: "Updated description" });
  });

  it("includes hours when the editor changes a closing time", () => {
    const form = hoursFormFrom(location.regularHours);
    form.MONDAY.close = "18:00";
    expect(buildLocationPatch(location, locationPatchFormFrom(location, {
      description: location.description,
      websiteUri: location.websiteUri,
      primaryPhone: location.primaryPhone,
      regularHours: hoursFormToPayload(form),
    }))).toEqual({
      regularHours: { periods: [{ openDay: "MONDAY", openTime: "09:00", closeDay: "MONDAY", closeTime: "18:00" }] },
    });
  });

  it("returns an empty patch when nothing changed", () => {
    expect(buildLocationPatch(location, locationPatchFormFrom(location, {
      description: location.description,
      websiteUri: location.websiteUri,
      primaryPhone: location.primaryPhone,
      regularHours: hoursFormToPayload(hoursFormFrom(location.regularHours)),
    }))).toEqual({});
  });
});

describe("onePeriodPerDay", () => {
  it("keeps the first period for a day and emits days in week order", () => {
    expect(onePeriodPerDay({
      periods: [
        { openDay: "WEDNESDAY", openTime: "10:00", closeDay: "WEDNESDAY", closeTime: "16:00" },
        { openDay: "MONDAY", openTime: "09:00", closeDay: "MONDAY", closeTime: "17:00" },
        { openDay: "MONDAY", openTime: "18:00", closeDay: "MONDAY", closeTime: "20:00" },
      ],
    })).toEqual([
      { openDay: "MONDAY", openTime: "09:00", closeDay: "MONDAY", closeTime: "17:00" },
      { openDay: "WEDNESDAY", openTime: "10:00", closeDay: "WEDNESDAY", closeTime: "16:00" },
    ]);
  });
});
