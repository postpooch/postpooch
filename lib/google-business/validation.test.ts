import { describe, expect, it } from "vitest";

import { formatValidationError, googleBusinessLocationPatchSchema } from "./validation";

describe("googleBusinessLocationPatchSchema", () => {
  it("accepts a description-only patch", () => {
    expect(googleBusinessLocationPatchSchema.parse({ description: "  New copy  " })).toEqual({
      description: "New copy",
    });
  });

  it("coerces Google TimeOfDay objects into HH:MM strings", () => {
    expect(googleBusinessLocationPatchSchema.parse({
      regularHours: {
        periods: [{
          openDay: "MONDAY",
          openTime: { hours: 9, minutes: 0 },
          closeDay: "MONDAY",
          closeTime: { hours: 17, minutes: 30 },
        }],
      },
    })).toEqual({
      regularHours: {
        periods: [{ openDay: "MONDAY", openTime: "09:00", closeDay: "MONDAY", closeTime: "17:30" }],
      },
    });
  });

  it("accepts a name, extra phones, and holiday hours", () => {
    expect(googleBusinessLocationPatchSchema.parse({
      title: "  North Star Realty  ",
      additionalPhones: ["555-0199"],
      specialHours: {
        specialHourPeriods: [{
          startDate: { year: 2026, month: 12, day: 25 },
          closed: true,
        }],
      },
    })).toMatchObject({
      title: "North Star Realty",
      additionalPhones: ["555-0199"],
    });
  });

  it("accepts a photos patch", () => {
    expect(googleBusinessLocationPatchSchema.parse({
      photos: [{ url: "https://cdn.example.com/cover.jpg", category: "COVER" }],
    })).toEqual({
      photos: [{ url: "https://cdn.example.com/cover.jpg", category: "COVER" }],
    });
  });

  it("rejects two cover photos", () => {
    const parsed = googleBusinessLocationPatchSchema.safeParse({
      photos: [
        { url: "https://cdn.example.com/one.jpg", category: "COVER" },
        { url: "https://cdn.example.com/two.jpg", category: "COVER" },
      ],
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(formatValidationError(parsed.error)).toBe("Only one cover, profile, and logo photo can be set.");
    }
  });

  it("rejects an empty patch", () => {
    const parsed = googleBusinessLocationPatchSchema.safeParse({});
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(formatValidationError(parsed.error)).toBe("Choose at least one field to update.");
  });

  it("names the field when a string is required", () => {
    const parsed = googleBusinessLocationPatchSchema.safeParse({ description: { text: "nope" } });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(formatValidationError(parsed.error)).toMatch(/^Business description:/);
    }
  });
});
