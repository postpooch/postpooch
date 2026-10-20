import { describe, expect, it } from "vitest";

import {
  editorTemplateDisplayName,
  toEditorTemplateCard,
  toEditorTemplateCards,
} from "./catalog";

const baseUrl = "https://media.example.com";

describe("editorTemplateDisplayName", () => {
  it("uses the first caption line and falls back when empty", () => {
    expect(editorTemplateDisplayName(null)).toBe("Template");
    expect(editorTemplateDisplayName("  \nJust listed\nMore")).toBe(
      "Just listed",
    );
    expect(editorTemplateDisplayName("Just listed")).toBe("Just listed");
  });

  it("humanizes a readable preview filename when there is no caption", () => {
    expect(
      editorTemplateDisplayName(
        null,
        "social_media/templete_previews/untitled-social-post.jpg",
      ),
    ).toBe("Untitled social post");
  });

  it("does not use a content-hash filename as the title", () => {
    expect(
      editorTemplateDisplayName(null, "images/ab/abcdef0123456789.webp"),
    ).toBe("Template");
  });

  it("truncates long captions so card titles stay one line", () => {
    const long = "A".repeat(60);
    expect(editorTemplateDisplayName(long)).toBe(`${"A".repeat(47)}…`);
  });
});

describe("toEditorTemplateCard", () => {
  it("builds a gallery DTO from a preview path and omits unsafe rows", () => {
    expect(
      toEditorTemplateCard(
        {
          id: "11111111-1111-4111-8111-111111111111",
          text: "Open house Saturday",
          preview_path: "templates/previews/open-house.webp",
        },
        baseUrl,
      ),
    ).toEqual({
      id: "11111111-1111-4111-8111-111111111111",
      previewUrl:
        "https://media.example.com/templates/previews/open-house.webp",
      name: "Open house Saturday",
      description: "Open house Saturday",
    });

    expect(
      toEditorTemplateCard(
        {
          id: "11111111-1111-4111-8111-111111111111",
          text: null,
          preview_path: "../nope.webp",
        },
        baseUrl,
      ),
    ).toBeNull();
  });

  it("drops rows that cannot be shown and keeps valid ones", () => {
    const cards = toEditorTemplateCards(
      [
        {
          id: "a",
          text: "Kept",
          preview_path: "templates/a.webp",
        },
        {
          id: "b",
          text: "Skipped",
          preview_path: "",
        },
      ],
      baseUrl,
    );

    expect(cards).toHaveLength(1);
    expect(cards[0]?.id).toBe("a");
  });
});
