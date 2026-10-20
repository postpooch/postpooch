import { describe, expect, it } from "vitest";

import { identityColumnsByField, identityRegistry, normalizeIdentityValue } from "@/lib/social-media/context/identity-registry";

describe("identity registry", () => {
  it("is a single validated registry with unique keys and columns", () => {
    expect(new Set(identityRegistry.map((entry) => entry.key)).size).toBe(identityRegistry.length);
    const columns = [...identityColumnsByField.values()];
    expect(new Set(columns).size).toBe(columns.length);
    expect(identityRegistry.find((entry) => entry.key === "markets")?.storage.kind).toBe("relation");
  });

  it("normalizes colors and enforces typed bounds", () => {
    const color = identityRegistry.find((entry) => entry.key === "primary_brand_color")!;
    expect(normalizeIdentityValue(color, "#aabbcc")).toBe("#AABBCC");
    expect(() => normalizeIdentityValue(color, "red")).toThrow();
  });
});
