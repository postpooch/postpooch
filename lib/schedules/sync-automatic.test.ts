import { describe, expect, it } from "vitest";

import {
  formatSchedulePlatforms,
  parseSchedulePlatforms,
  resolveSchedulePlatformTargets,
  schedulePlatformFieldsFromProfile,
} from "../schedule-platforms";
import {
  isUiScheduleMinutes,
  normalizePostingSlots,
  postingSlotKey,
  toWeeklyCron,
} from "../schedule-slots";
import {
  AUTOMATIC_SOCIAL_POST_WINDOW,
  automaticScheduleDeduplicationKey,
} from "../trigger/automatic-schedules";
import { resolveScheduleTimezone } from "./timezone";

describe("toWeeklyCron", () => {
  it("builds Trigger-compatible weekly cron expressions", () => {
    expect(toWeeklyCron("mon", 9 * 60)).toBe("0 9 * * 1");
    expect(toWeeklyCron("sun", 18 * 60 + 30)).toBe("30 18 * * 0");
    expect(toWeeklyCron("tue", 0)).toBe("0 0 * * 2");
    expect(toWeeklyCron("wed", 12 * 60 + 13)).toBe("13 12 * * 3");
    expect(toWeeklyCron("sat", 23 * 60 + 30)).toBe("30 23 * * 6");
  });
});

describe("isUiScheduleMinutes", () => {
  it("accepts any minute of the day, including custom times", () => {
    expect(isUiScheduleMinutes(0)).toBe(true);
    expect(isUiScheduleMinutes(23 * 60 + 30)).toBe(true);
    expect(isUiScheduleMinutes(12 * 60 + 13)).toBe(true);
    expect(isUiScheduleMinutes(23 * 60 + 59)).toBe(true);
    expect(isUiScheduleMinutes(-30)).toBe(false);
    expect(isUiScheduleMinutes(24 * 60)).toBe(false);
  });
});

describe("normalizePostingSlots", () => {
  it("dedupes, sorts, and preserves platforms", () => {
    const slots = normalizePostingSlots([
      {
        day: "wed",
        minutes: 12 * 60,
        platforms: ["Facebook"],
      },
      {
        day: "mon",
        minutes: 9 * 60,
        platforms: ["Instagram", "Facebook"],
      },
      {
        day: "mon",
        minutes: 9 * 60,
        platforms: ["Instagram"],
      },
      {
        day: "fri",
        minutes: 17 * 60,
        platforms: ["Instagram"],
      },
    ]);

    expect(slots.map(postingSlotKey)).toEqual([
      "mon-540",
      "wed-720",
      "fri-1020",
    ]);
    expect(slots[0]?.platforms).toEqual(["Instagram"]);
  });

  it("rejects slots without platforms", () => {
    expect(() =>
      normalizePostingSlots([
        { day: "mon", minutes: 9 * 60, platforms: [] },
      ]),
    ).toThrow(/platform/i);
  });
});

describe("schedule platforms", () => {
  it("serializes comma-separated platforms and account ids", () => {
    expect(formatSchedulePlatforms(["Facebook", "Instagram"])).toBe(
      "Instagram,Facebook",
    );
    expect(parseSchedulePlatforms("Facebook, Instagram")).toEqual([
      "Instagram",
      "Facebook",
    ]);

    const fields = schedulePlatformFieldsFromProfile(
      ["Instagram", "Facebook"],
      {
        instagram_account_id: "ig_1",
        facebook_account_id: "fb_1",
      },
    );
    expect(fields).toEqual({
      platform: "Instagram,Facebook",
      platformAccountId: "ig_1,fb_1",
    });

    expect(
      resolveSchedulePlatformTargets(
        "Instagram,Facebook",
        "ig_1,fb_1",
      ).map((target) => target.zernioPlatform),
    ).toEqual(["instagram", "facebook"]);
  });
});

describe("resolveScheduleTimezone", () => {
  it("defaults to UTC and accepts IANA zones", () => {
    expect(resolveScheduleTimezone(undefined)).toBe("UTC");
    expect(resolveScheduleTimezone("America/Phoenix")).toBe("America/Phoenix");
  });

  it("rejects invalid timezones", () => {
    expect(() => resolveScheduleTimezone("Not/AZone")).toThrow(/timezone/i);
  });
});

describe("automaticScheduleDeduplicationKey", () => {
  it("qualifies keys by schedule environment", () => {
    const previous = process.env.TRIGGER_SCHEDULE_ENV;
    process.env.TRIGGER_SCHEDULE_ENV = "staging";
    expect(automaticScheduleDeduplicationKey("abc")).toBe(
      "staging:postpooch:abc",
    );
    if (previous === undefined) {
      delete process.env.TRIGGER_SCHEDULE_ENV;
    } else {
      process.env.TRIGGER_SCHEDULE_ENV = previous;
    }
  });
});

describe("automatic social post schedule", () => {
  it("opts out of Trigger.dev's default execution spread", () => {
    expect(AUTOMATIC_SOCIAL_POST_WINDOW).toBe("0m");
  });
});
