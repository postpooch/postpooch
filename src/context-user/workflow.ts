import type { S3Client } from "@aws-sdk/client-s3";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type Zernio from "@zernio/node";
import type { Pool } from "pg";

import { resolveSchedulePlatformTargets } from "../../lib/schedule-platforms";
import type { PostingEnvironment } from "../posting/env";
import { PostingError } from "../posting/errors";
import { renderFabricJpeg } from "../posting/fabric-renderer";
import { objectKeyForMedia, sha256, uploadJpegToR2 } from "../posting/r2";
import { PostingRepository } from "../posting/repository";
import type { PostingRun, ScheduleRow } from "../posting/types";
import { publishWithZernio } from "../posting/zernio";
import { CreativeAgent } from "./creative-agent";
import { directFabricOutputSchema, type DirectFabricOutput } from "./contracts";
import { DesignAi } from "./design-ai";
import type { ContextUserEnvironment } from "./environment";
import { runVisualGraph } from "./graph";
import { createHandleMaps } from "./handle-map";
import { createImageDiscoveryService } from "./image-tools/image-discovery";
import { BoundedImageTools } from "./image-tools/tools";
import type { ImageDiscoveryService } from "./image-tools/image-discovery";
import { hydrateContextLinkedImages, hydrateSelectedDesignImages } from "./images/hydrate";
import { ContextUserRepository } from "./repository";
import { VisualCritic } from "./visual-critic";

function blockingVisualError(
  issues: Array<{ code: string; detail: string; severity: string }>,
) {
  const details = issues
    .filter((issue) => issue.severity === "blocking")
    .slice(0, 5)
    .map((issue) => `${issue.code}: ${issue.detail}`)
    .join("; ");
  return details
    ? `Final visual contains a blocking defect: ${details}`
    : "Final visual contains a blocking defect";
}

export type ContextUserWorkflowDependencies = {
  database: Pool;
  r2: S3Client;
  zernio: Zernio;
  postingEnvironment: PostingEnvironment;
  contextEnvironment: ContextUserEnvironment;
  models: {
    creative: () => Promise<BaseChatModel>;
    design: () => Promise<BaseChatModel>;
    critic: () => Promise<BaseChatModel>;
  };
  imageDiscovery?: ImageDiscoveryService;
  onProgress?: (stage: string) => void;
};

function persistedFabric(media: Awaited<ReturnType<ContextUserRepository["getMedia"]>>): DirectFabricOutput | null {
  if (!media.length) return null;
  const parsed = directFabricOutputSchema.safeParse({
    schemaVersion: "direct-fabric-output.v1",
    slides: media.map((row) => ({
      displayOrder: row.display_order,
      fabricJson: row.image_design,
    })),
  });
  // Media is durable only after it passes the current Fabric contract. Legacy
  // or interrupted placeholder rows are not completed Design AI work and must
  // be regenerated; replaceMedia atomically replaces them after validation.
  return parsed.success ? parsed.data : null;
}

