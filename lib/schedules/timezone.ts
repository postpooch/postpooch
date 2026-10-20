const IANA_TIMEZONE_PATTERN = /^[A-Za-z0-9_+\-]+(?:\/[A-Za-z0-9_+\-]+)*$/;

export class InvalidScheduleTimezoneError extends Error {
  constructor(message = "Choose a valid IANA timezone.") {
    super(message);
    this.name = "InvalidScheduleTimezoneError";
  }
}

export function resolveScheduleTimezone(timezone: string | undefined) {
  const value = timezone?.trim() || "UTC";
  if (value.length > 64 || !IANA_TIMEZONE_PATTERN.test(value)) {
    throw new InvalidScheduleTimezoneError();
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
  } catch {
    throw new InvalidScheduleTimezoneError();
  }

  return value;
}
