import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { AtelierHomePage } from "./pages/home/home";
import {
  AtelierHomeContentSchema,
  atelierHomeDefaultContent,
} from "./pages/home/schema";
import { atelierRouter } from "./router";
import { AtelierSettingsSchema } from "./settings";

describe("atelier template", () => {
  it("parses empty website settings with Atelier defaults", () => {
    const settings = AtelierSettingsSchema.parse({});
    expect(settings.agent.name).toBe("Elena Marlowe");
    expect(settings.brand.wordmarkTop).toBe("ATELIER");
    expect(settings.brand.colors.ink).toBe("#11110f");
    expect(settings.navItems).toHaveLength(5);
    expect(settings.catalog.communities).toHaveLength(6);
    expect(settings.catalog.properties).toHaveLength(6);
    expect(settings.catalog.posts).toHaveLength(6);
    expect(settings.catalog.developments[0]?.slug).toBe("the-residences-at-olive");
  });

  it("empties legacy catalog properties when resolving settings", () => {
    const settings = atelierRouter.resolveSettings({}) as {
      catalog: { properties: unknown[] };
    };
    expect(settings.catalog.properties).toEqual([]);
  });

  it("matches canonical Atelier routes and skips reserved sitemap/robots paths", () => {
    expect(atelierRouter.match(undefined)?.pattern).toBe("/");
    expect(atelierRouter.match(["about"])?.pattern).toBe("/about");
    expect(atelierRouter.match(["properties"])?.pattern).toBe("/properties");
    expect(atelierRouter.match(["properties", "lakefront-pavilion"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "lakefront-pavilion" },
      routeIndex: expect.any(Number),
    });
    expect(atelierRouter.match(["communities", "lake-austin"])).toEqual({
      pattern: "/communities/[slug]",
      params: { slug: "lake-austin" },
      routeIndex: expect.any(Number),
    });
    expect(atelierRouter.match(["journal", "the-art-of-quiet-luxury"])?.pattern).toBe(
      "/journal/[slug]",
    );
    expect(atelierRouter.match(["search"])?.pattern).toBe("/search");
    expect(atelierRouter.match(["sitemap"])).toBeNull();
    expect(atelierRouter.match(["sitemap.xml"])).toBeNull();
    expect(atelierRouter.match(["robots.txt"])).toBeNull();
    expect(atelierRouter.match(["missing", "path"])).toBeNull();
  });

  it("marks listing routes as property routes", () => {
    expect(atelierRouter.isPropertyRoute("/properties")).toBe(true);
    expect(atelierRouter.isPropertyRoute("/properties/[slug]")).toBe(true);
    expect(atelierRouter.isPropertyRoute("/sales")).toBe(true);
    expect(atelierRouter.isPropertyRoute("/search")).toBe(true);
    expect(atelierRouter.isPropertyRoute("/about")).toBe(false);
    expect(atelierRouter.isPropertyRoute("/communities")).toBe(false);
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: AtelierSettingsSchema,
      routes: [
        {
          path: "/",
          Page: AtelierHomePage,
          contentSchema: AtelierHomeContentSchema,
          defaultContent: atelierHomeDefaultContent,
        },
      ],
    });

    const match = router.match(undefined);
    expect(match).not.toBeNull();

    expect(() =>
      router.render({
        match: match!,
        site: {
          id: "test-website",
          profileId: "test-profile",
          subdomain: "atelier",
          template: "atelier",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });

  it("validates default home content against schema", () => {
    const parsed = AtelierHomeContentSchema.parse(atelierHomeDefaultContent);
    expect(parsed.collectionCta).toBe("Explore all properties");
    expect(parsed.introTitleEmphasis).toBe("attention, clarity,");
  });
});
