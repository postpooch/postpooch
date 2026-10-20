import type { S3Client } from "@aws-sdk/client-s3";
import type Zernio from "@zernio/node";
import type { Pool } from "pg";

import { resolveSchedulePlatformTargets } from "../../lib/schedule-platforms";
import type { PostingEnvironment } from "./env";
import { PostingError, toErrorMessage } from "./errors";
import { renderFabricJpeg } from "./fabric-renderer";
import { objectKeyForMedia, sha256, uploadJpegToR2 } from "./r2";
import { PostingRepository } from "./repository";
import type { PostingRun, ScheduleRow } from "./types";
import { publishWithZernio } from "./zernio";

export type PostingWorkflowDependencies = {
  database: Pool;
  r2: S3Client;
  zernio: Zernio;
  environment: PostingEnvironment;
  onProgress?: (progress: {
    stage: string;
    completed?: number;
    total?: number;
  }) => void;
};

export type PostingWorkflowInput = {
  schedule: ScheduleRow;
  postingRun: PostingRun;
  occurrenceAt: string;
  triggerRunId: string;
};

function resolvePublishTargets(schedule: ScheduleRow) {
  try {
    return resolveSchedulePlatformTargets(
      schedule.platform,
      schedule.platform_account_id,
    );
  } catch (error) {
    throw new PostingError(
      `Schedule ${schedule.id}: ${toErrorMessage(error)}`,
      false,
    );
  }
}

export async function executePostingWorkflow(
  input: PostingWorkflowInput,
  dependencies: PostingWorkflowDependencies,
): Promise<{ postId: string; mediaUrls: string[] }> {
  const { schedule, postingRun, occurrenceAt, triggerRunId } = input;
  const { environment } = dependencies;
  const repository = new PostingRepository(dependencies.database);
  const targets = resolvePublishTargets(schedule);

  dependencies.onProgress?.({ stage: "loading-content" });
  const content = await repository.getContent(schedule, postingRun);

  let mediaUrls = postingRun.media_urls;
  if (!mediaUrls?.length) {
    mediaUrls = [];
    for (const [index, media] of content.media.entries()) {
      dependencies.onProgress?.({
        stage: "rendering-and-uploading",
        completed: index,
        total: content.media.length,
      });
      const jpeg = await renderFabricJpeg(media.image_design!, environment);
      const key = objectKeyForMedia({
        scheduleId: schedule.id,
        occurrenceAt,
        media,
        contentHash: sha256(jpeg),
      });
      const uploaded = await uploadJpegToR2({
        client: dependencies.r2,
        environment,
        key,
        jpeg,
      });
      mediaUrls.push(uploaded.url);
    }

    await repository.saveMediaUrls(postingRun.id, triggerRunId, mediaUrls);
  }

  dependencies.onProgress?.({
    stage: "publishing",
    completed: mediaUrls.length,
    total: mediaUrls.length,
  });
  const published = await publishWithZernio({
    client: dependencies.zernio,
    requestId: postingRun.zernio_request_id,
    scheduleId: schedule.id,
    occurrenceAt,
    targets: targets.map((target) => ({
      platform: target.zernioPlatform,
      accountId: target.accountId,
    })),
    caption: content.caption,
    mediaUrls,
  });

  await repository.markPublished({
    postingRunId: postingRun.id,
    triggerRunId,
    zernioPostId: published.postId,
    mediaUrls,
  });
  dependencies.onProgress?.({
    stage: "published",
    completed: mediaUrls.length,
    total: mediaUrls.length,
  });

  return { postId: published.postId, mediaUrls };
}
