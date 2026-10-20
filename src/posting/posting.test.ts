import { existsSync } from "node:fs";
import path from "node:path";

import { createCanvas, loadImage } from "canvas";
import type { Pool } from "pg";
import { describe, expect, it } from "vitest";

import type { PostingEnvironment } from "./env";
import { PostingError } from "./errors";
import { renderFabricJpeg } from "./fabric-renderer";
import {
  postPoochFontSource,
  POSTPOOCH_FONT_FAMILIES,
  POSTPOOCH_FONT_SPECS,
} from "./font-catalog";
import {
  occurrenceAtIso,
  requestIdForOccurrence,
  resolveScheduleRowId,
} from "./identity";
import { objectKeyForMedia, publicUrlForKey, sha256 } from "./r2";
import { PostingRepository, validateMedia } from "./repository";
import type { MediaRow, PostingRun, ScheduleRow } from "./types";
import { normalizePlatform } from "./zernio";

const environment: PostingEnvironment = {
  databaseUrl: "postgresql://user:password@db.example.com:5432/postgres",
  zernioApiKey: "secret",
  r2AccountId: "account",
  r2AccessKeyId: "key",
  r2SecretAccessKey: "secret",
  r2Bucket: "bucket",
  r2PublicBaseUrl: "https://media.example.com",
  fabricDefaultWidth: 1080,
  fabricDefaultHeight: 1080,
  fabricMaxJsonBytes: 5_000_000,
  fabricMaxPixels: 16_777_216,
  fabricMaxObjects: 1_000,
  fabricRenderTimeoutMs: 5_000,
  fabricJpegQuality: 0.9,
  fabricJpegBackground: "#ffffff",
  fabricAllowedImageHosts: ["media.example.com"],
  postingLeaseSeconds: 300,
};

function media(id: string, displayOrder: number): MediaRow {
  return {
    id,
    created_at: "2026-07-28T00:00:00.000Z",
    schedule_id: "11111111-1111-4111-8111-111111111111",
    template_id: null,
    post_project_id: null,
    posting_run_id: null,
    display_order: displayOrder,
    image_design: { objects: [] },
  };
}

