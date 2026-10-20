import "server-only";
import sharp from "sharp";

import { decideClassification, type NoteClassifier } from "@/lib/social-media/context/classification-policy";
import type { MutationPlanner, PlannerSnapshot } from "@/lib/social-media/context/contracts";
import { identityRegistry } from "@/lib/social-media/context/identity-registry";
import { JevNoteClassifier } from "@/lib/social-media/context/jev-note-classifier";
import { LangChainMutationPlanner } from "@/lib/social-media/context/mutation-planner";
import {
  ContextRetryNotAllowedError,
  ContextRecordNotFoundError,
  ProcessingAttemptSupersededError,
  SocialMediaContextRepository,
  canonicalizeNote,
} from "@/lib/social-media/context/repository";
import type { ContextBuilderResult, ContextSnapshot, ProcessingClaim } from "@/lib/social-media/context/types";
import { PlanAlreadySatisfiedError, PlanNeedsReviewError, validateMutationPlan } from "@/lib/social-media/context/validate-plan";
import { loadOwnedAssetBytes } from "@/lib/social-media/assets";

export type SubmitNoteResult =
  | { kind: "result"; result: ContextBuilderResult; replay: boolean }
  | { kind: "processing"; noteId: string; replay: boolean };

type ServiceDependencies = {
  classifierFactory?: () => NoteClassifier;
  plannerFactory?: () => MutationPlanner;
  now?: () => Date;
};

export type SocialMediaContextRepositoryPort = Pick<SocialMediaContextRepository,
  "profileId" |
  "createNote" | "claimNote" | "getOwnedNote" | "getLatestOutcome" | "getSnapshot" | "finishWithoutMutation" |
  "resolveExactCity" | "applyPlan" | "getNoteAssetIds"
>;

export function toPlannerSnapshot(snapshot: ContextSnapshot): PlannerSnapshot {
  return {
    revision: snapshot.revision,
    identity: snapshot.identity,
    markets: snapshot.markets.map((row, index) => ({ index: index + 1, cityName: row.cityName, stateCode: row.stateCode })),
    preferences: snapshot.preferences.map((row, index) => ({ index: index + 1, text: row.text })),
    frequencyInstructions: snapshot.frequencyInstructions.map((row, index) => ({ index: index + 1, text: row.text })),
    temporaryInstructions: snapshot.temporaryInstructions.map((row, index) => ({
      index: index + 1,
      instruction: row.instruction,
      instructionType: row.instructionType,
      remainingPosts: row.remainingPosts,
      startsAt: row.startsAt,
      endsAt: row.endsAt,
    })),
  };
}

export class SocialMediaContextBuilderService {
  private readonly classifierFactory: () => NoteClassifier;
  private readonly plannerFactory: () => MutationPlanner;
  private readonly now: () => Date;

  constructor(
    private readonly repository: SocialMediaContextRepositoryPort,
    dependencies: ServiceDependencies = {},
  ) {
    this.classifierFactory = dependencies.classifierFactory ?? (() => new JevNoteClassifier());
    this.plannerFactory = dependencies.plannerFactory ?? (() => new LangChainMutationPlanner());
    this.now = dependencies.now ?? (() => new Date());
  }

  async submit(noteText: string, submissionKey: string, assetIds: string[] = []): Promise<SubmitNoteResult> {
    const note = canonicalizeNote(noteText);
    const persisted = await this.repository.createNote(note, submissionKey, assetIds);
    if (!persisted.created) {
      if (persisted.outcome) return { kind: "result", result: persisted.outcome, replay: true };
    }
    const claim = await this.repository.claimNote(persisted.noteId);
    if (!claim) return { kind: "processing", noteId: persisted.noteId, replay: !persisted.created };
    return { kind: "result", result: await this.process(claim, note, assetIds), replay: !persisted.created };
  }

  async retry(noteId: string): Promise<SubmitNoteResult> {
    const note = await this.repository.getOwnedNote(noteId);
    if (!note) throw new ContextRecordNotFoundError("That note could not be found.");
    const latest = await this.repository.getLatestOutcome(noteId);
    if (!latest || (latest.state !== "conflict" && latest.state !== "infrastructure_failure")) {
      throw new ContextRetryNotAllowedError();
    }
    const claim = await this.repository.claimNote(noteId, true);
    if (!claim) return { kind: "processing", noteId, replay: true };
    const assetIds = await this.repository.getNoteAssetIds(noteId);
    return { kind: "result", result: await this.process(claim, note.note, assetIds), replay: true };
  }

