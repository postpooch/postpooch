import sharp from "sharp";
import { describe, expect, it } from "vitest";

import {
  createNewsletterPreviewWebp,
  NEWSLETTER_PREVIEW_DIRECTORY,
  newsletterPreviewFileStem,
  newsletterPreviewObjectKey,
} from "./newsletter-template";

describe("newsletterPreviewFileStem", () => {
  it("prefers an explicit name, then the file name", () => {
    expect(
      newsletterPreviewFileStem({
        name: "Market Brief",
        fileName: "draft.mjml",
      }),
    ).toBe("market-brief");
    expect(newsletterPreviewFileStem({ fileName: "Open-House.MJML" })).toBe(
      "open-house",
    );
    expect(newsletterPreviewFileStem({})).toBe("newsletter-template");
  });
});

describe("newsletterPreviewObjectKey", () => {
  it("writes WebP files into the newsletter preview directory", () => {
    expect(newsletterPreviewObjectKey("market-brief")).toBe(
      `${NEWSLETTER_PREVIEW_DIRECTORY}/market-brief.webp`,
    );
    expect(newsletterPreviewObjectKey("market-brief", 2)).toBe(
      `${NEWSLETTER_PREVIEW_DIRECTORY}/market-brief-2.webp`,
    );
  });
});

describe("createNewsletterPreviewWebp", () => {
  it("encodes a preview image as WebP", async () => {
    const png = await sharp({
      create: {
        width: 32,
        height: 48,
        channels: 3,
        background: "#0F6E56",
      },
    })
      .png()
      .toBuffer();

    const preview = await createNewsletterPreviewWebp(png);

    expect(preview.webp.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(preview.webp.subarray(8, 12).toString("ascii")).toBe("WEBP");
    expect(preview.width).toBe(32);
    expect(preview.height).toBe(48);
  });
});
