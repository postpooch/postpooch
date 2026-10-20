import { getDbPool } from "@/lib/db/client";
import {
  parseSchedulePlatforms,
  type SchedulePlatform,
} from "@/lib/schedule-platforms";
import {
  MAX_AUTOMATIC_SCHEDULES,
  isUiScheduleMinutes,
  parseWeeklyCron,
  sortPostingSlots,
  type PostingSlot,
  type ScheduleSlot,
} from "@/lib/schedule-slots";

export type ScheduleRow = {
  id: string;
  created_at: string;
  profile_id: string | null;
  delete_after_use: boolean | null;
  platform: string | null;
  platform_account_id: string | null;
  uses_template: boolean | null;
  text: string | null;
  cron: string | null;
};

export type AutomaticScheduleDto = {
  id: string;
  cron: string;
  day: ScheduleSlot["day"];
  minutes: number;
  platforms: SchedulePlatform[];
  createdAt: string;
};

export type CreateAutomaticScheduleInput = {
  profileId: string;
  platformAccountId: string;
  cron: string;
  platform: string;
};

export function toScheduleSlot(row: ScheduleRow): ScheduleSlot | null {
  if (!row.cron) return null;

  const parsed = parseWeeklyCron(row.cron);
  if (!parsed) return null;

  return {
    id: row.id,
    day: parsed.day,
    minutes: parsed.minutes,
    cron: row.cron,
  };
}

function platformsFromRow(row: ScheduleRow): SchedulePlatform[] {
  try {
    return parseSchedulePlatforms(row.platform);
  } catch {
    console.warn(
      `Skipping schedule ${row.id}: unsupported platform "${row.platform}".`,
    );
    return [];
  }
}

export function toAutomaticScheduleDtos(
  rows: ScheduleRow[],
): AutomaticScheduleDto[] {
  return rows.flatMap((row) => {
    const slot = toScheduleSlot(row);
    if (!slot || !isUiScheduleMinutes(slot.minutes)) {
      if (row.cron) {
        console.warn(
          `Skipping schedule ${row.id}: missing or unsupported cron "${row.cron}".`,
        );
      }
      return [];
    }

    const platforms = platformsFromRow(row);
    if (platforms.length === 0) {
      return [];
    }

    return [
      {
        id: slot.id,
        cron: slot.cron,
        day: slot.day,
        minutes: slot.minutes,
        platforms,
        createdAt: row.created_at,
      },
    ];
  });
}

export function toPostingSlots(rows: ScheduleRow[]): PostingSlot[] {
  return sortPostingSlots(
    toAutomaticScheduleDtos(rows).map(({ day, minutes, platforms }) => ({
      day,
      minutes,
      platforms,
    })),
  ).slice(0, MAX_AUTOMATIC_SCHEDULES);
}

const AUTOMATIC_SCHEDULE_COLUMNS = `
  id,
  created_at::text as created_at,
  profile_id,
  delete_after_use,
  platform,
  platform_account_id,
  uses_template,
  text,
  cron
`;

/**
 * Recurring template-driven slots for a profile.
 * Excludes one-off posts (`delete_after_use`) and non-template schedules.
 */
export async function listAutomaticSchedulesForProfile(profileId: string) {
  const result = await getDbPool().query<ScheduleRow>(
    `
      select ${AUTOMATIC_SCHEDULE_COLUMNS}
      from public.schedules
      where profile_id = $1::uuid
        and uses_template is true
        and coalesce(delete_after_use, false) is false
      order by created_at asc, id asc
      limit $2::integer
    `,
    [profileId, MAX_AUTOMATIC_SCHEDULES],
  );

  return result.rows;
}

export async function insertAutomaticSchedule(
  input: CreateAutomaticScheduleInput,
) {
  const result = await getDbPool().query<ScheduleRow>(
    `
      insert into public.schedules (
        profile_id,
        delete_after_use,
        platform,
        platform_account_id,
        uses_template,
        text,
        cron
      )
      values (
        $1::uuid,
        false,
        $2,
        $3,
        true,
        null,
        $4
      )
      returning ${AUTOMATIC_SCHEDULE_COLUMNS}
    `,
    [input.profileId, input.platform, input.platformAccountId, input.cron],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Schedule insert did not return a row.");
  }

  return row;
}

export async function updateAutomaticScheduleTargetsForProfile(input: {
  scheduleId: string;
  profileId: string;
  platform: string;
  platformAccountId: string;
}) {
  const result = await getDbPool().query<ScheduleRow>(
    `
      update public.schedules
      set
        platform = $3,
        platform_account_id = $4
      where id = $1::uuid
        and profile_id = $2::uuid
        and uses_template is true
        and coalesce(delete_after_use, false) is false
      returning ${AUTOMATIC_SCHEDULE_COLUMNS}
    `,
    [
      input.scheduleId,
      input.profileId,
      input.platform,
      input.platformAccountId,
    ],
  );

  return result.rows[0] ?? null;
}

export async function deleteAutomaticScheduleForProfile(
  scheduleId: string,
  profileId: string,
) {
  const result = await getDbPool().query<{ id: string }>(
    `
      delete from public.schedules
      where id = $1::uuid
        and profile_id = $2::uuid
        and uses_template is true
        and coalesce(delete_after_use, false) is false
      returning id
    `,
    [scheduleId, profileId],
  );

  return result.rowCount === 1;
}
