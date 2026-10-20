import type { SchedulePlatform } from "./schedule-platforms";
import { normalizeSchedulePlatforms } from "./schedule-platforms";

export const MAX_AUTOMATIC_SCHEDULES = 4;

/** Matches the schedule picker grid: midnight–midnight in 30-minute steps. */
export const SCHEDULE_SLOT_START_MINUTES = 0;
/** Latest schedulable minute of the day (11:59 PM). */
export const SCHEDULE_SLOT_END_MINUTES = 23 * 60 + 59;

export const SCHEDULE_DAYS = [
  { id: "mon", label: "Monday", short: "Mon", cronDow: 1 },
  { id: "tue", label: "Tuesday", short: "Tue", cronDow: 2 },
  { id: "wed", label: "Wednesday", short: "Wed", cronDow: 3 },
  { id: "thu", label: "Thursday", short: "Thu", cronDow: 4 },
  { id: "fri", label: "Friday", short: "Fri", cronDow: 5 },
  { id: "sat", label: "Saturday", short: "Sat", cronDow: 6 },
  { id: "sun", label: "Sunday", short: "Sun", cronDow: 0 },
] as const;

export type ScheduleDayId = (typeof SCHEDULE_DAYS)[number]["id"];

/** UI-facing weekly slot derived from a recurring cron expression. */
export type ScheduleSlot = {
  id: string;
  day: ScheduleDayId;
  minutes: number;
  cron: string;
};

export type PostingSlot = {
  day: ScheduleDayId;
  minutes: number;
  platforms: SchedulePlatform[];
};

/** Any minute of the day: 30-minute grid slots plus custom times down to the minute. */
export function isUiScheduleMinutes(minutes: number) {
  return (
    Number.isInteger(minutes) &&
    minutes >= SCHEDULE_SLOT_START_MINUTES &&
    minutes <= SCHEDULE_SLOT_END_MINUTES
  );
}

export function sortPostingSlots(slots: PostingSlot[]) {
  const dayOrder = Object.fromEntries(
    SCHEDULE_DAYS.map((d, i) => [d.id, i]),
  ) as Record<ScheduleDayId, number>;

  return [...slots].sort(
    (a, b) => dayOrder[a.day] - dayOrder[b.day] || a.minutes - b.minutes,
  );
}

const CRON_DOW_TO_DAY = new Map<number, ScheduleDayId>([
  [0, "sun"],
  [1, "mon"],
  [2, "tue"],
  [3, "wed"],
  [4, "thu"],
  [5, "fri"],
  [6, "sat"],
  [7, "sun"],
]);

/** Weekly cron only: `minute hour * * day-of-week` (Trigger.dev / croner style). */
const WEEKLY_CRON_PATTERN =
  /^(\d{1,2})\s+(\d{1,2})\s+\*\s+\*\s+(\d)$/;

export function parseWeeklyCron(
  cron: string,
): { day: ScheduleDayId; minutes: number } | null {
  const match = WEEKLY_CRON_PATTERN.exec(cron.trim());
  if (!match) return null;

  const minute = Number(match[1]);
  const hour = Number(match[2]);
  const dow = Number(match[3]);

  if (
    !Number.isInteger(minute) ||
    minute < 0 ||
    minute > 59 ||
    !Number.isInteger(hour) ||
    hour < 0 ||
    hour > 23
  ) {
    return null;
  }

  const day = CRON_DOW_TO_DAY.get(dow);
  if (!day) return null;

  return { day, minutes: hour * 60 + minute };
}

export function postingSlotKey(slot: Pick<PostingSlot, "day" | "minutes">) {
  return `${slot.day}-${slot.minutes}`;
}

/** Build a weekly cron expression for the schedule picker grid. */
export function toWeeklyCron(day: ScheduleDayId, minutes: number): string {
  if (!isUiScheduleMinutes(minutes)) {
    throw new Error(`Unsupported schedule minutes: ${minutes}`);
  }

  const dayMeta = SCHEDULE_DAYS.find((entry) => entry.id === day);
  if (!dayMeta) {
    throw new Error(`Unsupported schedule day: ${day}`);
  }

  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${minute} ${hour} * * ${dayMeta.cronDow}`;
}

export function normalizePostingSlots(slots: PostingSlot[]) {
  const unique = new Map<string, PostingSlot>();

  for (const slot of slots) {
    if (!SCHEDULE_DAYS.some((day) => day.id === slot.day)) {
      throw new Error(`Unsupported schedule day: ${String(slot.day)}`);
    }
    if (!isUiScheduleMinutes(slot.minutes)) {
      throw new Error(`Unsupported schedule minutes: ${slot.minutes}`);
    }

    const platforms = normalizeSchedulePlatforms(slot.platforms ?? []);
    if (platforms.length === 0) {
      throw new Error("Choose at least one platform for each posting time.");
    }

    unique.set(postingSlotKey(slot), {
      day: slot.day,
      minutes: slot.minutes,
      platforms,
    });
  }

  if (unique.size > MAX_AUTOMATIC_SCHEDULES) {
    throw new Error(
      `Choose up to ${MAX_AUTOMATIC_SCHEDULES} posting times.`,
    );
  }

  return sortPostingSlots([...unique.values()]);
}
