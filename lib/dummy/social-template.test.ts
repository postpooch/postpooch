import { createCanvas, loadImage } from "canvas";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { DummyTemplateError } from "./fabric-image-urls";
import {
  createTemplateImageDesign,
  createTemplatePreviewWebp,
  MAX_TEMPLATE_IMAGES,
  previewFileStem,
  previewObjectKey,
  renderSeededFabricPreview,
  TEMPLATE_PREVIEW_DIRECTORY,
} from "./social-template";

describe("previewFileStem", () => {
  it("prefers an explicit name, then caption, then the file name", () => {
    expect(
      previewFileStem({
        name: "Just Listed",
        caption: "Open house",
        fileName: "shot.png",
      }),
    ).toBe("just-listed");
    expect(previewFileStem({ caption: "Open house Saturday" })).toBe(
      "open-house-saturday",
    );
    expect(previewFileStem({ fileName: "Harbor-View.JPG" })).toBe(
      "harbor-view",
    );
    expect(previewFileStem({})).toBe("template");
  });
});

describe("previewObjectKey", () => {
  it("writes WebP files into the documented preview directory", () => {
    expect(previewObjectKey("just-listed")).toBe(
      `${TEMPLATE_PREVIEW_DIRECTORY}/just-listed.webp`,
    );
    expect(previewObjectKey("just-listed", 2)).toBe(
      `${TEMPLATE_PREVIEW_DIRECTORY}/just-listed-2.webp`,
    );
  });
});

describe("createTemplateImageDesign", () => {
  it("builds a Fabric document that fills the canvas with the uploaded image", () => {
    const design = createTemplateImageDesign({
      src: "https://media.example.com/slide.webp",
      width: 1080,
      height: 1920,
    });

    expect(design).toMatchObject({
      width: 1080,
      height: 1920,
      background: "#FFFFFF",
      objects: [
        {
          type: "Image",
          src: "https://media.example.com/slide.webp",
          crossOrigin: "anonymous",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          scaleX: 1,
          scaleY: 1,
        },
      ],
    });
  });
});

describe("createTemplatePreviewWebp", () => {
  it("encodes the first frame as WebP", async () => {
    const png = await sharp({
      create: {
        width: 32,
        height: 48,
        channels: 3,
        background: "#c2410c",
      },
    })
      .png()
      .toBuffer();

    const preview = await createTemplatePreviewWebp(png);

    expect(preview.webp.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(preview.webp.subarray(8, 12).toString("ascii")).toBe("WEBP");
    expect(preview.width).toBe(32);
    expect(preview.height).toBe(48);
  });
});

describe("template limits", () => {
  it("keeps reel templates within the editor slide cap", () => {
    expect(MAX_TEMPLATE_IMAGES).toBe(10);
  });
});

describe("renderSeededFabricPreview", () => {
  const composed = {
    version: "7.4.0",
    width: 160,
    height: 120,
    background: "#16a34a",
    objects: [
      {
        type: "Rect",
        originX: "left",
        originY: "top",
        left: 0,
        top: 0,
        width: 160,
        height: 120,
        fill: "#16a34a",
      },
      {
        type: "Textbox",
        originX: "left",
        originY: "top",
        left: 12,
        top: 40,
        width: 140,
        text: "NOTE",
        fontFamily: "Arial",
        fontWeight: "700",
        fontSize: 36,
        fill: "#111827",
      },
    ],
  };

  it(
    "snapshots the composed canvas, not just the background fill",
    async () => {
      const preview = await renderSeededFabricPreview(
        composed,
        "https://media.example.com",
      );

      expect(preview.subarray(0, 2)).toEqual(Buffer.from([0xff, 0xd8]));

      const image = await loadImage(preview);
      const inspection = createCanvas(160, 120);
      const context = inspection.getContext("2d");
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, 160, 120).data;
      let darkPixels = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if (
          pixels[index] < 80 &&
          pixels[index + 1] < 80 &&
          pixels[index + 2] < 80
        ) {
          darkPixels += 1;
        }
      }
      expect(darkPixels).toBeGreaterThan(80);

      const webp = await createTemplatePreviewWebp(preview);
      expect(webp.webp.subarray(8, 12).toString("ascii")).toBe("WEBP");
    },
    60_000,
  );

  it(
    "does not rewrite fonts on the stored Fabric document",
    async () => {
      const document = structuredClone(composed);
      await renderSeededFabricPreview(document, "https://media.example.com");
      expect(document.objects[1]).toMatchObject({ fontFamily: "Arial" });
    },
    60_000,
  );

  it(
    "paints rehosted Image src from downloaded bytes, not a black fill",
    async () => {
      const house = await sharp({
        create: {
          width: 64,
          height: 48,
          channels: 3,
          background: "#2563eb",
        },
      })
        .jpeg()
        .toBuffer();
      const src =
        "https://media.example.com/postpooch-images/social_media/media_inner_assets/aa/house.jpg";

      const preview = await renderSeededFabricPreview(
        {
          width: 64,
          height: 48,
          background: "#1A1A18",
          objects: [
            {
              type: "Image",
              originX: "left",
              originY: "top",
              left: 0,
              top: 0,
              width: 64,
              height: 48,
              scaleX: 1,
              scaleY: 1,
              src,
              crossOrigin: "anonymous",
            },
          ],
        },
        "https://media.example.com",
        new Map([[src, house]]),
      );

      const image = await loadImage(preview);
      const inspection = createCanvas(64, 48);
      const context = inspection.getContext("2d");
      context.drawImage(image, 0, 0);
      const pixel = context.getImageData(32, 24, 1, 1).data;
      expect(pixel[2]).toBeGreaterThan(150);
      expect(pixel[0]).toBeLessThan(80);
    },
    60_000,
  );

  it("surfaces renderer failures as DummyTemplateError", async () => {
    await expect(
      renderSeededFabricPreview(
        {
          width: 64,
          height: 64,
          objects: [
            {
              type: "Image",
              src: "https://images.unsplash.com/photo.jpg",
            },
          ],
        },
        "https://media.example.com",
      ),
    ).rejects.toBeInstanceOf(DummyTemplateError);
  });
});