export async function executeContextUserWorkflow(input: {
  schedule: ScheduleRow;
  postingRun: PostingRun;
  occurrenceAt: string;
  triggerRunId: string;
}, dependencies: ContextUserWorkflowDependencies): Promise<{ postId: string; mediaUrls: string[] }> {
  if (!input.schedule.profile_id) throw new PostingError("Scheduled post has no profile owner", false);
  const repository = new ContextUserRepository(dependencies.database);
  const postingRepository = new PostingRepository(dependencies.database);
  let run = await repository.getRun(input.postingRun.id);

  if (run.status === "published") {
    await repository.finalize(run.id);
    return { postId: run.zernioPostId ?? "", mediaUrls: run.mediaUrls ?? [] };
  }

  dependencies.onProgress?.("freezing-context");
  const snapshot = run.contextSnapshot ?? await repository.freezeContextSnapshot(run.id);
  const maps = createHandleMaps(snapshot);
  const visualAlreadyAccepted =
    (run.visualQaStatus === "accepted" || run.visualQaStatus === "accepted_with_minor_issues") &&
    run.finalTemporarySatisfaction !== null;
  const contextReferenceImages = (!run.creativeOutput || !visualAlreadyAccepted)
    ? await hydrateContextLinkedImages({
        snapshot,
        maps,
        r2: dependencies.r2,
        postingEnvironment: dependencies.postingEnvironment,
        contextEnvironment: dependencies.contextEnvironment,
      })
    : [];

  if (!run.creativeOutput) {
    dependencies.onProgress?.("creative-agent");
    const creativeModel = await dependencies.models.creative();
    const imageDiscovery = dependencies.imageDiscovery ??
      createImageDiscoveryService(dependencies.contextEnvironment);
    const imageTools = new BoundedImageTools({
      repository,
      r2: dependencies.r2,
      postingEnvironment: dependencies.postingEnvironment,
      contextEnvironment: dependencies.contextEnvironment,
      imageDiscovery,
      profileId: snapshot.ownerProfileId,
      maps,
    });
    const result = await new CreativeAgent({
      model: creativeModel,
      imageTools,
      maps,
      snapshot,
      r2: dependencies.r2,
      postingEnvironment: dependencies.postingEnvironment,
      contextEnvironment: dependencies.contextEnvironment,
      postingRunId: run.id,
    }).run();
    await repository.saveCreative({
      postingRunId: run.id,
      triggerRunId: input.triggerRunId,
      creative: result.creative,
      caption: result.caption,
      historySummary: result.historySummary,
    });
    run = await repository.getRun(run.id);
  }
  if (!run.creativeOutput || !run.caption || !run.historySummary) {
    throw new PostingError("Posting run is missing committed creative output", true);
  }

  const designImages = await hydrateSelectedDesignImages({
    creative: run.creativeOutput,
    r2: dependencies.r2,
    postingEnvironment: dependencies.postingEnvironment,
    contextEnvironment: dependencies.contextEnvironment,
  });
  let media = await repository.getMedia(run.id);
  let current = persistedFabric(media);

  if (run.visualQaStatus === "blocked") {
    throw new PostingError("Final visual contains a blocking defect", false);
  }

  let finalRenders: Buffer[] = [];
  if (!(run.visualQaStatus === "accepted" || run.visualQaStatus === "accepted_with_minor_issues") ||
      !run.finalTemporarySatisfaction) {
    dependencies.onProgress?.("design-and-visual-qa");
    const [designModel, criticModel] = await Promise.all([
      dependencies.models.design(),
      dependencies.models.critic(),
    ]);
    const visual = await runVisualGraph({
      current,
      revisionCount: run.visualRevisionCount,
      needsInitialDesign: current === null,
      dependencies: {
        snapshot,
        creative: run.creativeOutput,
        caption: run.caption,
        images: designImages,
        referenceImages: contextReferenceImages,
        designAi: new DesignAi(designModel, dependencies.contextEnvironment.modelTimeoutMs),
        critic: new VisualCritic(criticModel, dependencies.contextEnvironment.modelTimeoutMs),
        postingEnvironment: dependencies.postingEnvironment,
        persistMedia: (output, revisionCount, revisionPending) => repository.replaceMedia({
          postingRunId: run.id,
          triggerRunId: input.triggerRunId,
          slides: output.slides,
          revisionCount,
          revisionPending,
        }),
        persistFinal: (status, satisfaction) => repository.saveFinalQa({
          postingRunId: run.id, triggerRunId: input.triggerRunId, status, satisfaction,
        }),
      },
    });
    if (visual.qaStatus === "blocked") {
      throw new PostingError(blockingVisualError(visual.issues), false);
    }
    current = visual.current;
    finalRenders = visual.renders;
    run = await repository.getRun(run.id);
    media = await repository.getMedia(run.id);
  }

  if (!current) current = persistedFabric(media);
  if (!current) throw new PostingError("Accepted post has no Fabric media", false);
  if (!finalRenders.length) {
    finalRenders = await Promise.all(current.slides.map((slide) =>
      renderFabricJpeg(slide.fabricJson as never, dependencies.postingEnvironment)));
  }

  let mediaUrls = run.mediaUrls;
  if (!mediaUrls?.length) {
    dependencies.onProgress?.("uploading-final-renders");
    if (media.length !== finalRenders.length) throw new PostingError("Persisted media/render count mismatch", true);
    mediaUrls = [];
    for (const [index, jpeg] of finalRenders.entries()) {
      const row = media[index];
      const uploaded = await uploadJpegToR2({
        client: dependencies.r2,
        environment: dependencies.postingEnvironment,
        key: objectKeyForMedia({
          scheduleId: input.schedule.id,
          occurrenceAt: input.occurrenceAt,
          media: row,
          contentHash: sha256(jpeg),
        }),
        jpeg,
      });
      mediaUrls.push(uploaded.url);
    }
    await postingRepository.saveMediaUrls(run.id, input.triggerRunId, mediaUrls);
  }

  dependencies.onProgress?.("publishing");
  const targets = resolveSchedulePlatformTargets(input.schedule.platform, input.schedule.platform_account_id);
  const published = await publishWithZernio({
    client: dependencies.zernio,
    requestId: run.zernioRequestId,
    scheduleId: input.schedule.id,
    occurrenceAt: input.occurrenceAt,
    targets: targets.map((target) => ({ platform: target.zernioPlatform, accountId: target.accountId })),
    caption: run.caption,
    mediaUrls,
  });
  await postingRepository.markPublished({
    postingRunId: run.id,
    triggerRunId: input.triggerRunId,
    zernioPostId: published.postId,
    mediaUrls,
  });
  await repository.finalize(run.id);
  return { postId: published.postId, mediaUrls };
}