describe("posting identity", () => {
  it("uses externalId as the database row ID", () => {
    expect(
      resolveScheduleRowId({
        externalId: "11111111-1111-4111-8111-111111111111",
        scheduleId: "sched_123",
      }),
    ).toBe("11111111-1111-4111-8111-111111111111");
  });

  it("creates a stable occurrence request UUID", () => {
    const first = requestIdForOccurrence(
      "11111111-1111-4111-8111-111111111111",
      "2026-07-28T13:00:00.000Z",
    );
    const second = requestIdForOccurrence(
      "11111111-1111-4111-8111-111111111111",
      occurrenceAtIso("2026-07-28T13:00:00Z"),
    );
    expect(first).toBe(second);
    expect(first).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});

describe("media ordering and keys", () => {
  it("sorts media by display_order", () => {
    expect(validateMedia([media("b", 2), media("a", 1)]).map((item) => item.id))
      .toEqual(["a", "b"]);
  });

  it("rejects duplicate display_order values", () => {
    expect(() => validateMedia([media("a", 1), media("b", 1)])).toThrow(
      PostingError,
    );
  });

  it("builds deterministic public R2 URLs", () => {
    const item = media("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", 1);
    const key = objectKeyForMedia({
      scheduleId: item.schedule_id!,
      occurrenceAt: "2026-07-28T13:00:00.000Z",
      media: item,
      contentHash: sha256(Buffer.from("jpeg")),
    });
    expect(publicUrlForKey(environment.r2PublicBaseUrl, key)).toBe(
      `https://media.example.com/${key}`,
    );
  });
});

describe("PostgreSQL repository", () => {
  it("uses a parameterized schedule lookup", async () => {
    const schedule: ScheduleRow = {
      id: "11111111-1111-4111-8111-111111111111",
      created_at: "2026-07-28T00:00:00.000Z",
      profile_id: null,
      delete_after_use: false,
      platform: "instagram",
      platform_account_id: "account",
      uses_template: false,
      text: "Caption",
    };
    const database = {
      query: async (sql: string, values: unknown[]) => {
        expect(sql).toContain("where id = $1::uuid");
        expect(values).toEqual([schedule.id]);
        return { rows: [schedule], rowCount: 1 };
      },
    } as unknown as Pool;

    await expect(new PostingRepository(database).getSchedule(schedule.id))
      .resolves.toEqual(schedule);
  });

  it("locks and persists a random template before loading its media", async () => {
    const templateId = "22222222-2222-4222-8222-222222222222";
    const postingRun: PostingRun = {
      id: "33333333-3333-4333-8333-333333333333",
      schedule_id: "11111111-1111-4111-8111-111111111111",
      occurrence_at: "2026-07-28T13:00:00.000Z",
      trigger_run_id: "run_123",
      status: "processing",
      template_id: null,
      zernio_request_id: "44444444-4444-5444-8444-444444444444",
      zernio_post_id: null,
      media_urls: null,
      acquired: true,
    };
    const calls: string[] = [];
    const client = {
      query: async (sql: string, values?: unknown[]) => {
        const normalized = sql.trim().replace(/\s+/g, " ");
        calls.push(normalized);
        if (normalized === "begin" || normalized === "commit") {
          return { rows: [], rowCount: null };
        }
        if (normalized.includes("select template_id")) {
          expect(normalized).toContain("for update");
          return { rows: [{ template_id: null }], rowCount: 1 };
        }
        if (normalized.includes("floor(random() * count(*))")) {
          return {
            rows: [{
              id: templateId,
              created_at: "2026-07-28T00:00:00.000Z",
              text: "Template caption",
            }],
            rowCount: 1,
          };
        }
        if (normalized.startsWith("update public.posting_runs")) {
          expect(values).toEqual([templateId, postingRun.id]);
          return { rows: [], rowCount: 1 };
        }
        throw new Error(`Unexpected transaction query: ${normalized}`);
      },
      release: () => undefined,
    };
    const database = {
      connect: async () => client,
      query: async (sql: string, values: unknown[]) => {
        expect(sql).toContain("where template_id = $1::uuid");
        expect(values).toEqual([templateId]);
        return { rows: [media("image", 1)], rowCount: 1 };
      },
    } as unknown as Pool;
    const schedule: ScheduleRow = {
      id: postingRun.schedule_id,
      created_at: "2026-07-28T00:00:00.000Z",
      profile_id: null,
      delete_after_use: false,
      platform: "instagram",
      platform_account_id: "account",
      uses_template: true,
      text: null,
    };

    const content = await new PostingRepository(database).getContent(
      schedule,
      postingRun,
    );

    expect(content.templateId).toBe(templateId);
    expect(content.caption).toBe("Template caption");
    expect(calls[0]).toBe("begin");
    expect(calls.at(-1)).toBe("commit");
  });
});

describe("Fabric rendering", () => {
  it("has every catalog font weight available as a static TTF", () => {
    for (const family of POSTPOOCH_FONT_FAMILIES) {
      const spec = POSTPOOCH_FONT_SPECS[family];
      const styles = spec.italic
        ? (["normal", "italic"] as const)
        : (["normal"] as const);
      for (const weight of spec.weights) {
        for (const style of styles) {
          const source = postPoochFontSource(family, weight, style);
          expect(
            existsSync(path.join(process.cwd(), "public", "fonts", source.path)),
            `${family} ${weight} ${style}`,
          ).toBe(true);
        }
      }
    }
  });

  it(
    "renders a Fabric document to a real JPEG",
    async () => {
      const jpeg = await renderFabricJpeg(
        {
          width: 64,
          height: 48,
          objects: [
            {
              type: "Rect",
              left: 0,
              top: 0,
              originX: "left",
              originY: "top",
              width: 64,
              height: 48,
              fill: "#c2410c",
            },
          ],
        },
        environment,
      );

      expect(jpeg.subarray(0, 2)).toEqual(Buffer.from([0xff, 0xd8]));
      const image = await loadImage(jpeg);
      expect(image.width).toBe(64);
      expect(image.height).toBe(48);
      const inspectionCanvas = createCanvas(64, 48);
      const context = inspectionCanvas.getContext("2d");
      context.drawImage(image, 0, 0);
      const bottomRight = context.getImageData(63, 47, 1, 1).data;
      expect(bottomRight[0]).toBeGreaterThan(150);
      expect(bottomRight[1]).toBeLessThan(100);
      expect(bottomRight[2]).toBeLessThan(50);
    },
    20_000,
  );

  it("rejects image hosts outside the allowlist", async () => {
    await expect(
      renderFabricJpeg(
        {
          objects: [
            {
              type: "Image",
              src: "https://untrusted.example/image.jpg",
            },
          ],
        },
        environment,
      ),
    ).rejects.toThrow("FABRIC_ALLOWED_IMAGE_HOSTS");
  });

  it(
    "renders Cormorant Garamond",
    async () => {
      const jpeg = await renderFabricJpeg(
        {
          width: 320,
          height: 100,
          objects: [
            {
              type: "Textbox",
              left: 10,
              top: 10,
              originX: "left",
              originY: "top",
              width: 300,
              text: "Before you save",
              fontFamily: "Cormorant Garamond",
              fontStyle: "italic",
              fontWeight: "600",
              fontSize: 36,
              fill: "#111827",
            },
          ],
        },
        environment,
      );

      expect(jpeg.subarray(0, 2)).toEqual(Buffer.from([0xff, 0xd8]));
    },
    20_000,
  );

  it(
    "renders a bundled design font",
    async () => {
      const jpeg = await renderFabricJpeg(
        {
          width: 320,
          height: 100,
          objects: [
            {
              type: "Textbox",
              left: 10,
              top: 10,
              originX: "left",
              originY: "top",
              width: 300,
              text: "Open House",
              fontFamily: "Poppins",
              fontWeight: "700",
              fontSize: 48,
              fill: "#111827",
            },
          ],
        },
        environment,
      );

      const image = await loadImage(jpeg);
      const inspectionCanvas = createCanvas(320, 100);
      const context = inspectionCanvas.getContext("2d");
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, 320, 100).data;
      let darkPixels = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if (
          pixels[index] < 100 &&
          pixels[index + 1] < 100 &&
          pixels[index + 2] < 100
        ) {
          darkPixels += 1;
        }
      }
      expect(darkPixels).toBeGreaterThan(100);
    },
    20_000,
  );

  it("normalizes common proprietary font aliases", async () => {
    await expect(
      renderFabricJpeg(
        {
          width: 64,
          height: 64,
          objects: [{
            type: "Text",
            text: "Sold",
            fontFamily: "Arial, sans-serif",
          }],
        },
        environment,
      ),
    ).resolves.toBeInstanceOf(Buffer);
  });

  it("normalizes omitted Fabric 7 object origins to left/top", async () => {
    const document = {
      width: 64,
      height: 64,
      objects: [{
        type: "Rect",
        left: 0,
        top: 0,
        width: 32,
        height: 32,
        fill: "#ffffff",
      }],
    };
    await expect(renderFabricJpeg(document, environment)).resolves.toBeInstanceOf(Buffer);
    expect(document.objects[0]).toMatchObject({ originX: "left", originY: "top" });
  });

  it("rejects an unknown font before publishing", async () => {
    await expect(
      renderFabricJpeg(
        {
          objects: [{
            type: "Text",
            text: "Listing",
            fontFamily: "A Font That Does Not Exist",
          }],
        },
        environment,
      ),
    ).rejects.toThrow("Unsupported Fabric font family");
  });

  it(
    "renders grouped objects, gradients, and embedded raster images",
    async () => {
      const sourceCanvas = createCanvas(4, 4);
      sourceCanvas.getContext("2d").fillStyle = "#2563eb";
      sourceCanvas.getContext("2d").fillRect(0, 0, 4, 4);

      await expect(
        renderFabricJpeg(
          {
            width: 96,
            height: 96,
            objects: [
              {
                type: "Rect",
                left: 0,
                top: 0,
                originX: "left",
                originY: "top",
                width: 96,
                height: 96,
                fill: {
                  type: "linear",
                  gradientUnits: "pixels",
                  coords: { x1: 0, y1: 0, x2: 96, y2: 96 },
                  colorStops: [
                    { offset: 0, color: "#ffffff" },
                    { offset: 1, color: "#dbeafe" },
                  ],
                },
              },
              {
                type: "Group",
                left: 16,
                top: 16,
                objects: [
                  {
                    type: "Circle",
                    radius: 16,
                    fill: "#0f172a",
                  },
                  {
                    type: "Image",
                    left: 40,
                    width: 4,
                    height: 4,
                    scaleX: 8,
                    scaleY: 8,
                    src: sourceCanvas.toDataURL("image/png"),
                  },
                ],
              },
            ],
          },
          environment,
        ),
      ).resolves.toBeInstanceOf(Buffer);
    },
    20_000,
  );

  it("rejects unregistered custom Fabric object types", async () => {
    await expect(
      renderFabricJpeg(
        {
          objects: [{
            type: "PostPoochCustomWidget",
          }],
        },
        environment,
      ),
    ).rejects.toThrow("Unsupported Fabric object type");
  });
});

describe("Zernio platform normalization", () => {
  it("maps X and Google Business aliases", () => {
    expect(normalizePlatform("X")).toBe("twitter");
    expect(normalizePlatform("Google Business Profile")).toBe(
      "googlebusiness",
    );
  });

  it("rejects unknown platforms before posting", () => {
    expect(() => normalizePlatform("carrier pigeon")).toThrow(PostingError);
  });
});
