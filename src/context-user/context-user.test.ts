import type { S3Client } from "@aws-sdk/client-s3";
import { describe, expect, it } from "vitest";

import type { PostingEnvironment } from "../posting/env";
import { validateAndResolveFabric, validateResolvedFabric } from "./fabric-validation";
import { createHandleMaps } from "./handle-map";
import { materializeDiscoveredImage } from "./images/storage";
import { hydrateSelectedDesignImages } from "./images/hydrate";
import { BoundedImageTools } from "./image-tools/tools";
import { createImageDiscoveryService } from "./image-tools/image-discovery";
import { designContext, normalizeDirectFabricOutput, recoverDoubleEncodedFabricOutput } from "./design-ai";
import { runVisualGraph } from "./graph";
import { VisualCritic } from "./visual-critic";
import { directFabricOutputSchema } from "./contracts";
import type { ContextSnapshot, CreativeOutput, DirectFabricOutput, VisualCriticResult } from "./contracts";
import { validateCreativeProposal } from "./creative-agent";
import { addCandidate } from "./handle-map";

const snapshot: ContextSnapshot = {
  schemaVersion: "social-context-snapshot.v1",
  ownerProfileId: "11111111-1111-4111-8111-111111111111",
  occurrenceAt: "2026-12-31T23:00:00.000Z",
  contextRevision: 4,
  canonicalTimeZone: "America/Phoenix",
  identity: {
    displayName: "Avery", professionalTitle: null, brokerageName: null,
    markets: [], targetAudience: null, specialties: [], personalContext: null,
    primaryBrandColor: "#123456", secondaryBrandColor: null,
  },
  preferences: [{ id: "22222222-2222-4222-8222-222222222222", instruction: "Use clean typography.", assetRefs: [] }],
  frequencyInstructions: [{ id: "33333333-3333-4333-8333-333333333333", instruction: "Neighborhood posts sometimes.", assetRefs: [] }],
  activeTemporaryInstructions: [
    { id: "44444444-4444-4444-8444-444444444444", instruction: "Promote the open house.", instructionType: "counter", remainingPostsAtSnapshot: 2, startsAt: null, endsAt: null, sourceTimeZone: "America/Phoenix", sourceNoteId: "55555555-5555-4555-8555-555555555555", assetRefs: [] },
    { id: "66666666-6666-4666-8666-666666666666", instruction: "Use a friendly voice this month.", instructionType: "date_range", remainingPostsAtSnapshot: null, startsAt: "2026-12-01T07:00:00.000Z", endsAt: "2027-01-01T07:00:00.000Z", sourceTimeZone: "America/Phoenix", sourceNoteId: "77777777-7777-4777-8777-777777777777", assetRefs: [] },
  ],
  linkedAssets: [],
  recentPublishedPosts: [],
};

const creative: CreativeOutput = {
  schemaVersion: "creative-output.v1",
  concept: "Open-house invitation",
  selectedImages: [{
    source: "user_asset", assetId: "88888888-8888-4888-8888-888888888888",
    storageKey: "social-media-assets/source.jpg", mimeType: "image/jpeg",
    width: 1000, height: 1000, role: "hero",
  }],
  intendedTemporaryInstructionIds: [],
};

const postingEnvironment: PostingEnvironment = {
  databaseUrl: "postgresql://example", zernioApiKey: "secret", r2AccountId: "account",
  r2AccessKeyId: "key", r2SecretAccessKey: "secret", r2Bucket: "bucket",
  r2PublicBaseUrl: "https://media.example.com", fabricDefaultWidth: 64,
  fabricDefaultHeight: 64, fabricMaxJsonBytes: 100_000, fabricMaxPixels: 100_000,
  fabricMaxObjects: 100, fabricRenderTimeoutMs: 5_000, fabricJpegQuality: 0.8,
  fabricJpegBackground: "#ffffff", fabricAllowedImageHosts: ["media.example.com"],
  postingLeaseSeconds: 300,
};

