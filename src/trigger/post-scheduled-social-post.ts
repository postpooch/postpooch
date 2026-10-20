import {
  AbortTaskRunError,
  logger,
  metadata,
  schedules as triggerSchedules,
} from "@trigger.dev/sdk/v3";

import {
  getDatabasePool,
  getR2Client,
  getZernioClient,
} from "../posting/clients";
import { getPostingEnvironment } from "../posting/env";
import {
  isRetryableError,
  PostingError,
  toErrorMessage,
} from "../posting/errors";
import {
  occurrenceAtIso,
  requestIdForOccurrence,
  resolveScheduleRowId,
} from "../posting/identity";
import { PostingRepository } from "../posting/repository";
import type { PostingRun } from "../posting/types";
import { executePostingWorkflow } from "../posting/workflow";

export const postScheduledSocialPost = triggerSchedules.task({
  id: "post-scheduled-social-post",
  maxDuration: 300,
  ttl: "30m",
  queue: {
    concurrencyLimit: 5,
  },
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 2_000,
    maxTimeoutInMs: 30_000,
    factor: 2,
    randomize: true,
  },
  run: async (payload, { ctx }) => {
    const environment = getPostingEnvironment();
    const repository = new PostingRepository(getDatabasePool());
    const scheduleId = resolveScheduleRowId({
      externalId: payload.externalId,
      scheduleId: payload.scheduleId,
    });
    const occurrenceAt = occurrenceAtIso(payload.timestamp);
    const triggerRunId = ctx.run.id;
    let postingRun: PostingRun | undefined;

    metadata
      .set("scheduleId", scheduleId)
      .set("occurrenceAt", occurrenceAt)
      .set("stage", "starting");

    try {
      const schedule = await repository.getSchedule(scheduleId);
      postingRun = await repository.acquireRun({
        scheduleId,
        occurrenceAt,
        triggerRunId,
        requestId: requestIdForOccurrence(scheduleId, occurrenceAt),
        leaseSeconds: environment.postingLeaseSeconds,
      });

      if (postingRun.status === "published") {
        await cleanupAfterSuccess(
          schedule,
          payload.scheduleId,
          repository,
        );
        metadata.set("stage", "already-published");
        return {
          status: "already-published" as const,
          postId: postingRun.zernio_post_id,
          mediaUrls: postingRun.media_urls ?? [],
        };
      }

      if (!postingRun.acquired) {
        logger.warn("Another run is already processing this occurrence", {
          scheduleId,
          occurrenceAt,
        });
        metadata.set("stage", "already-processing");
        return {
          status: "already-processing" as const,
          postId: null,
          mediaUrls: [],
        };
      }

      const result = await executePostingWorkflow(
        { schedule, postingRun, occurrenceAt, triggerRunId },
        {
          database: getDatabasePool(),
          r2: getR2Client(),
          zernio: getZernioClient(),
          environment,
          onProgress: (progress) => {
            metadata.set("stage", progress.stage);
            if (progress.completed !== undefined) {
              metadata.set("completed", progress.completed);
            }
            if (progress.total !== undefined) {
              metadata.set("total", progress.total);
            }
          },
        },
      );

      await cleanupAfterSuccess(schedule, payload.scheduleId, repository);
      logger.info("Social post submitted successfully", {
        scheduleId,
        occurrenceAt,
        zernioPostId: result.postId,
        mediaCount: result.mediaUrls.length,
      });

      return {
        status: "published" as const,
        postId: result.postId,
        mediaUrls: result.mediaUrls,
      };
    } catch (error) {
      metadata.set("stage", "failed").set("error", toErrorMessage(error));

      if (postingRun?.acquired && postingRun.status !== "published") {
        try {
          await repository.markFailed(postingRun.id, triggerRunId, error);
        } catch (ledgerError) {
          logger.error("Could not record the posting failure", {
            error: toErrorMessage(ledgerError),
            originalError: toErrorMessage(error),
          });
        }
      }

      logger.error("Scheduled social post failed", {
        scheduleId,
        occurrenceAt,
        error: toErrorMessage(error),
        retryable: isRetryableError(error),
      });

      if (!isRetryableError(error)) {
        throw new AbortTaskRunError(toErrorMessage(error));
      }

      throw error;
    }
  },
});

async function cleanupAfterSuccess(
  schedule: {
    id: string;
    delete_after_use: boolean | null;
  },
  triggerScheduleId: string,
  repository: PostingRepository,
): Promise<void> {
  if (!schedule.delete_after_use) {
    return;
  }

  if (!triggerScheduleId.startsWith("sched_")) {
    throw new PostingError(
      "Cannot delete the Trigger.dev schedule because its scheduleId is invalid",
      false,
    );
  }

  // Stop future invocations before deleting the PostgreSQL source row.
  await triggerSchedules.del(triggerScheduleId);
  await repository.deleteSchedule(schedule.id);
}
