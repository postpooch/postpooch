import { describe, expect, it } from "vitest";

import {
  compileMjmlToHtml,
  documentWithInlinedMjmlImages,
  renderMjmlPreviewJpeg,
} from "./render-mjml-preview";

const simpleMjml = `
<mjml>
  <mj-body background-color="#f5f5f7">
    <mj-section background-color="#ffffff">
      <mj-column>
        <mj-text font-size="22px" font-weight="700" color="#1d1d1f">
          Market Brief
        </mj-text>
        <mj-text color="#6e6e73">
          A clean monthly wrap for your sphere.
        </mj-text>
        <mj-button background-color="#0F6E56" color="#ffffff" href="https://example.com">
          Read more
        </mj-button>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

describe("compileMjmlToHtml", () => {
  it(
    "compiles a minimal MJML document to HTML",
    async () => {
      const html = await compileMjmlToHtml(simpleMjml);
      expect(html.toLowerCase()).toContain("<!doctype html>");
      expect(html).toContain("Market Brief");
    },
    60_000,
  );
});

describe("documentWithInlinedMjmlImages", () => {
  it("rewrites remote image URLs to data URIs from the asset map", async () => {
    const png = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64",
    );
    const src = "https://images.example.com/house.png";
    const next = await documentWithInlinedMjmlImages(
      `<mj-image src="${src}" />`,
      new Map([[src, png]]),
    );
    expect(next).toMatch(/src="data:image\/jpeg;base64,/);
    expect(next).not.toContain(src);
  });
});

describe("renderMjmlPreviewJpeg", () => {
  it(
    "screenshots compiled MJML to a JPEG buffer",
    async () => {
      const jpeg = await renderMjmlPreviewJpeg(simpleMjml);
      expect(jpeg[0]).toBe(0xff);
      expect(jpeg[1]).toBe(0xd8);
      expect(jpeg.byteLength).toBeGreaterThan(1_000);
    },
    60_000,
  );
});
