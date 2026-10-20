/**
 * Match a visitor path (URL segments) against a template route pattern.
 *
 * Examples:
 *   matchRoute(undefined, "/")                         → {}
 *   matchRoute(["about"], "/about")                    → {}
 *   matchRoute(["listings", "123"], "/listings/[id]")  → { id: "123" }
 *   matchRoute(["team"], "/about")                     → null
 */
export function matchRoute(
  path: string[] | undefined,
  pattern: string,
): Record<string, string> | null {
  const segments = path ?? [];
  const patternSegments = splitPattern(pattern);

  if (segments.length !== patternSegments.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const expected = patternSegments[i]!;
    const actual = segments[i]!;

    if (expected.startsWith("[") && expected.endsWith("]")) {
      const key = expected.slice(1, -1);
      if (!key) return null;
      params[key] = actual;
      continue;
    }

    if (expected !== actual) {
      return null;
    }
  }

  return params;
}

function splitPattern(pattern: string): string[] {
  const trimmed = pattern.trim();
  if (trimmed === "/" || trimmed === "") return [];
  return trimmed.replace(/^\//, "").replace(/\/$/, "").split("/").filter(Boolean);
}
