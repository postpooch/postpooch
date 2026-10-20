import { describe, expect, it } from "vitest";
import { z } from "zod";

import { createTemplateRouter } from "./create-template-router";
import { luxuryRouter } from "./luxury/router";
import { LuxurySettingsSchema } from "./luxury/settings";

describe("createTemplateRouter dynamic match", () => {
  const TestContentSchema = z.object({
    contactHeading: z.string(),
  });

  const router = createTemplateRouter({
    settingsSchema: z.object({}),
    routes: [
      {
        path: "/listings/[id]",
        Page: () => null,
        contentSchema: TestContentSchema,
        defaultContent: { contactHeading: "Interested?" },
        previewParams: () => ({ id: "123" }),
      },
      {
        path: "/communities/[slug]/listings/[id]",
        Page: () => null,
        contentSchema: TestContentSchema,
        defaultContent: { contactHeading: "Community listing" },
        previewParams: () => ({ slug: "sun-city", id: "99" }),
      },
    ],
  });

  it("keeps the canonical pattern for dynamic routes", () => {
    expect(router.match(["listings", "123"])).toEqual({
      pattern: "/listings/[id]",
      params: { id: "123" },
      routeIndex: 0,
    });
  });

  it("supports nested dynamic routes", () => {
    expect(
      router.match(["communities", "sun-city", "listings", "99"]),
    ).toEqual({
      pattern: "/communities/[slug]/listings/[id]",
      params: { slug: "sun-city", id: "99" },
      routeIndex: 1,
    });
  });

  it("exposes validated defaults and preview matches to the editor", () => {
    expect(router.editorRoutes).toEqual([
      { path: "/listings/[id]", label: "Listings · Detail" },
      {
        path: "/communities/[slug]/listings/[id]",
        label: "Communities · Detail · Listings · Detail",
      },
    ]);
    expect(router.resolveContent("/listings/[id]", null)).toEqual({
      contactHeading: "Interested?",
    });
    expect(router.editorPreviewMatch("/listings/[id]", {})).toEqual({
      pattern: "/listings/[id]",
      params: { id: "123" },
      routeIndex: 0,
    });
    expect(router.editorPreviewMatch("/communities/[slug]/listings/[id]", {})).toEqual({
      pattern: "/communities/[slug]/listings/[id]",
      params: { slug: "sun-city", id: "99" },
      routeIndex: 1,
    });
  });
});

describe("luxuryRouter.match", () => {
  it("matches the homepage and key static routes", () => {
    expect(luxuryRouter.match(undefined)).toMatchObject({ pattern: "/" });
    expect(luxuryRouter.match(["about"])).toMatchObject({ pattern: "/about" });
    expect(luxuryRouter.match(["exclusive-listings"])).toMatchObject({
      pattern: "/exclusive-listings",
    });
    expect(luxuryRouter.match(["brand-studio"])).toMatchObject({
      pattern: "/brand-studio",
    });
  });

  it("matches dynamic detail routes with params", () => {
    expect(luxuryRouter.match(["properties", "riverfront-modern-estate"])).toEqual(
      {
        pattern: "/properties/[slug]",
        params: { slug: "riverfront-modern-estate" },
        routeIndex: expect.any(Number),
      },
    );
    expect(luxuryRouter.match(["blog", "choosing-the-right-neighborhood"])).toEqual(
      {
        pattern: "/blog/[slug]",
        params: { slug: "choosing-the-right-neighborhood" },
        routeIndex: expect.any(Number),
      },
    );
    expect(
      luxuryRouter.match(["neighborhoods", "lake-district"]),
    ).toMatchObject({
      pattern: "/neighborhoods/[slug]",
      params: { slug: "lake-district" },
    });
    expect(
      luxuryRouter.match(["new-developments", "the-atelier"]),
    ).toMatchObject({
      pattern: "/new-developments/[slug]",
      params: { slug: "the-atelier" },
    });
  });

  it("returns null for unsupported routes", () => {
    expect(luxuryRouter.match(["does-not-exist"])).toBeNull();
  });
});

describe("luxury settings schema", () => {
  it("fills full defaults from an empty settings object", () => {
    const settings = LuxurySettingsSchema.parse({});
    expect(settings.realtor.name).toBe("YOUR NAME");
    expect(settings.brand.colors.accent).toBe("#9b7b50");
    expect(settings.catalog.properties.length).toBeGreaterThan(0);
    expect(settings.catalog.communities[0]?.slug).toBe("downtown");
    expect(settings.navItems[0]?.label).toBe("About");
  });

  it("keeps normalized editor settings valid when the preview validates them again", () => {
    const editorSettings = luxuryRouter.resolveSettings({}) as z.infer<
      typeof LuxurySettingsSchema
    >;

    expect(editorSettings.catalog.properties).toEqual([]);
    expect(() => luxuryRouter.resolveSettings(editorSettings)).not.toThrow();
  });
});
