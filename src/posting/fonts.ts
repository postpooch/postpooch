import path from "node:path";

import { registerFont } from "canvas";

import { PostingError } from "./errors";
import {
  postPoochFontSource,
  POSTPOOCH_FONT_FAMILIES,
  POSTPOOCH_FONT_SPECS,
} from "./font-catalog";

type FontFace = {
  file: string;
  family: string;
  weight?: string;
  style?: string;
};

const bundledFontFaces: FontFace[] = POSTPOOCH_FONT_FAMILIES.flatMap(
  (family) => {
    const spec = POSTPOOCH_FONT_SPECS[family];
    const styles = spec.italic
      ? (["normal", "italic"] as const)
      : (["normal"] as const);
    return spec.weights.flatMap((weight) =>
      styles.map((style) => {
        const source = postPoochFontSource(family, weight, style);
        return {
          file: source.path,
          family,
          weight: String(source.weight),
          style: source.style,
        };
      })
    );
  },
);

const compatibilityFontFamilies = [
  "Caladea",
  "Carlito",
  "DejaVu Sans",
  "DejaVu Sans Mono",
  "DejaVu Serif",
  "Liberation Mono",
  "Liberation Sans",
  "Liberation Serif",
  "Noto Color Emoji",
  "Noto Sans",
  "Noto Sans Display",
  "Noto Sans Mono",
  "Noto Serif",
  "Noto Serif Display",
] as const;

const genericFontFamilies = new Map([
  ["sans-serif", "sans-serif"],
  ["serif", "serif"],
  ["monospace", "monospace"],
]);

const supportedFontFamilies = new Map(
  [...POSTPOOCH_FONT_FAMILIES, ...compatibilityFontFamilies].map(
    (family) => [family.toLowerCase(), family],
  ),
);

// These proprietary fonts cannot legally be bundled. Use their closest
// open, metrically compatible alternative so older/imported designs render
// predictably instead of relying on an OS-specific fallback.
const fontAliases = new Map([
  ["arial", "Liberation Sans"],
  ["arial black", "Liberation Sans"],
  ["helvetica", "Liberation Sans"],
  ["helvetica neue", "Liberation Sans"],
  ["times", "Liberation Serif"],
  ["times new roman", "Liberation Serif"],
  ["courier", "Liberation Mono"],
  ["courier new", "Liberation Mono"],
  ["calibri", "Carlito"],
  ["cambria", "Caladea"],
  ["georgia", "Liberation Serif"],
  ["segoe ui", "DejaVu Sans"],
  ["tahoma", "DejaVu Sans"],
  ["trebuchet ms", "DejaVu Sans"],
  ["verdana", "DejaVu Sans"],
]);

const bundledFontFamilies = new Set(
  POSTPOOCH_FONT_FAMILIES.map((family) => family.toLowerCase()),
);
const registeredFontFiles = new Set<string>();

export function ensureBundledFontsRegistered(
  families: ReadonlySet<string>,
): void {
  try {
    for (const face of bundledFontFaces) {
      if (
        !families.has(face.family) ||
        registeredFontFiles.has(face.file)
      ) {
        continue;
      }
      registerFont(path.join(process.cwd(), "public", "fonts", face.file), {
        family: face.family,
        ...(face.weight ? { weight: face.weight } : {}),
        ...(face.style ? { style: face.style } : {}),
      });
      registeredFontFiles.add(face.file);
    }
  } catch (error) {
    throw new PostingError(
      "A bundled PostPooch font could not be registered",
      false,
      { cause: error },
    );
  }
}

function splitFontFamilyList(value: string): string[] {
  const families: string[] = [];
  let current = "";
  let quote: "'" | '"' | undefined;

  for (const character of value) {
    if ((character === "'" || character === '"') && !quote) {
      quote = character;
      continue;
    }
    if (character === quote) {
      quote = undefined;
      continue;
    }
    if (character === "," && !quote) {
      families.push(current);
      current = "";
      continue;
    }
    current += character;
  }

  families.push(current);
  return families.map((family) => family.trim()).filter(Boolean);
}

function normalizedFontFamily(
  value: string,
  usedBundledFamilies: Set<string>,
): string {
  const families = splitFontFamilyList(value);
  if (families.length === 0) {
    throw new PostingError("Fabric fontFamily cannot be empty", false);
  }

  return families.map((family) => {
    const lowerFamily = family.toLowerCase();
    const normalized = supportedFontFamilies.get(lowerFamily) ??
      genericFontFamilies.get(lowerFamily) ??
      fontAliases.get(lowerFamily);

    if (!normalized) {
      throw new PostingError(
        `Unsupported Fabric font family "${family}". Choose a font from the PostPooch font catalog.`,
        false,
      );
    }

    if (bundledFontFamilies.has(normalized.toLowerCase())) {
      usedBundledFamilies.add(normalized);
    }
    return normalized;
  }).join(", ");
}

export function normalizeDocumentFonts(
  value: unknown,
  usedBundledFamilies = new Set<string>(),
): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) {
      normalizeDocumentFonts(item, usedBundledFamilies);
    }
    return usedBundledFamilies;
  }

  if (!value || typeof value !== "object") {
    return usedBundledFamilies;
  }

  const record = value as Record<string, unknown>;
  if ("fontFamily" in record) {
    if (typeof record.fontFamily !== "string") {
      throw new PostingError(
        "Fabric fontFamily must be a string",
        false,
      );
    }
    record.fontFamily = normalizedFontFamily(
      record.fontFamily,
      usedBundledFamilies,
    );
  }

  for (const child of Object.values(record)) {
    normalizeDocumentFonts(child, usedBundledFamilies);
  }
  return usedBundledFamilies;
}
