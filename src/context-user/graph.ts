import { Annotation, END, START, StateGraph } from "@langchain/langgraph";

import type { PostingEnvironment } from "../posting/env";
import { PostingError, toErrorMessage } from "../posting/errors";
import { renderFabricJpeg } from "../posting/fabric-renderer";
import type {
  ContextSnapshot,
  CreativeOutput,
  DirectFabricOutput,
  FinalTemporarySatisfaction,
  VisualCriticResult,
} from "./contracts";
import type { SelectedDesignImage, DesignAi } from "./design-ai";
import { validateAndResolveFabric, validateResolvedFabric } from "./fabric-validation";
import type { VisualCritic } from "./visual-critic";
import type { ContextReferenceImage } from "./images/hydrate";

const GraphState = Annotation.Root({
  current: Annotation<DirectFabricOutput | null>(),
  renders: Annotation<Buffer[]>(),
  revisionCount: Annotation<number>(),
  needsInitialDesign: Annotation<boolean>(),
  needsResolution: Annotation<boolean>(),
  critic: Annotation<VisualCriticResult | null>(),
  qaStatus: Annotation<"accepted" | "accepted_with_minor_issues" | "blocked" | null>(),
  satisfaction: Annotation<FinalTemporarySatisfaction | null>(),
  revisionPending: Annotation<boolean>(),
  invalidRepairCount: Annotation<number>(),
  validationError: Annotation<string | null>(),
});

type VisualGraphDependencies = {
  snapshot: ContextSnapshot;
  creative: CreativeOutput;
  caption: string;
  images: SelectedDesignImage[];
  referenceImages: ContextReferenceImage[];
  designAi: DesignAi;
  critic: VisualCritic;
  postingEnvironment: PostingEnvironment;
  persistMedia: (
    output: DirectFabricOutput,
    revisionCount: number,
    revisionPending: boolean,
  ) => Promise<void>;
  persistFinal: (
    status: "accepted" | "accepted_with_minor_issues" | "blocked",
    satisfaction: FinalTemporarySatisfaction | null,
  ) => Promise<void>;
};

