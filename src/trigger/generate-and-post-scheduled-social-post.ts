import { AbortTaskRunError, logger, metadata, schedules as triggerSchedules } from "@trigger.dev/sdk/v3";

import { createContextUserModel } from "../context-user/model-factory";
import { getContextUserEnvironment } from "../context-user/environment";
import { ContextUserRepository } from "../context-user/repository";
import { executeContextUserWorkflow } from "../context-user/workflow";
import { getDatabasePool, getR2Client, getZernioClient } from "../posting/clients";
import { getPostingEnvironment } from "../posting/env";
import { isRetryableError, PostingError, toErrorMessage } from "../posting/errors";
import { occurrenceAtIso, requestIdForOccurrence, resolveScheduleRowId } from "../posting/identity";
import { PostingRepository } from "../posting/repository";
import type { PostingRun } from "../posting/types";

export const generateAndPostScheduledSocialPost = triggerSchedules.task({
  id: "generate-and-post-scheduled-social-post",
  maxDuration: 900,
  ttl: "2h",
  queue: { concurrencyLimit: 5 },
  retry: {
    maxAttempts: 4,
    minTimeoutInMs: 5_000,
    maxTimeoutInMs: 60_000,
    factor: 2,
    randomize: true,
  },
  run: async (payload, { ctx }) => {
    const postingEnvironment = getPostingEnvironment();
    const database = getDatabasePool();
    const repository = new PostingRepository(database);
    const scheduleId = resolveScheduleRowId({ externalId: payload.externalId, scheduleId: payload.scheduleId });
    const occurrenceAt = occurrenceAtIso(payload.timestamp);
    const triggerRunId = ctx.run.id;
    let postingRun: PostingRun | undefined;
    metadata.set("scheduleId", scheduleId).set("occurrenceAt", occurrenceAt).set("stage", "starting");
    try {
      const schedule = await repository.getSchedule(scheduleId);
      postingRun = await repository.acquireRun({
        scheduleId,
        occurrenceAt,
        triggerRunId,
        requestId: requestIdForOccurrence(scheduleId, occurrenceAt),
        // A generation occurrence can include several bounded model calls. Keep
        // the occurrence claim valid for longer than the task's 15-minute cap.
        leaseSeconds: Math.max(postingEnvironment.postingLeaseSeconds, 1_200),
      });
      if (postingRun.status === "published") {
        // Publication recovery must not depend on image/model providers. The
        // short finalization transaction reuses durable satisfaction state.
        await new ContextUserRepository(database).finalize(postingRun.id);
        await cleanupAfterSuccess(schedule, payload.scheduleId, repository);
        return {
          status: "already-published" as const,
          postId: postingRun.zernio_post_id ?? "",
          mediaUrls: postingRun.media_urls ?? [],
        };
      }
      if (!postingRun.acquired) {
        return { status: "already-processing" as const, postId: null, mediaUrls: [] };
      }
      const contextEnvironment = getContextUserEnvironment();
      const result = await executeContextUserWorkflow(
        { schedule, postingRun, occurrenceAt, triggerRunId },
        {
          database,
          r2: getR2Client(),
          zernio: getZernioClient(),
          postingEnvironment,
          contextEnvironment,
          models: {
            creative: () => createContextUserModel(contextEnvironment, "creative"),
            design: () => createContextUserModel(contextEnvironment, "design"),
            critic: () => createContextUserModel(contextEnvironment, "critic"),
          },
          onProgress: (stage) => metadata.set("stage", stage),
        },
      );
      await cleanupAfterSuccess(schedule, payload.scheduleId, repository);
      logger.info("Generated social post submitted successfully", {
        scheduleId, occurrenceAt, zernioPostId: result.postId, mediaCount: result.mediaUrls.length,
      });
      return { status: "published" as const, ...result };
    } catch (error) {
      metadata.set("stage", "failed").set("error", toErrorMessage(error));
      if (postingRun?.acquired && postingRun.status !== "published") {
        await repository.markFailed(postingRun.id, triggerRunId, error).catch((ledgerError) =>
          logger.error("Could not record generation failure", { error: toErrorMessage(ledgerError) }));
      }
      if (!isRetryableError(error)) throw new AbortTaskRunError(toErrorMessage(error));
      throw error;
    }
  },
});

async function cleanupAfterSuccess(
  schedule: { id: string; delete_after_use: boolean | null },
  triggerScheduleId: string,
  repository: PostingRepository,
): Promise<void> {
  if (!schedule.delete_after_use) return;
  if (!triggerScheduleId.startsWith("sched_")) {
    throw new PostingError("Cannot delete Trigger.dev schedule because scheduleId is invalid", false);
  }
  await triggerSchedules.del(triggerScheduleId);
  await repository.deleteSchedule(schedule.id);
}
