import type { Profile } from "@/lib/auth/profiles";
import {
  parseSchedulePlatforms,
  platformsEqual,
  schedulePlatformFieldsFromProfile,
} from "@/lib/schedule-platforms";
import {
  deleteAutomaticScheduleForProfile,
  insertAutomaticSchedule,
  listAutomaticSchedulesForProfile,
  toAutomaticScheduleDtos,
  updateAutomaticScheduleTargetsForProfile,
  type AutomaticScheduleDto,
  type ScheduleRow,
} from "@/lib/schedules";
import {
  normalizePostingSlots,
  parseWeeklyCron,
  postingSlotKey,
  toWeeklyCron,
  type PostingSlot,
} from "@/lib/schedule-slots";
import {
  InvalidScheduleTimezoneError,
  resolveScheduleTimezone,
} from "@/lib/schedules/timezone";
import {
  attachAutomaticTriggerSchedule,
  detachAutomaticTriggerSchedule,
} from "@/lib/trigger/automatic-schedules";

export class ScheduleSyncError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ScheduleSyncError";
    this.status = status;
  }
}

export type SyncAutomaticSchedulesResult = {
  schedules: AutomaticScheduleDto[];
  created: number;
  deleted: number;
  updated: number;
  timezone: string;
};

export { resolveScheduleTimezone };

function requireSocialProfile(profile: Profile) {
  if (!profile.social_profile_id?.trim()) {
    throw new ScheduleSyncError(
      "Finish account setup before scheduling posts.",
      409,
    );
  }

  if (
    !profile.instagram_account_id?.trim() &&
    !profile.facebook_account_id?.trim()
  ) {
    throw new ScheduleSyncError(
      "Connect Instagram or Facebook before saving a posting schedule.",
      409,
    );
  }
}

function existingBySlotKey(rows: ScheduleRow[]) {
  const map = new Map<string, ScheduleRow>();

  for (const row of rows) {
    if (!row.cron) continue;
    const parsed = parseWeeklyCron(row.cron);
    if (!parsed) continue;
    map.set(postingSlotKey(parsed), row);
  }

  return map;
}

function rowPlatforms(row: ScheduleRow) {
  try {
    return parseSchedulePlatforms(row.platform);
  } catch {
    return [];
  }
}

/**
 * Reconcile desired weekly slots with Postgres + Trigger.dev imperative schedules.
 *
 * Identity is (day, minutes). Platform changes on a kept slot update the row
 * without recreating the Trigger cron attachment.
 */
export async function syncAutomaticSchedules(input: {
  profile: Profile;
  slots: PostingSlot[];
  timezone?: string;
}): Promise<SyncAutomaticSchedulesResult> {
  let desired: PostingSlot[];
  try {
    desired = normalizePostingSlots(input.slots);
  } catch (error) {
    throw new ScheduleSyncError(
      error instanceof Error ? error.message : "Those posting times are invalid.",
    );
  }

  let timezone: string;
  try {
    timezone = resolveScheduleTimezone(input.timezone);
  } catch (error) {
    if (error instanceof InvalidScheduleTimezoneError) {
      throw new ScheduleSyncError(error.message);
    }
    throw error;
  }

  requireSocialProfile(input.profile);

  const existing = await listAutomaticSchedulesForProfile(input.profile.id);
  const existingMap = existingBySlotKey(existing);

  const desiredKeys = new Set(desired.map(postingSlotKey));
  const toDelete = [...existingMap.entries()]
    .filter(([key]) => !desiredKeys.has(key))
    .map(([, row]) => row);
  const toCreate = desired.filter(
    (slot) => !existingMap.has(postingSlotKey(slot)),
  );
  const toKeep = desired.flatMap((slot) => {
    const row = existingMap.get(postingSlotKey(slot));
    return row ? [{ slot, row }] : [];
  });

  // Stop future runs before removing the Postgres source of truth.
  for (const row of toDelete) {
    if (!row.cron) {
      await deleteAutomaticScheduleForProfile(row.id, input.profile.id);
      continue;
    }

    try {
      await detachAutomaticTriggerSchedule({
        scheduleId: row.id,
        cron: row.cron,
        timezone,
      });
    } catch (error) {
      console.error("Failed to detach Trigger.dev schedule:", {
        scheduleId: row.id,
        error,
      });
      throw new ScheduleSyncError(
        "Unable to update your Trigger.dev schedules right now.",
        502,
      );
    }

    const deleted = await deleteAutomaticScheduleForProfile(
      row.id,
      input.profile.id,
    );
    if (!deleted) {
      throw new ScheduleSyncError(
        "Unable to remove a schedule that no longer belongs to your account.",
        409,
      );
    }
  }

  let updated = 0;

  for (const { slot, row } of toKeep) {
    let fields: { platform: string; platformAccountId: string };
    try {
      fields = schedulePlatformFieldsFromProfile(slot.platforms, input.profile);
    } catch (error) {
      throw new ScheduleSyncError(
        error instanceof Error ? error.message : "Those platforms are invalid.",
        409,
      );
    }

    const platformsChanged = !platformsEqual(slot.platforms, rowPlatforms(row));
    const accountsChanged =
      row.platform_account_id?.trim() !== fields.platformAccountId;

    if (platformsChanged || accountsChanged) {
      const updatedRow = await updateAutomaticScheduleTargetsForProfile({
        scheduleId: row.id,
        profileId: input.profile.id,
        platform: fields.platform,
        platformAccountId: fields.platformAccountId,
      });
      if (!updatedRow) {
        throw new ScheduleSyncError(
          "Unable to update a schedule that no longer belongs to your account.",
          409,
        );
      }
      updated += 1;
    }

    if (!row.cron) continue;
    try {
      await attachAutomaticTriggerSchedule({
        scheduleId: row.id,
        cron: row.cron,
        timezone,
      });
    } catch (error) {
      console.error("Failed to refresh Trigger.dev schedule:", {
        scheduleId: row.id,
        error,
      });
      throw new ScheduleSyncError(
        "Unable to refresh your Trigger.dev schedules right now.",
        502,
      );
    }
  }

  for (const slot of toCreate) {
    let fields: { platform: string; platformAccountId: string };
    try {
      fields = schedulePlatformFieldsFromProfile(slot.platforms, input.profile);
    } catch (error) {
      throw new ScheduleSyncError(
        error instanceof Error ? error.message : "Those platforms are invalid.",
        409,
      );
    }

    const cron = toWeeklyCron(slot.day, slot.minutes);
    const row = await insertAutomaticSchedule({
      profileId: input.profile.id,
      platformAccountId: fields.platformAccountId,
      cron,
      platform: fields.platform,
    });

    try {
      await attachAutomaticTriggerSchedule({
        scheduleId: row.id,
        cron,
        timezone,
      });
    } catch (error) {
      console.error("Failed to attach Trigger.dev schedule:", {
        scheduleId: row.id,
        error,
      });
      await deleteAutomaticScheduleForProfile(row.id, input.profile.id);
      throw new ScheduleSyncError(
        "Unable to create your Trigger.dev schedules right now.",
        502,
      );
    }
  }

  const schedules = toAutomaticScheduleDtos(
    await listAutomaticSchedulesForProfile(input.profile.id),
  );

  return {
    schedules,
    created: toCreate.length,
    deleted: toDelete.length,
    updated,
    timezone,
  };
}
