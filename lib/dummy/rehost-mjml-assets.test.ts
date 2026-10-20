import { describe, expect, it, vi } from "vitest";

import {
  NEWSLETTER_INNER_ASSET_DIRECTORY,
  rehostMjmlImageAssets,
} from "./rehost-mjml-assets";
import { isAlreadyOnOurR2 } from "./rehost-fabric-assets";

const PUBLIC_BASE = "https://media.postpooch.example";
const STOCK =
  "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg";
const OURS = `${PUBLIC_BASE}/newsletter/template_previews/ab/abc.webp`;

describe("rehostMjmlImageAssets", () => {
  it("uploads stock URLs under the newsletter inner-assets directory and rewrites src", async () => {
    const fetchImage = vi.fn(async () => Buffer.from("fake-jpeg"));
    const uploadImage = vi.fn(async () => ({
      url: `${PUBLIC_BASE}/${NEWSLETTER_INNER_ASSET_DIRECTORY}/aa/hash.jpg`,
    }));

    const result = await rehostMjmlImageAssets({
      publicBaseUrl: PUBLIC_BASE,
      fetchImage,
      uploadImage,
      mjml: `
        <mjml>
          <mj-body>
            <mj-image src="${STOCK}" />
            <mj-image src="${OURS}" />
            <mj-text>See ${STOCK} in the caption</mj-text>
          </mj-body>
        </mjml>
      `,
    });

    expect(isAlreadyOnOurR2(OURS, PUBLIC_BASE)).toBe(true);
    expect(fetchImage).toHaveBeenCalledTimes(2);
    expect(fetchImage).toHaveBeenCalledWith(STOCK);
    expect(fetchImage).toHaveBeenCalledWith(OURS);
    expect(uploadImage).toHaveBeenCalledTimes(1);
    expect(result.replacedCount).toBe(1);
    expect(result.mjml).toContain(
      `src="${PUBLIC_BASE}/${NEWSLETTER_INNER_ASSET_DIRECTORY}/aa/hash.jpg"`,
    );
    expect(result.mjml).toContain(`src="${OURS}"`);
    expect(result.mjml).toContain(`See ${STOCK} in the caption`);
    expect(result.firstFetchedImage?.equals(Buffer.from("fake-jpeg"))).toBe(
      true,
    );
  });
});