describe("Context User hard contracts", () => {
  it("assigns only supplied temporary handles", () => {
    const maps = createHandleMaps(snapshot);
    expect([...maps.temporaryByHandle.keys()]).toEqual(["TEMP_1", "TEMP_2"]);
  });

  it("rejects invented creative IMAGE and TEMP handles", () => {
    const maps = createHandleMaps(snapshot);
    addCandidate(maps, {
      source: "user_asset", width: 10, height: 10, mimeType: "image/jpeg",
      modelDescription: "headshot", pixels: Buffer.from("preview"), sourceBytes: Buffer.from("source"),
      durableSource: {
        source: "user_asset", assetId: "88888888-8888-4888-8888-888888888888",
        storageKey: "social-media-assets/source.jpg",
      },
    });
    const proposal = {
      schemaVersion: "creative-agent-output.v1", concept: "Concept", caption: "Caption",
      selectedImages: [{ imageHandle: "IMAGE_1", role: "hero" }],
      historySummary: "Summary", intendedTemporaryInstructions: ["TEMP_1"],
    };
    expect(() => validateCreativeProposal({
      ...proposal, selectedImages: [{ imageHandle: "IMAGE_99", role: "hero" }],
    }, maps)).toThrow("IMAGE_99");
    expect(() => validateCreativeProposal({
      ...proposal, intendedTemporaryInstructions: ["TEMP_99"],
    }, maps)).toThrow("TEMP_99");
  });

  it("resolves supplied Fabric image handles and rejects unknown handles", () => {
    const valid = validateAndResolveFabric({
      output: { schemaVersion: "direct-fabric-output.v1", slides: [{ displayOrder: 1, fabricJson: { width: 1080, height: 1080, objects: [{ type: "Image", src: "IMAGE_1" }] } }] },
      imageUrls: new Map([["IMAGE_1", "https://media.example.com/source.jpg"]]),
      maxObjects: 10,
      maxBytes: 10_000,
    });
    expect((valid.slides[0].fabricJson.objects as Array<{ src: string }>)[0].src).toBe("https://media.example.com/source.jpg");
    expect((valid.slides[0].fabricJson.objects as Array<{ originX: string }>)[0].originX).toBe("left");
    expect((valid.slides[0].fabricJson.objects as Array<{ originY: string }>)[0].originY).toBe("top");
    expect(() => validateAndResolveFabric({
      output: { schemaVersion: "direct-fabric-output.v1", slides: [{ displayOrder: 1, fabricJson: { width: 1080, height: 1080, objects: [{ type: "Image", src: "IMAGE_99" }] } }] },
      imageUrls: new Map(), maxObjects: 10, maxBytes: 10_000,
    })).toThrow("IMAGE_99");
  });

  it("rejects empty generated and persisted Fabric canvases before critique", () => {
    const output = {
      schemaVersion: "direct-fabric-output.v1" as const,
      slides: [{ displayOrder: 1, fabricJson: {} }],
    } as unknown as DirectFabricOutput;
    expect(() => directFabricOutputSchema.parse(output)).toThrow();
    expect(() => validateAndResolveFabric({
      output, imageUrls: new Map(), maxObjects: 10, maxBytes: 10_000,
    })).toThrow("must explicitly contain positive width and height");
    expect(() => validateResolvedFabric({
      output, maxObjects: 10, maxBytes: 10_000,
    })).toThrow("must explicitly contain positive width and height");
  });

  it("recovers a double-encoded slides array only when the strict Fabric schema passes", () => {
    const llmOutput = JSON.stringify({
      schemaVersion: "direct-fabric-output.v1",
      slides: JSON.stringify([{
        displayOrder: 1,
        fabricJson: {
          width: 1080,
          height: 1080,
          objects: [{ type: "Image", src: "IMAGE_1" }],
        },
      }]),
    });
    expect(recoverDoubleEncodedFabricOutput({ llmOutput })).toMatchObject({
      schemaVersion: "direct-fabric-output.v1",
      slides: [{ displayOrder: 1 }],
    });
    expect(recoverDoubleEncodedFabricOutput({
      llmOutput: JSON.stringify({ schemaVersion: "direct-fabric-output.v1", slides: "[]" }),
    })).toBeNull();
    expect(recoverDoubleEncodedFabricOutput(
      new Error(`Failed to parse. Text: "${llmOutput}". Error: []`),
    )).toMatchObject({
      schemaVersion: "direct-fabric-output.v1",
      slides: [{ displayOrder: 1 }],
    });
    expect(normalizeDirectFabricOutput({
      schemaVersion: "direct-fabric-output.v1",
      slides: JSON.stringify([{
        displayOrder: 1,
        fabricJson: {
          width: 1080,
          height: 1080,
          objects: [{ type: "Rect", width: 1080, height: 1080 }],
        },
      }]),
    })).toMatchObject({ slides: [{ displayOrder: 1 }] });
    expect(recoverDoubleEncodedFabricOutput(Object.assign(
      new Error(`Failed to parse. Text: "${llmOutput}". Error: []`),
      { llmOutput: "not json" },
    ))).toMatchObject({ slides: [{ displayOrder: 1 }] });
  });

  it("accepts Fabric gradients as nested paints but not as canvas objects", () => {
    const gradient = {
      type: "linear",
      gradientUnits: "pixels",
      coords: { x1: 0, y1: 0, x2: 1080, y2: 1080 },
      colorStops: [
        { offset: 0, color: "#ffffff" },
        { offset: 1, color: "#123456" },
      ],
    };
    const valid = validateAndResolveFabric({
      output: {
        schemaVersion: "direct-fabric-output.v1",
        slides: [{
          displayOrder: 1,
          fabricJson: {
            width: 1080,
            height: 1080,
            objects: [{
              type: "Rect",
              width: 1080,
              height: 1080,
              fill: gradient,
            }],
          },
        }],
      },
      imageUrls: new Map(),
      maxObjects: 1,
      maxBytes: 10_000,
    });
    expect(
      ((valid.slides[0].fabricJson.objects as Array<{ fill: unknown }>)[0]).fill,
    ).toEqual(gradient);

    expect(() => validateAndResolveFabric({
      output: {
        schemaVersion: "direct-fabric-output.v1",
        slides: [{
          displayOrder: 1,
          fabricJson: { objects: [gradient] },
        }],
      },
      imageUrls: new Map(),
      maxObjects: 10,
      maxBytes: 10_000,
    })).toThrow("Unsupported Fabric object type linear");
  });

  it("supplies every active temporary to Design AI context", () => {
    const context = designContext({ snapshot, creative, caption: "Visit Saturday", images: [] });
    expect(context.activeTemporaryInstructions).toEqual([
      { handle: "TEMP_1", instruction: "Promote the open house.", imageHandles: [] },
      { handle: "TEMP_2", instruction: "Use a friendly voice this month.", imageHandles: [] },
    ]);
  });

  it("preserves context-to-image meaning through model-facing Design handles", () => {
    const assetId = creative.selectedImages[0].source === "user_asset"
      ? creative.selectedImages[0].assetId
      : "";
    const linkedSnapshot: ContextSnapshot = {
      ...snapshot,
      preferences: [{ ...snapshot.preferences[0], assetRefs: [assetId] }],
      activeTemporaryInstructions: [
        { ...snapshot.activeTemporaryInstructions[0], assetRefs: [assetId] },
        snapshot.activeTemporaryInstructions[1],
      ],
    };
    const context = designContext({
      snapshot: linkedSnapshot,
      creative,
      caption: "Visit Saturday",
      images: [{
        handle: "IMAGE_1", bytes: Buffer.from("preview"), mimeType: "image/jpeg",
        publicUrl: "https://media.example.com/social-media-assets/source.jpg",
        role: "hero", assetId,
      }],
    });
    expect(context.persistentPreferences[0].imageHandles).toEqual(["IMAGE_1"]);
    expect(context.activeTemporaryInstructions[0].imageHandles).toEqual(["IMAGE_1"]);
  });

  it("materializes a selected discovered image under an occurrence-owned deterministic key", async () => {
    const commands: unknown[] = [];
    const client = { send: async (command: unknown) => { commands.push(command); return {}; } } as S3Client;
    const result = await materializeDiscoveredImage({
      client, environment: postingEnvironment,
      postingRunId: "99999999-9999-4999-8999-999999999999",
      provider: "pixabay",
      providerAssetId: "42",
      image: { bytes: Buffer.from("exact-source"), modelBytes: Buffer.from("preview"), mimeType: "image/jpeg", width: 100, height: 100 },
    });
    expect(result.storageKey).toMatch(/^posting-runs\/99999999-9999-4999-8999-999999999999\/discovered-images\/pixabay-42-/);
    expect(commands).toHaveLength(1);
  });

  it("reuses a realtor asset from its stable R2 object without creating a posting-run copy", async () => {
    const commands: Array<{ constructor: { name: string } }> = [];
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    const client = {
      send: async (command: { constructor: { name: string } }) => {
        commands.push(command);
        return { Body: { transformToByteArray: async () => png } };
      },
    } as unknown as S3Client;
    const images = await hydrateSelectedDesignImages({
      creative,
      r2: client,
      postingEnvironment,
      contextEnvironment: {
        creativeModel: "x", designModel: "x", visionModel: "x",
        imageDiscoveryCredentials: { pixabay: "x" },
        imageToolCallLimit: 6, modelTimeoutMs: 1000, imageMaxBytes: 1000,
        modelImageMaxPixels: 1000,
      },
    });
    expect(images[0]).toMatchObject({
      assetId: creative.selectedImages[0].source === "user_asset"
        ? creative.selectedImages[0].assetId
        : null,
      publicUrl: "https://media.example.com/social-media-assets/source.jpg",
    });
    expect(commands.map((command) => command.constructor.name)).toEqual(["GetObjectCommand"]);
  });

  it("enforces six total image-tool calls", async () => {
    const tools = new BoundedImageTools({
      repository: {} as never, r2: {} as never, postingEnvironment,
      contextEnvironment: { creativeModel: "x", designModel: "x", visionModel: "x", imageDiscoveryCredentials: { pixabay: "x" }, imageToolCallLimit: 6, modelTimeoutMs: 1000, imageMaxBytes: 1000, modelImageMaxPixels: 1000 },
      imageDiscovery: { findImages: async () => [] }, profileId: snapshot.ownerProfileId,
      maps: createHandleMaps(snapshot),
    });
    for (let index = 0; index < 6; index += 1) await tools.findImages({ query: "desert home" });
    await expect(tools.findImages({ query: "another" })).rejects.toThrow("six-call");
  });

  it("maps generic discovery inputs to the current backend and validates returned hosts", async () => {
    const requests: URL[] = [];
    const body = (downloadUrl: string) => new Response(JSON.stringify({ hits: [{
      id: 42, imageWidth: 1200, imageHeight: 800,
      pageURL: "https://pixabay.com/photos/desert-home-42/",
      user: "A Photographer", user_id: 77, largeImageURL: downloadUrl,
      tags: "desert, home",
    }] }), { status: 200, headers: { "content-type": "application/json" } });
    const environment = {
      creativeModel: "x", designModel: "x", visionModel: "x",
      imageDiscoveryCredentials: { pixabay: "key" },
      imageToolCallLimit: 6, modelTimeoutMs: 1000, imageMaxBytes: 1000,
      modelImageMaxPixels: 1000,
    };
    const trusted = createImageDiscoveryService(environment, async (request) => {
      requests.push(new URL(String(request)));
      return body("https://cdn.pixabay.com/photo/2026/01/01/home.jpg") as never;
    });
    await expect(trusted.findImages({
      query: "home", orientation: "landscape", maxPhotos: 1,
    })).resolves.toMatchObject([
      {
        provider: "pixabay", providerAssetId: "42",
        downloadUrl: "https://cdn.pixabay.com/photo/2026/01/01/home.jpg",
        creatorName: "A Photographer",
      },
    ]);
    expect(requests[0].origin + requests[0].pathname).toBe("https://pixabay.com/api/");
    expect(requests[0].searchParams.get("key")).toBe("key");
    expect(requests[0].searchParams.get("image_type")).toBe("photo");
    expect(requests[0].searchParams.get("safesearch")).toBe("true");
    expect(requests[0].searchParams.get("orientation")).toBe("horizontal");
    expect(requests[0].searchParams.get("per_page")).toBe("3");

    const untrusted = createImageDiscoveryService(environment, async () =>
      body("https://attacker.example/home.jpeg") as never);
    await expect(untrusted.findImages({ query: "home", maxPhotos: 1 })).rejects.toThrow("untrusted");
  });

  it("gives the critic actual context-linked reference pixels", async () => {
    let messages: unknown;
    const result: VisualCriticResult = {
      schemaVersion: "visual-critic-result.v1", visualStatus: "pass", issues: [], revisionBrief: null,
      temporaryEvaluations: snapshot.activeTemporaryInstructions.map((_, index) => ({
        temporaryHandle: `TEMP_${index + 1}` as `TEMP_${number}`,
        satisfied: false,
        evidence: "Not present in this synthetic render",
      })),
    };
    const model = {
      withStructuredOutput: () => ({
        invoke: async (input: unknown) => { messages = input; return result; },
      }),
    };
    const assetId = "88888888-8888-4888-8888-888888888888";
    await new VisualCritic(model as never).evaluate({
      snapshot: {
        ...snapshot,
        activeTemporaryInstructions: [
          { ...snapshot.activeTemporaryInstructions[0], assetRefs: [assetId] },
          snapshot.activeTemporaryInstructions[1],
        ],
      },
      creative,
      caption: "Visit Saturday",
      renderedSlides: [Buffer.from("render")],
      referenceImages: [{ assetId, bytes: Buffer.from("reference"), mimeType: "image/jpeg" }],
    });
    expect(JSON.stringify(messages)).toContain("REFERENCE_IMAGE_1");
    expect(JSON.stringify(messages)).toContain(Buffer.from("reference").toString("base64"));
  });
});

