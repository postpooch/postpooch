import { POSTPOOCH_FONT_FAMILIES } from "../posting/font-catalog";
import { PostingError } from "../posting/errors";
import type { DirectFabricOutput } from "./contracts";

const ALLOWED_TYPES = new Set([
  "Rect", "Circle", "Ellipse", "Triangle", "Line", "Polyline", "Polygon",
  "Path", "Text", "IText", "Textbox", "Image", "Group", "ActiveSelection",
]);
const ALLOWED_PAINT_TYPES = new Set(["linear", "radial", "pattern"]);
const PAINT_PROPERTIES = new Set([
  "fill",
  "stroke",
  "background",
  "backgroundColor",
  "overlay",
  "overlayColor",
]);
const ALLOWED_FONTS = new Set<string>(POSTPOOCH_FONT_FAMILIES);

function assertCanvasShape(
  value: Record<string, unknown>,
  path: string,
): asserts value is Record<string, unknown> & { width: number; height: number; objects: unknown[] } {
  if (typeof value.width !== "number" || !Number.isFinite(value.width) || value.width <= 0 ||
      typeof value.height !== "number" || !Number.isFinite(value.height) || value.height <= 0) {
    throw new PostingError(`${path} must explicitly contain positive width and height`, false);
  }
  if (!Array.isArray(value.objects) || value.objects.length === 0) {
    throw new PostingError(`${path}.objects must be a non-empty array`, false);
  }
}

function visit(
  value: unknown,
  imageUrls: ReadonlyMap<string, string>,
  counters: { objects: number; depth: number },
  depth: number,
  parentKey?: string,
  path = "$",
): unknown {
  if (depth > 30) throw new PostingError("Fabric JSON exceeds maximum nesting depth", false);
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      visit(item, imageUrls, counters, depth + 1, parentKey, `${path}[${index}]`));
  }
  if (!value || typeof value !== "object") {
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new PostingError("Fabric JSON contains a non-finite number", false);
    }
    return value;
  }
  const record = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  let isCanvasObject = false;
  if (typeof record.type === "string") {
    if (ALLOWED_TYPES.has(record.type)) {
      isCanvasObject = true;
      counters.objects += 1;
    } else if (
      PAINT_PROPERTIES.has(parentKey ?? "") &&
      ALLOWED_PAINT_TYPES.has(record.type)
    ) {
      // Fabric serializes gradients and patterns as typed resources nested in
      // paint properties. They are not canvas objects and should not count
      // toward the object limit.
    } else {
      throw new PostingError(
        `Unsupported Fabric object type ${record.type} at ${path}`,
        false,
      );
    }
  }
  if (typeof record.fontFamily === "string" && !ALLOWED_FONTS.has(record.fontFamily)) {
    throw new PostingError(`Unsupported Fabric font family ${record.fontFamily}`, false);
  }
  for (const [key, child] of Object.entries(record)) {
    if (key === "src" && typeof child === "string") {
      const resolved = imageUrls.get(child);
      if (!resolved) {
        throw new PostingError(
          `Unknown or unsafe Fabric image handle ${child} at ${path}.${key}`,
          false,
        );
      }
      output[key] = resolved;
    } else {
      output[key] = visit(
        child,
        imageUrls,
        counters,
        depth + 1,
        key,
        `${path}.${key}`,
      );
    }
  }
  // Fabric 7 defaults object origins to center. Model-authored documents
  // commonly express left/top coordinates and historically omitted these
  // fields, so make that coordinate convention explicit before persistence.
  // An explicitly requested center/right/bottom origin remains untouched.
  if (isCanvasObject) {
    if (output.originX === undefined) output.originX = "left";
    if (output.originY === undefined) output.originY = "top";
  }
  return output;
}

export function validateAndResolveFabric(input: {
  output: DirectFabricOutput;
  imageUrls: ReadonlyMap<string, string>;
  maxObjects: number;
  maxBytes: number;
}): DirectFabricOutput {
  const orders = new Set<number>();
  const slides = input.output.slides.map((slide) => {
    if (orders.has(slide.displayOrder)) throw new PostingError("Fabric slides have duplicate display order", false);
    orders.add(slide.displayOrder);
    const counters = { objects: 0, depth: 0 };
    const fabricJson = visit(slide.fabricJson, input.imageUrls, counters, 0) as Record<string, unknown>;
    assertCanvasShape(fabricJson, `$.slides[displayOrder=${slide.displayOrder}].fabricJson`);
    if (counters.objects > input.maxObjects) throw new PostingError("Fabric output exceeds object limit", false);
    if (Buffer.byteLength(JSON.stringify(fabricJson)) > input.maxBytes) {
      throw new PostingError("Fabric output exceeds JSON byte limit", false);
    }
    return { displayOrder: slide.displayOrder, fabricJson };
  }).sort((a, b) => a.displayOrder - b.displayOrder);
  return { schemaVersion: "direct-fabric-output.v1", slides };
}

function inspectResolved(
  value: unknown,
  counters: { objects: number },
  depth: number,
  parentKey?: string,
  path = "$",
): void {
  if (depth > 30) throw new PostingError("Fabric JSON exceeds maximum nesting depth", false);
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectResolved(item, counters, depth + 1, parentKey, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") {
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new PostingError("Fabric JSON contains a non-finite number", false);
    }
    return;
  }
  const record = value as Record<string, unknown>;
  if (typeof record.type === "string") {
    if (ALLOWED_TYPES.has(record.type)) {
      counters.objects += 1;
    } else if (!(PAINT_PROPERTIES.has(parentKey ?? "") && ALLOWED_PAINT_TYPES.has(record.type))) {
      throw new PostingError(`Unsupported Fabric object type ${record.type} at ${path}`, false);
    }
  }
  if (typeof record.fontFamily === "string" && !ALLOWED_FONTS.has(record.fontFamily)) {
    throw new PostingError(`Unsupported Fabric font family ${record.fontFamily}`, false);
  }
  for (const [key, child] of Object.entries(record)) {
    inspectResolved(child, counters, depth + 1, key, `${path}.${key}`);
  }
}

export function validateResolvedFabric(input: {
  output: DirectFabricOutput;
  maxObjects: number;
  maxBytes: number;
}): DirectFabricOutput {
  const orders = new Set<number>();
  const slides = input.output.slides.map((slide) => {
    if (orders.has(slide.displayOrder)) throw new PostingError("Fabric slides have duplicate display order", false);
    orders.add(slide.displayOrder);
    assertCanvasShape(slide.fabricJson, `$.slides[displayOrder=${slide.displayOrder}].fabricJson`);
    const counters = { objects: 0 };
    inspectResolved(slide.fabricJson, counters, 0);
    if (counters.objects > input.maxObjects) throw new PostingError("Fabric output exceeds object limit", false);
    if (Buffer.byteLength(JSON.stringify(slide.fabricJson)) > input.maxBytes) {
      throw new PostingError("Fabric output exceeds JSON byte limit", false);
    }
    return slide;
  }).sort((a, b) => a.displayOrder - b.displayOrder);
  return { schemaVersion: "direct-fabric-output.v1", slides };
}