  private async process(claim: ProcessingClaim, note: string, assetIds: string[]): Promise<ContextBuilderResult> {
    let snapshot: ContextSnapshot | null = null;
    let classification: Awaited<ReturnType<NoteClassifier["classify"]>> | undefined;
    try {
      snapshot = await this.repository.getSnapshot();
      classification = await this.classifierFactory().classify({ note });
      const decision = decideClassification(classification);
      if (decision.kind === "needs_review") {
        return await this.repository.finishWithoutMutation(claim, {
          state: "needs_review",
          snapshotRevision: snapshot.revision,
          classification,
          reasonCode: decision.reasonCode,
        });
      }

      const referenceTimestamp = this.now().toISOString();
      const attachedAssets = await Promise.all(assetIds.map(async (assetId, index) => {
        const loaded = await loadOwnedAssetBytes(this.repository.profileId, assetId);
        if (!loaded) throw new ContextRecordNotFoundError("An attached image is no longer available.");
        const preview = await sharp(loaded.bytes, { limitInputPixels: 40_000_000 })
          .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 85 }).toBuffer();
        return {
          handle: `IMAGE_${index + 1}` as const,
          assetId,
          purpose: loaded.asset.purpose,
          mimeType: "image/jpeg",
          dataUrl: `data:image/jpeg;base64,${preview.toString("base64")}`,
        };
      }));
      const plan = await this.plannerFactory().plan({
        note,
        routedCategories: decision.categories,
        snapshot: toPlannerSnapshot(snapshot),
        identityRegistry,
        referenceTimestamp,
        timeZone: snapshot.timeZone,
        attachedAssets,
      });
      if (plan.disposition === "no_change") {
        return await this.repository.finishWithoutMutation(claim, {
          state: "no_change",
          snapshotRevision: snapshot.revision,
          classification,
          mutationPlan: plan,
          reasonCode: plan.reasonCode,
        });
      }
      if (plan.disposition === "needs_review") {
        return await this.repository.finishWithoutMutation(claim, {
          state: "needs_review",
          snapshotRevision: snapshot.revision,
          classification,
          mutationPlan: plan,
          reasonCode: plan.reasonCode,
        });
      }

      try {
        const operations = await validateMutationPlan({
          plan,
          routedCategories: decision.categories,
          snapshot,
          resolveCity: (cityName, stateCode) => this.repository.resolveExactCity(cityName, stateCode),
          attachedAssetByHandle: new Map(attachedAssets.map((asset) => [asset.handle, asset.assetId])),
        });
        return await this.repository.applyPlan({
          claim,
          snapshot,
          operations,
          classification,
          mutationPlan: plan,
          sourceNoteText: note,
        });
      } catch (error) {
        if (error instanceof PlanAlreadySatisfiedError) {
          return await this.repository.finishWithoutMutation(claim, {
            state: "no_change",
            snapshotRevision: snapshot.revision,
            classification,
            mutationPlan: plan,
            reasonCode: "already_satisfied",
          });
        }
        if (!(error instanceof PlanNeedsReviewError)) {
          // TEMPORARY DIAGNOSTIC: remove after reproducing the planner's cross-category output.
          // Keep this at the validation boundary so it records rejected plans without changing
          // the prompt, schema, model settings, or mutation behavior.
          console.error("[social-media-context][TEMP planner rejection diagnostic]", JSON.stringify({
            validationError: error instanceof Error
              ? { name: error.name, message: error.message }
              : { value: String(error) },
            noteId: claim.noteId,
            attemptNumber: claim.attemptNumber,
            note,
            classification,
            routedCategories: decision.categories,
            plannerInput: {
              currentContext: toPlannerSnapshot(snapshot),
              identityRegistry,
              referenceTimestamp,
              timeZone: snapshot.timeZone,
              attachedAssets: attachedAssets.map(({ handle, purpose, mimeType }) => ({ handle, purpose, mimeType })),
            },
            rejectedMutationPlan: plan,
          }, null, 2));
          throw error;
        }
        return await this.repository.finishWithoutMutation(claim, {
          state: "needs_review",
          snapshotRevision: snapshot.revision,
          classification,
          mutationPlan: plan,
          reasonCode: error.reasonCode,
        });
      }
    } catch (error) {
      if (error instanceof ProcessingAttemptSupersededError) throw error;
      try {
        return await this.repository.finishWithoutMutation(claim, {
          state: "infrastructure_failure",
          snapshotRevision: snapshot?.revision ?? null,
          classification,
          reasonCode: "AI_OR_PROCESSING_FAILURE",
          detail: { retryable: true },
        });
      } catch (finishError) {
        if (finishError instanceof ProcessingAttemptSupersededError) throw finishError;
        throw error;
      }
    }
  }
}
