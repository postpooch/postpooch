import { describe, expect, it, vi } from "vitest";

import {
  INNER_ASSET_DIRECTORY,
  isAlreadyOnOurR2,
  isBlockedAssetHost,
  rehostFabricImageAssets,
} from "./rehost-fabric-assets";

const PUBLIC_BASE = "https://media.postpooch.example";
const STOCK =
  "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg";
const OURS = `${PUBLIC_BASE}/social_media/template_media/ab/abc.webp`;

describe("isBlockedAssetHost", () => {
  it("blocks loopback, private, and metadata hosts", () => {
    expect(isBlockedAssetHost("localhost")).toBe(true);
    expect(isBlockedAssetHost("127.0.0.1")).toBe(true);
    expect(isBlockedAssetHost("10.0.0.8")).toBe(true);
    expect(isBlockedAssetHost("169.254.169.254")).toBe(true);
    expect(isBlockedAssetHost("metadata.google.internal")).toBe(true);
    expect(isBlockedAssetHost("images.pexels.com")).toBe(false);
  });
});

describe("isAlreadyOnOurR2", () => {
  it("skips assets that already live on the public R2 host", () => {
    expect(isAlreadyOnOurR2(OURS, PUBLIC_BASE)).toBe(true);
    expect(isAlreadyOnOurR2(STOCK, PUBLIC_BASE)).toBe(false);
  });
});

describe("rehostFabricImageAssets", () => {
  it("uploads stock URLs under the inner-assets directory and rewrites src", async () => {
    const fetchImage = vi.fn(async () => Buffer.from("fake-jpeg"));
    const uploadImage = vi.fn(async () => ({
      url: `${PUBLIC_BASE}/${INNER_ASSET_DIRECTORY}/aa/hash.jpg`,
    }));

    const result = await rehostFabricImageAssets({
      publicBaseUrl: PUBLIC_BASE,
      fetchImage,
      uploadImage,
      document: {
        version: "7.4.0",
        objects: [
          { type: "Image", src: STOCK },
          { type: "Image", src: OURS },
          {
            type: "Textbox",
            text: `See ${STOCK} in the caption`,
          },
        ],
      },
    });

    expect(fetchImage).toHaveBeenCalledTimes(2);
    expect(fetchImage).toHaveBeenCalledWith(STOCK);
    expect(fetchImage).toHaveBeenCalledWith(OURS);
    expect(uploadImage).toHaveBeenCalledTimes(1);
    expect(result.replacedCount).toBe(1);
    expect(result.document).toMatchObject({
      objects: [
        {
          type: "Image",
          src: `${PUBLIC_BASE}/${INNER_ASSET_DIRECTORY}/aa/hash.jpg`,
        },
        { type: "Image", src: OURS },
        { type: "Textbox", text: `See ${STOCK} in the caption` },
      ],
    });
    expect(result.firstFetchedImage?.equals(Buffer.from("fake-jpeg"))).toBe(
      true,
    );
    expect(
      result.assetBytes.get(STOCK)?.equals(Buffer.from("fake-jpeg")),
    ).toBe(true);
    expect(
      result.assetBytes
        .get(`${PUBLIC_BASE}/${INNER_ASSET_DIRECTORY}/aa/hash.jpg`)
        ?.equals(Buffer.from("fake-jpeg")),
    ).toBe(true);
  });

  it("reuses a cache so the same stock URL is only uploaded once", async () => {
    const fetchImage = vi.fn(async () => Buffer.from("once"));
    const uploadImage = vi.fn(async () => ({
      url: `${PUBLIC_BASE}/inner/once.jpg`,
    }));
    const cache = new Map<string, string>();

    await rehostFabricImageAssets({
      publicBaseUrl: PUBLIC_BASE,
      fetchImage,
      uploadImage,
      cache,
      document: { objects: [{ type: "Image", src: STOCK }] },
    });
    const second = await rehostFabricImageAssets({
      publicBaseUrl: PUBLIC_BASE,
      fetchImage,
      uploadImage,
      cache,
      document: { objects: [{ type: "Image", src: STOCK }] },
    });

    expect(fetchImage).toHaveBeenCalledTimes(1);
    expect(uploadImage).toHaveBeenCalledTimes(1);
    expect(second.document).toMatchObject({
      objects: [{ src: `${PUBLIC_BASE}/inner/once.jpg` }],
    });
  });

  it("rejects private image hosts", async () => {
    await expect(
      rehostFabricImageAssets({
        publicBaseUrl: PUBLIC_BASE,
        document: {
          objects: [{ type: "Image", src: "http://127.0.0.1/secret.png" }],
        },
      }),
    ).rejects.toMatchObject({
      name: "DummyTemplateError",
      status: 400,
    });
  });
});
