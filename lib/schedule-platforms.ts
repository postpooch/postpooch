import type { Profile } from "@/lib/auth/profiles";

/** Canonical display names stored in schedules.platform (comma-separated). */
export const SCHEDULE_PLATFORMS = ["Instagram", "Facebook"] as const;

export type SchedulePlatform = (typeof SCHEDULE_PLATFORMS)[number];

export type ConnectedSchedulePlatforms = {
  Instagram: boolean;
  Facebook: boolean;
};

export type SchedulePlatformTarget = {
  platform: SchedulePlatform;
  accountId: string;
  /** Zernio API platform slug */
  zernioPlatform: "instagram" | "facebook";
};

const PLATFORM_SET = new Set<string>(SCHEDULE_PLATFORMS);

export function isSchedulePlatform(value: unknown): value is SchedulePlatform {
  return typeof value === "string" && PLATFORM_SET.has(value);
}

export function connectedSchedulePlatformsFromProfile(
  profile: Pick<Profile, "instagram_account_id" | "facebook_account_id">,
): ConnectedSchedulePlatforms {
  return {
    Instagram: Boolean(profile.instagram_account_id?.trim()),
    Facebook: Boolean(profile.facebook_account_id?.trim()),
  };
}

export function defaultSchedulePlatforms(
  connected: ConnectedSchedulePlatforms,
): SchedulePlatform[] {
  return SCHEDULE_PLATFORMS.filter((platform) => connected[platform]);
}

/** Stable Instagram → Facebook order, de-duplicated. */
export function normalizeSchedulePlatforms(
  platforms: readonly SchedulePlatform[],
): SchedulePlatform[] {
  const selected = new Set(platforms);
  return SCHEDULE_PLATFORMS.filter((platform) => selected.has(platform));
}

export function formatSchedulePlatforms(
  platforms: readonly SchedulePlatform[],
): string {
  const normalized = normalizeSchedulePlatforms(platforms);
  if (normalized.length === 0) {
    throw new Error("Choose at least one platform.");
  }
  return normalized.join(",");
}

export function parseSchedulePlatforms(
  value: string | null | undefined,
): SchedulePlatform[] {
  if (!value?.trim()) return [];

  const parsed: SchedulePlatform[] = [];
  for (const part of value.split(",")) {
    const token = part.trim();
    if (!token) continue;
    if (!isSchedulePlatform(token)) {
      throw new Error(`Unsupported schedule platform: ${token}`);
    }
    parsed.push(token);
  }

  return normalizeSchedulePlatforms(parsed);
}

export function formatScheduleAccountIds(accountIds: readonly string[]): string {
  if (accountIds.length === 0 || accountIds.some((id) => !id.trim())) {
    throw new Error("Each selected platform needs a connected account.");
  }
  return accountIds.map((id) => id.trim()).join(",");
}

export function parseScheduleAccountIds(
  value: string | null | undefined,
): string[] {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Resolve denormalized schedule platform + account CSV pairs into Zernio targets.
 * Order is parallel: platforms[i] ↔ accountIds[i].
 */
export function resolveSchedulePlatformTargets(
  platformCsv: string | null | undefined,
  accountIdCsv: string | null | undefined,
): SchedulePlatformTarget[] {
  const platforms = parseSchedulePlatforms(platformCsv);
  const accountIds = parseScheduleAccountIds(accountIdCsv);

  if (platforms.length === 0) {
    throw new Error("Schedule does not have a platform");
  }
  if (accountIds.length !== platforms.length) {
    throw new Error(
      "Schedule platform and platform_account_id lists do not match",
    );
  }

  return platforms.map((platform, index) => ({
    platform,
    accountId: accountIds[index]!,
    zernioPlatform: platform === "Instagram" ? "instagram" : "facebook",
  }));
}

/** Build DB CSV fields from selected platforms + the signed-in profile. */
export function schedulePlatformFieldsFromProfile(
  platforms: readonly SchedulePlatform[],
  profile: Pick<Profile, "instagram_account_id" | "facebook_account_id">,
): { platform: string; platformAccountId: string } {
  const normalized = normalizeSchedulePlatforms(platforms);
  if (normalized.length === 0) {
    throw new Error("Choose at least one platform for each posting time.");
  }

  const accountIds: string[] = [];
  for (const platform of normalized) {
    const accountId =
      platform === "Instagram"
        ? profile.instagram_account_id?.trim()
        : profile.facebook_account_id?.trim();

    if (!accountId) {
      throw new Error(
        `Connect ${platform} before scheduling posts to that channel.`,
      );
    }
    accountIds.push(accountId);
  }

  return {
    platform: formatSchedulePlatforms(normalized),
    platformAccountId: formatScheduleAccountIds(accountIds),
  };
}

export function platformsEqual(
  left: readonly SchedulePlatform[],
  right: readonly SchedulePlatform[],
) {
  const a = normalizeSchedulePlatforms(left);
  const b = normalizeSchedulePlatforms(right);
  return a.length === b.length && a.every((platform, index) => platform === b[index]);
}
