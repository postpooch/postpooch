import { describe, expect, it } from "vitest";

import {
  normalizePreviewObjectKey,
  requireR2PublicBaseUrl,
  socialTemplatePreviewUrl,
} from "./preview-url";

describe("socialTemplatePreviewUrl", () => {
  it("joins a trimmed base URL with an encoded object key", () => {
    expect(
      socialTemplatePreviewUrl(
        "https://media.example.com/",
        "/templates/previews/just listed.webp",
      ),
    ).toBe("https://media.example.com/templates/previews/just%20listed.webp");
  });

  it("returns null for missing, absolute, or traversing paths", () => {
    const base = "https://media.example.com";
    expect(socialTemplatePreviewUrl(base, "")).toBeNull();
    expect(socialTemplatePreviewUrl(base, "   ")).toBeNull();
    expect(socialTemplatePreviewUrl(base, null)).toBeNull();
    expect(
      socialTemplatePreviewUrl(base, "https://evil.example/steal.webp"),
    ).toBeNull();
    expect(socialTemplatePreviewUrl(base, "//cdn.example/x.webp")).toBeNull();
    expect(socialTemplatePreviewUrl(base, "../secret.webp")).toBeNull();
    expect(socialTemplatePreviewUrl(base, "templates/foo.webp?x=1")).toBeNull();
  });
});

describe("normalizePreviewObjectKey", () => {
  it("strips leading slashes and collapses empty segments", () => {
    expect(normalizePreviewObjectKey("/templates//open-house.webp")).toBe(
      "templates/open-house.webp",
    );
  });
});

describe("requireR2PublicBaseUrl", () => {
  it("returns a trimmed base URL", () => {
    expect(requireR2PublicBaseUrl("  https://media.example.com  ")).toBe(
      "https://media.example.com",
    );
  });

  it("throws when the public base URL is missing", () => {
    expect(() => requireR2PublicBaseUrl(undefined)).toThrow(
      /CLOUDFLARE_R2_PUBLIC_BASE_URL/,
    );
    expect(() => requireR2PublicBaseUrl("   ")).toThrow(
      /CLOUDFLARE_R2_PUBLIC_BASE_URL/,
    );
  });
});