describe("bounded visual graph", () => {
  it("repairs a persisted empty canvas instead of sending blank pixels to the critic", async () => {
    let repairCalls = 0;
    let criticCalls = 0;
    const result = await runVisualGraph({
      current: {
        schemaVersion: "direct-fabric-output.v1",
        slides: [{ displayOrder: 1, fabricJson: {} }],
      } as unknown as DirectFabricOutput,
      revisionCount: 0,
      needsInitialDesign: false,
      dependencies: {
        snapshot, creative, caption: "Visit Saturday", images: [], referenceImages: [], postingEnvironment,
        designAi: {
          repairInvalid: async (input: { validationError: string }) => {
            repairCalls += 1;
            expect(input.validationError).toContain("positive width and height");
            return {
              schemaVersion: "direct-fabric-output.v1",
              slides: [{ displayOrder: 1, fabricJson: { width: 64, height: 64, objects: [{ type: "Rect", width: 64, height: 64, fill: "#ffffff" }] } }],
            };
          },
        } as never,
        critic: { evaluate: async () => {
          criticCalls += 1;
          return {
            schemaVersion: "visual-critic-result.v1",
            visualStatus: "pass",
            issues: [],
            revisionBrief: null,
            temporaryEvaluations: snapshot.activeTemporaryInstructions.map((_, index) => ({
              temporaryHandle: `TEMP_${index + 1}` as `TEMP_${number}`,
              satisfied: false,
              evidence: "Not present",
            })),
          };
        } } as never,
        persistMedia: async () => undefined,
        persistFinal: async () => undefined,
      },
    });
    expect(repairCalls).toBe(1);
    expect(criticCalls).toBe(1);
    expect(result.qaStatus).toBe("accepted");
  }, 20_000);

  it("repairs deterministic pre-render Fabric failures without consuming a visual revision", async () => {
    let repairCalls = 0;
    const persistedRevisions: number[] = [];
    const result = await runVisualGraph({
      current: null, revisionCount: 0, needsInitialDesign: true,
      dependencies: {
        snapshot, creative, caption: "Visit Saturday", images: [], referenceImages: [], postingEnvironment,
        designAi: {
          create: async () => ({
            schemaVersion: "direct-fabric-output.v1",
            slides: [{ displayOrder: 1, fabricJson: { objects: [{ type: "linear" }] } }],
          }),
          repairInvalid: async (input: { validationError: string }) => {
            repairCalls += 1;
            expect(input.validationError).toContain("$.objects[0]");
            return {
              schemaVersion: "direct-fabric-output.v1",
              slides: [{ displayOrder: 1, fabricJson: { width: 64, height: 64, objects: [{ type: "Rect", width: 64, height: 64, fill: "#ffffff" }] } }],
            };
          },
        } as never,
        critic: { evaluate: async () => ({
          schemaVersion: "visual-critic-result.v1",
          visualStatus: "pass",
          issues: [],
          revisionBrief: null,
          temporaryEvaluations: snapshot.activeTemporaryInstructions.map((_, index) => ({
            temporaryHandle: `TEMP_${index + 1}` as `TEMP_${number}`,
            satisfied: false,
            evidence: "Not present",
          })),
        }) } as never,
        persistMedia: async (_output, count) => { persistedRevisions.push(count); },
        persistFinal: async () => undefined,
      },
    });
    expect(repairCalls).toBe(1);
    expect(result.revisionCount).toBe(0);
    expect(persistedRevisions).toEqual([0]);
  }, 20_000);

  it("invalidates pre-revision satisfaction and persists only the last critic result", async () => {
    const criticResults: VisualCriticResult[] = [
      { schemaVersion: "visual-critic-result.v1", visualStatus: "revise", issues: [{ severity: "major", code: "crop", detail: "Adjust crop" }], revisionBrief: "Adjust crop", temporaryEvaluations: [
        { temporaryHandle: "TEMP_1", satisfied: true, evidence: "Initial wording" },
        { temporaryHandle: "TEMP_2", satisfied: false, evidence: "Initial tone" },
      ] },
      { schemaVersion: "visual-critic-result.v1", visualStatus: "pass", issues: [], revisionBrief: null, temporaryEvaluations: [
        { temporaryHandle: "TEMP_1", satisfied: false, evidence: "Revision removed claim" },
        { temporaryHandle: "TEMP_2", satisfied: true, evidence: "Friendly final tone" },
      ] },
    ];
    const saved: Array<{ status: string; ids: string[] }> = [];
    const persistedRevisions: Array<{ count: number; pending: boolean }> = [];
    const result = await runVisualGraph({
      current: null, revisionCount: 0, needsInitialDesign: true,
      dependencies: {
        snapshot, creative, caption: "Visit Saturday", images: [], referenceImages: [], postingEnvironment,
        designAi: {
          create: async () => ({ schemaVersion: "direct-fabric-output.v1", slides: [{ displayOrder: 1, fabricJson: { width: 64, height: 64, objects: [{ type: "Rect", width: 64, height: 64, fill: "#ffffff" }] } }] }),
          revise: async () => ({ schemaVersion: "direct-fabric-output.v1", slides: [{ displayOrder: 1, fabricJson: { width: 64, height: 64, objects: [{ type: "Rect", width: 64, height: 64, fill: "#eeeeee" }] } }] }),
        } as never,
        critic: { evaluate: async () => criticResults.shift()! } as never,
        persistMedia: async (_output, count, pending) => {
          persistedRevisions.push({ count, pending });
        },
        persistFinal: async (status, satisfaction) => {
          saved.push({ status, ids: satisfaction?.instructionIds ?? [] });
        },
      },
    });
    expect(result.revisionCount).toBe(1);
    expect(persistedRevisions).toEqual([
      { count: 0, pending: false },
      { count: 1, pending: true },
    ]);
    expect(saved).toEqual([{ status: "accepted", ids: [snapshot.activeTemporaryInstructions[1].id] }]);
  }, 20_000);
});
