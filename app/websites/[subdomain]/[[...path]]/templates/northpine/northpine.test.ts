import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { NorthpineHomePage } from "./pages/home/home";
import {
  NorthpineHomeContentSchema,
  northpineHomeDefaultContent,
} from "./pages/home/schema";
import { northpineRouter } from "./router";
import { NorthpineSettingsSchema } from "./settings";

describe("northpine template", () => {
  it("parses empty website settings with Northpine defaults", () => {
    const settings = NorthpineSettingsSchema.parse({});
    expect(settings.agent.name).toBe("Avery Hart");
    expect(settings.agent.company).toBe("Northpine Realty");
    expect(settings.brand.bronze).toBe("#9b785b");
    expect(settings.navItems).toHaveLength(8);
    expect(settings.catalog.communities).toHaveLength(12);
    expect(settings.catalog.properties).toHaveLength(6);
    expect(settings.catalog.posts).toHaveLength(3);
    expect(settings.catalog.sellerGuides.length).toBeGreaterThan(0);
    expect(settings.catalog.attractions[0]?.slug).toBe("lake-blue-ridge");
  });

  it("empties legacy catalog properties when resolving settings", () => {
    const settings = northpineRouter.resolveSettings({}) as {
      catalog: { properties: unknown[] };
    };
    expect(settings.catalog.properties).toEqual([]);
  });

  it("matches canonical Northpine routes", () => {
    expect(northpineRouter.match(undefined)?.pattern).toBe("/");
    expect(northpineRouter.match(["about-us"])?.pattern).toBe("/about-us");
    expect(northpineRouter.match(["homes-for-sale-featured"])?.pattern).toBe(
      "/homes-for-sale-featured",
    );
    expect(northpineRouter.match(["property", "cedar-ridge-lodge"])).toEqual({
      pattern: "/property/[slug]",
      params: { slug: "cedar-ridge-lodge" },
      routeIndex: expect.any(Number),
    });
    expect(northpineRouter.match(["community", "blue-ridge"])).toEqual({
      pattern: "/community/[slug]",
      params: { slug: "blue-ridge" },
      routeIndex: expect.any(Number),
    });
    expect(northpineRouter.match(["sellers", "decide-to-sell"])?.pattern).toBe(
      "/sellers/[slug]",
    );
    expect(northpineRouter.match(["category", "blog"])?.pattern).toBe(
      "/category/blog",
    );
    expect(northpineRouter.match(["blog", "mountain-home-market-guide"])?.pattern).toBe(
      "/blog/[slug]",
    );
    expect(northpineRouter.match(["waterfalls"])?.pattern).toBe("/[slug]");
    expect(northpineRouter.match(["missing", "path"])).toBeNull();
  });

  it("does not let the attraction catch-all steal named one-segment routes", () => {
    expect(northpineRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(northpineRouter.match(["sitemap"])?.pattern).toBe("/sitemap");
    expect(northpineRouter.match(["marketing"])?.pattern).toBe("/marketing");
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: NorthpineSettingsSchema,
      routes: [
        {
          path: "/",
          Page: NorthpineHomePage,
          contentSchema: NorthpineHomeContentSchema,
          defaultContent: northpineHomeDefaultContent,
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
          subdomain: "northpine",
          template: "northpine",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });

  it("validates default home content against schema", () => {
    const parsed = NorthpineHomeContentSchema.parse(northpineHomeDefaultContent);
    expect(parsed.heroTitleEmphasis).toBe("in the mountains.");
    expect(parsed.heroCtaHref).toBe("/homes-for-sale-featured");
  });
});
