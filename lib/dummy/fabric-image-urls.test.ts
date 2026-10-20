import { describe, expect, it } from "vitest";

import {
  collectFabricImageUrls,
  looksLikeFabricJson,
  replaceFabricImageUrls,
} from "./fabric-image-urls";

const UNSPLASH_SRC =
  "https://images.unsplash.com/photo-1769016760743-eb89fdfdd32e?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000";
const PEXELS_SRC =
  "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg";

const exampleDocument = {
  version: "7.4.0",
  objects: [
    {
      type: "Image",
      src: UNSPLASH_SRC,
      crossOrigin: "anonymous",
      filters: [],
    },
    {
      type: "Rect",
      fill: {
        type: "pattern",
        source: PEXELS_SRC,
        repeat: "no-repeat",
      },
    },
    {
      type: "Textbox",
      text: "Visit https://images.unsplash.com/should-not-rewrite",
      fill: "#FFFFFF",
    },
  ],
  background: "#FFFFFF",
  width: 1080,
  height: 1350,
};

describe("collectFabricImageUrls", () => {
  it("finds Image src and Pattern source, but not URLs in text", () => {
    expect(collectFabricImageUrls(exampleDocument)).toEqual([
      UNSPLASH_SRC,
      PEXELS_SRC,
    ]);
  });

  it("deduplicates the same asset URL", () => {
    expect(
      collectFabricImageUrls({
        objects: [
          { type: "Image", src: UNSPLASH_SRC },
          { type: "Image", src: UNSPLASH_SRC },
        ],
      }),
    ).toEqual([UNSPLASH_SRC]);
  });
});

describe("replaceFabricImageUrls", () => {
  it("rewrites only src and source fields", () => {
    const mapping = new Map([
      [UNSPLASH_SRC, "https://cdn.example.com/inner/a.webp"],
      [PEXELS_SRC, "https://cdn.example.com/inner/b.jpg"],
    ]);

    const next = replaceFabricImageUrls(exampleDocument, mapping);

    expect(next.objects[0]).toMatchObject({
      type: "Image",
      src: "https://cdn.example.com/inner/a.webp",
    });
    expect(next.objects[1]).toMatchObject({
      fill: { source: "https://cdn.example.com/inner/b.jpg" },
    });
    expect(next.objects[2]).toMatchObject({
      text: "Visit https://images.unsplash.com/should-not-rewrite",
    });
  });
});

describe("looksLikeFabricJson", () => {
  it("treats JSON objects as canvas documents and rasters as images", () => {
    expect(looksLikeFabricJson(Buffer.from('{"objects":[]}'))).toBe(true);
    expect(looksLikeFabricJson(Buffer.from("\uFEFF  {\n  \"version\""))).toBe(
      true,
    );
    expect(looksLikeFabricJson(Buffer.from("\x89PNG\r\n"))).toBe(false);
  });
});