export async function runVisualGraph(input: {
  current: DirectFabricOutput | null;
  revisionCount: number;
  needsInitialDesign: boolean;
  dependencies: VisualGraphDependencies;
}): Promise<{
  current: DirectFabricOutput;
  renders: Buffer[];
  revisionCount: number;
  qaStatus: "accepted" | "accepted_with_minor_issues" | "blocked";
  satisfaction: FinalTemporarySatisfaction | null;
  issues: VisualCriticResult["issues"];
}> {
  const d = input.dependencies;
  const imageUrls = new Map(d.images.map((image) => [image.handle, image.publicUrl]));

  const graph = new StateGraph(GraphState)
    .addNode("prepare", async (state) => {
      if (!state.needsInitialDesign) return {};
      return {
        current: await d.designAi.create({
          snapshot: d.snapshot, creative: d.creative, caption: d.caption, images: d.images,
        }),
        needsResolution: true,
      };
    })
    .addNode("validate_render_persist", async (state) => {
      if (!state.current) throw new PostingError("Visual graph has no Fabric document", false);
      try {
        const current = state.needsResolution
          ? validateAndResolveFabric({
              output: state.current,
              imageUrls,
              maxObjects: d.postingEnvironment.fabricMaxObjects,
              maxBytes: d.postingEnvironment.fabricMaxJsonBytes,
            })
          : validateResolvedFabric({
              output: state.current,
              maxObjects: d.postingEnvironment.fabricMaxObjects,
              maxBytes: d.postingEnvironment.fabricMaxJsonBytes,
            });
        const renders = await Promise.all(current.slides.map((slide) =>
          renderFabricJpeg(slide.fabricJson as never, d.postingEnvironment)));
        await d.persistMedia(current, state.revisionCount, state.revisionPending);
        return {
          current,
          renders,
          needsResolution: false,
          revisionPending: false,
          validationError: null,
        };
      } catch (error) {
        if (!(error instanceof PostingError) || error.retryable) throw error;
        return {
          renders: [],
          validationError: toErrorMessage(error),
        };
      }
    })
    .addNode("repair_invalid", async (state) => {
      if (!state.current || !state.validationError) {
        throw new PostingError("Design repair lacks invalid Fabric JSON or an error", false);
      }
      const current = await d.designAi.repairInvalid({
        snapshot: d.snapshot,
        creative: d.creative,
        caption: d.caption,
        images: d.images,
        current: state.current,
        validationError: state.validationError,
      });
      return {
        current,
        renders: [],
        needsResolution: true,
        validationError: null,
        invalidRepairCount: state.invalidRepairCount + 1,
      };
    })
    .addNode("fail_invalid", async (state) => {
      throw new PostingError(
        `Design remained invalid after two repair attempts: ${state.validationError ?? "unknown validation failure"}`,
        false,
      );
    })
    .addNode("evaluate_visual", async (state) => {
      if (!state.renders.length) throw new PostingError("Visual graph has no rendered pixels", false);
      return {
        critic: await d.critic.evaluate({
          snapshot: d.snapshot,
          creative: d.creative,
          caption: d.caption,
          renderedSlides: state.renders,
          referenceImages: d.referenceImages,
        }),
      };
    })
    .addNode("revise", async (state) => {
      if (!state.current || !state.critic?.revisionBrief) {
        throw new PostingError("Visual revision lacks current design or critic brief", false);
      }
      const nextCount = state.revisionCount + 1;
      const current = await d.designAi.revise({
        snapshot: d.snapshot,
        creative: d.creative,
        caption: d.caption,
        images: d.images,
        current: state.current,
        currentRenders: state.renders,
        revisionBrief: state.critic.revisionBrief,
      });
      return {
        current,
        renders: [],
        revisionCount: nextCount,
        needsResolution: true,
        critic: null,
        satisfaction: null,
        revisionPending: true,
      };
    })
    .addNode("finalize", async (state) => {
      if (!state.critic) throw new PostingError("Visual graph has no critic result", false);
      const blocking = state.critic.visualStatus === "blocking" ||
        state.critic.issues.some((issue) => issue.severity === "blocking");
      if (blocking) {
        await d.persistFinal("blocked", null);
        return { qaStatus: "blocked" as const, satisfaction: null };
      }
      const status = state.critic.visualStatus === "pass" &&
          !state.critic.issues.some((issue) => issue.severity !== "minor")
        ? "accepted" as const
        : "accepted_with_minor_issues" as const;
      const satisfiedHandles = state.critic.temporaryEvaluations
        .filter((row) => row.satisfied)
        .map((row) => row.temporaryHandle);
      const instructionIds = [...new Set(satisfiedHandles.map((handle) => {
        const index = Number(handle.slice("TEMP_".length)) - 1;
        const instruction = d.snapshot.activeTemporaryInstructions[index];
        if (!instruction) throw new PostingError(`Unknown critic temporary handle ${handle}`, false);
        return instruction.id;
      }))];
      const satisfaction: FinalTemporarySatisfaction = {
        schemaVersion: "temporary-satisfaction.v1",
        visualRevision: state.revisionCount,
        instructionIds,
      };
      await d.persistFinal(status, satisfaction);
      return { qaStatus: status, satisfaction };
    })
    .addEdge(START, "prepare")
    .addEdge("prepare", "validate_render_persist")
    .addConditionalEdges("validate_render_persist", (state) => {
      if (!state.validationError) return "evaluate_visual";
      return state.invalidRepairCount < 2 ? "repair_invalid" : "fail_invalid";
    }, ["evaluate_visual", "repair_invalid", "fail_invalid"])
    .addEdge("repair_invalid", "validate_render_persist")
    .addConditionalEdges("evaluate_visual", (state) => {
      if (state.critic?.visualStatus === "revise" && state.revisionCount < 2) return "revise";
      return "finalize";
    }, ["revise", "finalize"])
    .addEdge("revise", "validate_render_persist")
    .addEdge("finalize", END)
    .compile();

  const result = await graph.invoke({
    current: input.current,
    renders: [],
    revisionCount: input.revisionCount,
    needsInitialDesign: input.needsInitialDesign,
    needsResolution: false,
    critic: null,
    qaStatus: null,
    satisfaction: null,
    revisionPending: false,
    invalidRepairCount: 0,
    validationError: null,
  });
  if (!result.current || !result.qaStatus) {
    throw new PostingError("Visual graph did not produce a final state", false);
  }
  return {
    current: result.current,
    renders: result.renders,
    revisionCount: result.revisionCount,
    qaStatus: result.qaStatus,
    satisfaction: result.satisfaction,
    issues: result.critic?.issues ?? [],
  };
}
