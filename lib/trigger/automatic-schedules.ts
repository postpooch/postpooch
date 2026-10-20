import { schedules as triggerSchedules } from "@trigger.dev/sdk/v3";

/** Must match `generateAndPostScheduledSocialPost.id` in src/trigger. */
export const AUTOMATIC_SOCIAL_POST_TASK_ID = "generate-and-post-scheduled-social-post";

/** Run at the CRON time instead of accepting Trigger.dev's default spread. */
export const AUTOMATIC_SOCIAL_POST_WINDOW = "0m";

/**
 * Dedup keys are project-scoped across Trigger environments.
 * Qualify by env so dev/staging/prod do not steal each other's schedules.
 */
export function automaticScheduleDeduplicationKey(scheduleId: string) {
  const env =
    process.env.TRIGGER_SCHEDULE_ENV?.trim() ||
    (process.env.NODE_ENV === "production" ? "prod" : "dev");

  return `${env}:postpooch:${scheduleId}`;
}

export type TriggerScheduleAttachment = {
  scheduleId: string;
  cron: string;
  timezone: string;
};

export async function attachAutomaticTriggerSchedule(
  input: TriggerScheduleAttachment,
) {
  return triggerSchedules.create({
    task: AUTOMATIC_SOCIAL_POST_TASK_ID,
    cron: input.cron,
    timezone: input.timezone,
    window: AUTOMATIC_SOCIAL_POST_WINDOW,
    externalId: input.scheduleId,
    deduplicationKey: automaticScheduleDeduplicationKey(input.scheduleId),
  });
}

/**
 * Resolve the Trigger `sched_...` id via the stable deduplication key, then delete.
 * Avoids storing Trigger schedule ids in Postgres while remaining idempotent.
 */
export async function detachAutomaticTriggerSchedule(
  input: TriggerScheduleAttachment,
) {
  const attached = await attachAutomaticTriggerSchedule(input);
  await triggerSchedules.del(attached.id);
  return attached.id;
}
