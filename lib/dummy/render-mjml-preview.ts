import sharp from "sharp";

import {
  collectMjmlImageUrls,
  DummyTemplateError,
  replaceMjmlImageUrls,
} from "./mjml-image-urls";
import { fetchFabricImageBytes } from "./rehost-fabric-assets";

export const MJML_PREVIEW_VIEWPORT_WIDTH = 640;
export const MJML_PREVIEW_MAX_HEIGHT = 1_200;
export const MJML_PREVIEW_DEVICE_SCALE = 2;

/**
 * Inline http(s) / data image URLs so Chromium does not depend on R2 CORS
 * while screenshotting the compiled email.
 */
export async function documentWithInlinedMjmlImages(
  mjml: string,
  assetBytes: ReadonlyMap<string, Buffer> = new Map(),
): Promise<string> {
  const urls = collectMjmlImageUrls(mjml);
  const mapping = new Map<string, string>();

  for (const url of urls) {
    if (url.startsWith("data:")) continue;

    let bytes = assetBytes.get(url);
    if (!bytes) {
      try {
        bytes = await fetchFabricImageBytes(url);
      } catch (error) {
        if (error instanceof DummyTemplateError) throw error;
        throw new DummyTemplateError(
          "Could not load an image while rendering the MJML preview.",
          502,
        );
      }
    }

    try {
      const jpeg = await sharp(bytes, { failOn: "none" })
        .jpeg({ quality: 85 })
        .toBuffer();
      mapping.set(url, `data:image/jpeg;base64,${jpeg.toString("base64")}`);
    } catch {
      throw new DummyTemplateError(
        "Could not decode an MJML image while rendering the preview.",
        400,
      );
    }
  }

  return replaceMjmlImageUrls(mjml, mapping);
}

export async function compileMjmlToHtml(mjml: string): Promise<string> {
  const mjmlModule = await import("mjml");
  const mjml2html =
    typeof mjmlModule.default === "function"
      ? mjmlModule.default
      : (mjmlModule as unknown as (input: string, options?: object) => unknown);

  let result: unknown;
  try {
    result = await Promise.resolve(
      mjml2html(mjml, {
        validationLevel: "soft",
        minify: false,
        keepComments: false,
      }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "MJML compilation failed";
    throw new DummyTemplateError(
      `Could not compile that MJML file. ${message}`,
      400,
    );
  }

  const html =
    result &&
    typeof result === "object" &&
    "html" in result &&
    typeof (result as { html: unknown }).html === "string"
      ? (result as { html: string }).html
      : null;

  if (!html?.trim()) {
    throw new DummyTemplateError(
      "MJML compiled to an empty HTML document.",
      400,
    );
  }

  return html;
}

type ScreenshotHtmlInput = {
  html: string;
  viewportWidth?: number;
  maxHeight?: number;
  deviceScaleFactor?: number;
};

/**
 * Rasterize compiled email HTML with headless Chromium (Playwright).
 * Captures the top of the email at typical desktop-email width.
 */
export async function screenshotEmailHtml(
  input: ScreenshotHtmlInput,
): Promise<Buffer> {
  const viewportWidth = input.viewportWidth ?? MJML_PREVIEW_VIEWPORT_WIDTH;
  const maxHeight = input.maxHeight ?? MJML_PREVIEW_MAX_HEIGHT;
  const deviceScaleFactor =
    input.deviceScaleFactor ?? MJML_PREVIEW_DEVICE_SCALE;

  let chromium: typeof import("playwright").chromium;
  try {
    ({ chromium } = await import("playwright"));
  } catch {
    throw new DummyTemplateError(
      "Playwright is required to screenshot newsletter templates. Run `npx playwright install chromium`.",
      500,
    );
  }

  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--disable-dev-shm-usage", "--no-sandbox"],
    });
    const page = await browser.newPage({
      viewport: { width: viewportWidth, height: maxHeight },
      deviceScaleFactor,
    });

    await page.setContent(input.html, {
      waitUntil: "load",
      timeout: 30_000,
    });

    // Wait for images; ignore failures so missing assets do not hang forever.
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(
        images.map(
          (image) =>
            image.complete ||
            new Promise<void>((resolve) => {
              image.addEventListener("load", () => resolve(), { once: true });
              image.addEventListener("error", () => resolve(), { once: true });
            }),
        ),
      );
    });

    const contentHeight = await page.evaluate(() => {
      const root = document.documentElement;
      const body = document.body;
      return Math.ceil(
        Math.max(
          root?.scrollHeight ?? 0,
          body?.scrollHeight ?? 0,
          root?.clientHeight ?? 0,
        ),
      );
    });

    const clipHeight = Math.max(
      1,
      Math.min(contentHeight || maxHeight, maxHeight),
    );

    const jpeg = await page.screenshot({
      type: "jpeg",
      quality: 88,
      clip: {
        x: 0,
        y: 0,
        width: viewportWidth,
        height: clipHeight,
      },
    });

    const bytes = Buffer.isBuffer(jpeg) ? jpeg : Buffer.from(jpeg);
    if (bytes.byteLength < 32 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
      throw new DummyTemplateError("Could not screenshot that MJML email.", 500);
    }
    return bytes;
  } catch (error) {
    if (error instanceof DummyTemplateError) throw error;
    const message =
      error instanceof Error ? error.message : "Screenshot failed";
    throw new DummyTemplateError(
      `Could not render a preview of that MJML email. ${message}`,
      500,
    );
  } finally {
    await browser?.close().catch(() => undefined);
  }
}

/**
 * Compile MJML → HTML and screenshot the composed email for picker thumbnails.
 */
export async function renderMjmlPreviewJpeg(
  mjml: string,
  assetBytes: ReadonlyMap<string, Buffer> = new Map(),
): Promise<Buffer> {
  const inlined = await documentWithInlinedMjmlImages(mjml, assetBytes);
  const html = await compileMjmlToHtml(inlined);
  return screenshotEmailHtml({ html });
}
