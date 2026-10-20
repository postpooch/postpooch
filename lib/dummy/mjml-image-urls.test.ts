import { describe, expect, it } from "vitest";

import {
  collectMjmlImageUrls,
  looksLikeMjml,
  replaceMjmlImageUrls,
} from "./mjml-image-urls";

const UNSPLASH =
  "https://images.unsplash.com/photo-1769016760743-eb89fdfdd32e?auto=format&fit=crop&fm=jpg&q=60&w=3000";
const PEXELS =
  "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg";
const LINK = "https://example.com/open-house";

const sampleMjml = `
<mjml>
  <mj-head>
    <mj-style>
      .hero { background-image: url("${UNSPLASH}"); }
    </mj-style>
  </mj-head>
  <mj-body>
    <mj-section background-url="${PEXELS}">
      <mj-column>
        <mj-image src="${UNSPLASH}" alt="Home" />
        <mj-button href="${LINK}">Tour this weekend</mj-button>
        <mj-text>Visit ${PEXELS} in the caption</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

describe("collectMjmlImageUrls", () => {
  it("finds src, background-url, and CSS url(), but not href or caption text", () => {
    expect(collectMjmlImageUrls(sampleMjml)).toEqual([PEXELS, UNSPLASH]);
  });

  it("deduplicates the same asset URL", () => {
    expect(
      collectMjmlImageUrls(`
        <mj-image src="${PEXELS}" />
        <mj-image src="${PEXELS}" />
      `),
    ).toEqual([PEXELS]);
  });

  it("accepts data:image URLs", () => {
    const data = "data:image/png;base64,iVBORw0KGgo=";
    expect(collectMjmlImageUrls(`<mj-image src="${data}" />`)).toEqual([data]);
  });
});

describe("replaceMjmlImageUrls", () => {
  it("rewrites only image attribute and CSS url captures", () => {
    const mapping = new Map([
      [UNSPLASH, "https://cdn.example.com/inner/a.webp"],
      [PEXELS, "https://cdn.example.com/inner/b.jpg"],
    ]);

    const next = replaceMjmlImageUrls(sampleMjml, mapping);

    expect(next).toContain('src="https://cdn.example.com/inner/a.webp"');
    expect(next).toContain(
      'background-url="https://cdn.example.com/inner/b.jpg"',
    );
    expect(next).toContain(
      'background-image: url("https://cdn.example.com/inner/a.webp")',
    );
    expect(next).toContain(`href="${LINK}"`);
    expect(next).toContain(`Visit ${PEXELS} in the caption`);
  });
});

describe("looksLikeMjml", () => {
  it("accepts mjml roots and mj-* fragments", () => {
    expect(looksLikeMjml("<mjml><mj-body /></mjml>")).toBe(true);
    expect(looksLikeMjml("<mj-section><mj-column /></mj-section>")).toBe(true);
    expect(looksLikeMjml('{"version":"7.4.0"}')).toBe(false);
  });
});
