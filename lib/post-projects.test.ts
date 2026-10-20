import { describe, expect, it } from "vitest";

import {
  displayProjectName,
  normalizeProjectName,
  toFabricImageDesign,
  UNTITLED_PROJECT_NAME,
} from "./post-projects";

describe("displayProjectName", () => {
  it("uses a trimmed name and falls back when empty", () => {
    expect(displayProjectName(null)).toBe(UNTITLED_PROJECT_NAME);
    expect(displayProjectName("  ")).toBe(UNTITLED_PROJECT_NAME);
    expect(displayProjectName(" Open house ")).toBe("Open house");
  });
});

describe("normalizeProjectName", () => {
  it("trims, caps length, and stores empty as null", () => {
    expect(normalizeProjectName(12)).toBeNull();
    expect(normalizeProjectName("  ")).toBeNull();
    expect(normalizeProjectName("  Just listed  ")).toBe("Just listed");
    expect(normalizeProjectName("A".repeat(200))).toHaveLength(120);
  });
});

describe("toFabricImageDesign", () => {
  it("strips the legacy projectName field from canvas JSON", () => {
    expect(
      toFabricImageDesign({
        projectName: "Keep this off the canvas",
        width: 1080,
        objects: [],
      }),
    ).toEqual({
      width: 1080,
      objects: [],
    });
  });
});
