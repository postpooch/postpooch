import { classRegistry, StaticCanvas } from "fabric/node";

import type { PostingEnvironment } from "./env";
import { PostingError } from "./errors";
import {
  ensureBundledFontsRegistered,
  normalizeDocumentFonts,
} from "./fonts";
import type { Json } from "./types";

type FabricDocument = Record<string, unknown>;

function parseDocument(imageDesign: Json): FabricDocument {
  let parsed: unknown = imageDesign;
  if (typeof imageDesign === "string") {
    try {
      parsed = JSON.parse(imageDesign);
    } catch (error) {
      throw new PostingError("image_design is not valid JSON", false, {
        cause: error,
      });
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new PostingError(
      "image_design must be a Fabric.js JSON object",
      false,
    );
  }

  return parsed as FabricDocument;
}

function documentSize(
  document: FabricDocument,
  environment: PostingEnvironment,
): { width: number; height: number } {
  const canvasOptions =
    document.canvas &&
    typeof document.canvas === "object" &&
    !Array.isArray(document.canvas)
      ? (document.canvas as Record<string, unknown>)
      : undefined;
  const width = document.width ?? canvasOptions?.width ??
    environment.fabricDefaultWidth;
  const height = document.height ?? canvasOptions?.height ??
    environment.fabricDefaultHeight;

  if (
    typeof width !== "number" ||
    typeof height !== "number" ||
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1
  ) {
    throw new PostingError(
      "Fabric image_design width and height must be positive integers",
      false,
    );
  }

  if (width * height > environment.fabricMaxPixels) {
    throw new PostingError(
      `Fabric canvas has ${width * height} pixels; limit is ${environment.fabricMaxPixels}`,
      false,
    );
  }

  return { width, height };
}

function normalizeObjectOrigins(value: unknown, isObject = false): void {
  if (Array.isArray(value)) {
    for (const item of value) normalizeObjectOrigins(item, isObject);
    return;
  }
  if (!value || typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  if (isObject && typeof record.type === "string") {
    if (record.originX === undefined) record.originX = "left";
    if (record.originY === undefined) record.originY = "top";
  }

  for (const [key, child] of Object.entries(record)) {
    if (key === "objects" && Array.isArray(child)) {
      normalizeObjectOrigins(child, true);
    } else if (key === "clipPath") {
      normalizeObjectOrigins(child, true);
    } else {
      normalizeObjectOrigins(child, false);
    }
  }
}

function inspectDocument(
  value: unknown,
  allowedHosts: Set<string>,
  counters: { objects: number },
): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      inspectDocument(item, allowedHosts, counters);
    }
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;
  if (typeof record.type === "string") {
    try {
      classRegistry.getClass(record.type);
    } catch (error) {
      throw new PostingError(
        `Unsupported Fabric object type "${record.type}". Use a built-in Fabric.js type or register the class in the worker.`,
        false,
        { cause: error },
      );
    }
    counters.objects += 1;
  }

  for (const [key, child] of Object.entries(record)) {
    if (
      (key === "src" ||
        (key === "source" &&
          typeof child === "string" &&
          /^(?:https?:|data:)/i.test(child))) &&
      typeof child === "string"
    ) {
      validateAssetUrl(child, allowedHosts);
    } else {
      inspectDocument(child, allowedHosts, counters);
    }
  }
}

function validateAssetUrl(src: string, allowedHosts: Set<string>): void {
  if (/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(src)) {
    return;
  }
  if (src.startsWith("data:")) {
    throw new PostingError(
      "Fabric inline images must be base64 PNG, JPEG, WebP, or GIF data URLs",
      false,
    );
  }

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    throw new PostingError(
      "Fabric image assets must use HTTPS or data:image URLs",
      false,
    );
  }

  if (url.protocol !== "https:") {
    throw new PostingError(
      `Fabric image asset protocol ${url.protocol} is not allowed`,
      false,
    );
  }
  if (!allowedHosts.has(url.hostname.toLowerCase())) {
    throw new PostingError(
      `Fabric image asset host ${url.hostname} is not allowed; add it to FABRIC_ALLOWED_IMAGE_HOSTS`,
      false,
    );
  }
}

export async function renderFabricJpeg(
  imageDesign: Json,
  environment: PostingEnvironment,
): Promise<Buffer> {
  const document = parseDocument(imageDesign);
  // Backward-compatible guard for persisted AI documents created before the
  // Context User made Fabric 7's center-origin default explicit.
  normalizeObjectOrigins(document);
  const usedBundledFonts = normalizeDocumentFonts(document);
  ensureBundledFontsRegistered(usedBundledFonts);
  const serialized = JSON.stringify(document);
  const byteLength = Buffer.byteLength(serialized, "utf8");
  if (byteLength > environment.fabricMaxJsonBytes) {
    throw new PostingError(
      `Fabric image_design is ${byteLength} bytes; limit is ${environment.fabricMaxJsonBytes}`,
      false,
    );
  }

  const counters = { objects: 0 };
  inspectDocument(
    document,
    new Set(environment.fabricAllowedImageHosts),
    counters,
  );
  if (counters.objects > environment.fabricMaxObjects) {
    throw new PostingError(
      `Fabric image_design has ${counters.objects} objects; limit is ${environment.fabricMaxObjects}`,
      false,
    );
  }

  const { width, height } = documentSize(document, environment);
  const canvas = new StaticCanvas(undefined, {
    width,
    height,
    enableRetinaScaling: false,
    renderOnAddRemove: false,
  });
  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    environment.fabricRenderTimeoutMs,
  );

  try {
    await canvas.loadFromJSON(document, undefined, {
      signal: abortController.signal,
    });
    if (
      document.background === undefined &&
      document.backgroundColor === undefined
    ) {
      canvas.backgroundColor = environment.fabricJpegBackground;
    }
    canvas.renderAll();

    return canvas.getNodeCanvas().toBuffer("image/jpeg", {
      quality: environment.fabricJpegQuality,
      progressive: true,
      chromaSubsampling: true,
    });
  } catch (error) {
    if (abortController.signal.aborted) {
      throw new PostingError(
        `Fabric rendering exceeded ${environment.fabricRenderTimeoutMs}ms`,
        true,
        { cause: error },
      );
    }
    if (error instanceof PostingError) {
      throw error;
    }
    throw new PostingError("Fabric image rendering failed", false, {
      cause: error,
    });
  } finally {
    clearTimeout(timeout);
    await canvas.dispose();
  }
}
