import { createHash } from "node:crypto";

import { PostingError } from "./errors";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string | undefined): value is string {
  return Boolean(value && UUID_PATTERN.test(value));
}

export function resolveScheduleRowId(input: {
  externalId?: string;
  scheduleId: string;
}): string {
  if (isUuid(input.externalId)) {
    return input.externalId;
  }

  if (isUuid(input.scheduleId)) {
    return input.scheduleId;
  }

  throw new PostingError(
    "The Trigger.dev schedule externalId must be the schedules.id UUID",
    false,
  );
}

export function requestIdForOccurrence(
  scheduleId: string,
  occurrenceAt: string,
): string {
  const digest = createHash("sha256")
    .update(`postpooch:${scheduleId}:${occurrenceAt}`)
    .digest();

  // Format the first 16 hash bytes as an RFC 4122 version-5-style UUID.
  digest[6] = (digest[6] & 0x0f) | 0x50;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  const hex = digest.subarray(0, 16).toString("hex");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

export function occurrenceAtIso(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new PostingError("Trigger.dev supplied an invalid timestamp", false);
  }

  return date.toISOString();
}
