import {
  GOOGLE_BUSINESS_DAYS,
  type GoogleBusinessDay,
  type GoogleBusinessHoursPeriod,
  type GoogleBusinessRegularHours,
} from "@/lib/google-business/types";

export const GOOGLE_BUSINESS_CLOCK_TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export type GoogleBusinessHoursRow = { enabled: boolean; open: string; close: string };
export type GoogleBusinessHoursForm = Record<GoogleBusinessDay, GoogleBusinessHoursRow>;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function asInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^-?\d+$/.test(value.trim())) return Number(value.trim());
  return null;
}

function clockFromParts(hours: number, minutes: number): string | null {
  if (hours === 24) return minutes === 0 ? "00:00" : null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return `${pad(hours)}:${pad(minutes)}`;
}

export function googleBusinessClockTime(value: unknown): string | null {
  if (typeof value === "string") {
    const match = /^(\d{1,2}):([0-5]\d)(?::[0-5]\d)?(?:\.\d+)?$/.exec(value.trim());
    if (!match) return null;
    return clockFromParts(Number(match[1]), Number(match[2]));
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const hours = asInt(record.hours ?? record.hour);
  if (hours === null) return null;
  const minutes = record.minutes === undefined && record.minute === undefined ? 0 : asInt(record.minutes ?? record.minute);
  if (minutes === null) return null;
  return clockFromParts(hours, minutes);
}

function asDay(value: unknown): GoogleBusinessDay | null {
  return typeof value === "string" && (GOOGLE_BUSINESS_DAYS as readonly string[]).includes(value)
    ? value as GoogleBusinessDay
    : null;
}

function periodsFrom(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && Array.isArray((value as { periods?: unknown }).periods)) {
    return (value as { periods: unknown[] }).periods;
  }
  return [];
}

export function normalizeRegularHours(value: unknown): GoogleBusinessRegularHours {
  const periods: GoogleBusinessHoursPeriod[] = [];
  for (const period of periodsFrom(value)) {
    if (!period || typeof period !== "object") continue;
    const record = period as Record<string, unknown>;
    const openDay = asDay(record.openDay);
    const openTime = googleBusinessClockTime(record.openTime);
    const closeTime = googleBusinessClockTime(record.closeTime);
    if (!openDay || !openTime || !closeTime) continue;
    periods.push({
      openDay,
      openTime,
      closeDay: asDay(record.closeDay) ?? openDay,
      closeTime,
    });
  }
  return { periods };
}

export function onePeriodPerDay(hours: unknown): GoogleBusinessHoursPeriod[] {
  const byDay = new Map<GoogleBusinessDay, GoogleBusinessHoursPeriod>();
  for (const period of normalizeRegularHours(hours).periods) {
    if (byDay.has(period.openDay)) continue;
    byDay.set(period.openDay, {
      openDay: period.openDay,
      openTime: period.openTime,
      closeDay: period.openDay,
      closeTime: period.closeTime,
    });
  }
  return GOOGLE_BUSINESS_DAYS.flatMap((day) => {
    const period = byDay.get(day);
    return period ? [period] : [];
  });
}

export function hoursFormFrom(hours: unknown): GoogleBusinessHoursForm {
  const byDay = new Map(onePeriodPerDay(hours).map((period) => [period.openDay, period]));
  return Object.fromEntries(GOOGLE_BUSINESS_DAYS.map((day) => {
    const period = byDay.get(day);
    return [day, { enabled: Boolean(period), open: period?.openTime ?? "09:00", close: period?.closeTime ?? "17:00" }];
  })) as GoogleBusinessHoursForm;
}

export function hoursFormToPayload(hours: GoogleBusinessHoursForm): GoogleBusinessRegularHours {
  return {
    periods: GOOGLE_BUSINESS_DAYS.flatMap((day) => {
      if (!hours[day].enabled) return [];
      const openTime = googleBusinessClockTime(hours[day].open) ?? hours[day].open;
      const closeTime = googleBusinessClockTime(hours[day].close) ?? hours[day].close;
      return [{ openDay: day, openTime, closeDay: day, closeTime }];
    }),
  };
}
