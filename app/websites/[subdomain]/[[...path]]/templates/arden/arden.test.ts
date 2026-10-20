import { describe, expect, it } from "vitest";

import { WEBSITE_TEMPLATES } from "@/app/websites/website-templates";

import { createTemplateRouter } from "../create-template-router";
import { TEMPLATE_REGISTRY } from "../registry";
import { ArdenHomePage } from "./pages/home/home";
import {
  ArdenHomeContentSchema,
  ardenHomeDefaultContent,
} from "./pages/home/schema";
import { ardenRouter } from "./router";
import { ArdenSettingsSchema } from "./settings";

describe("arden template", () => {
  it("parses empty website settings with Arden defaults", () => {
    const settings = ArdenSettingsSchema.parse({});
    expect(settings.brand.name).toBe("Arden Vale + Co");
    expect(settings.brand.shortName).toBe("Arden Vale");
    expect(settings.colors.sage).toBe("#72796a");
    expect(settings.navItems).toHaveLength(6);
    expect(settings.catalog.properties).toHaveLength(6);
    expect(settings.catalog.agents).toHaveLength(3);
    expect(settings.catalog.neighborhoods).toHaveLength(9);
    expect(settings.catalog.posts).toHaveLength(4);
    expect(settings.catalog.agents[0]?.slug).toBe("alexandra-vale");
  });

  it("empties legacy catalog properties when resolving settings", () => {
    const settings = ardenRouter.resolveSettings({}) as {
      catalog: { properties: unknown[] };
    };
    expect(settings.catalog.properties).toEqual([]);
  });

  it("matches canonical Arden routes", () => {
    expect(ardenRouter.match(undefined)?.pattern).toBe("/");
    expect(ardenRouter.match(["about"])?.pattern).toBe("/about");
    expect(ardenRouter.match(["the-brokerage"])?.pattern).toBe("/the-brokerage");
    expect(ardenRouter.match(["properties", "sale"])?.pattern).toBe(
      "/properties/sale",
    );
    expect(ardenRouter.match(["properties", "leases"])?.pattern).toBe(
      "/properties/leases",
    );
    expect(ardenRouter.match(["properties", "glass-house-overlook"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "glass-house-overlook" },
      routeIndex: expect.any(Number),
    });
    expect(ardenRouter.match(["agents", "alexandra-vale"])).toEqual({
      pattern: "/agents/[slug]",
      params: { slug: "alexandra-vale" },
      routeIndex: expect.any(Number),
    });
    expect(ardenRouter.match(["neighborhoods", "st-helena"])).toEqual({
      pattern: "/neighborhoods/[slug]",
      params: { slug: "st-helena" },
      routeIndex: expect.any(Number),
    });
    expect(ardenRouter.match(["blog", "buying-a-wine-country-home"])?.pattern).toBe(
      "/blog/[slug]",
    );
    expect(ardenRouter.match(["napa-valley-real-estate"])?.pattern).toBe(
      "/napa-valley-real-estate",
    );
    expect(ardenRouter.match(["home-search", "listings"])?.pattern).toBe(
      "/home-search/listings",
    );
    expect(ardenRouter.match(["presence-copilot"])?.pattern).toBe(
      "/presence-copilot",
    );
    expect(ardenRouter.match(["sitemap"])).toBeNull();
    expect(ardenRouter.match(["robots.txt"])).toBeNull();
    expect(ardenRouter.match(["missing", "path"])).toBeNull();
  });

  it("does not let the property detail route steal named listing paths", () => {
    expect(ardenRouter.match(["properties", "sale"])?.pattern).toBe(
      "/properties/sale",
    );
    expect(ardenRouter.match(["properties", "sold"])?.pattern).toBe(
      "/properties/sold",
    );
    expect(ardenRouter.match(["properties", "worldwide"])?.pattern).toBe(
      "/properties/worldwide",
    );
    expect(ardenRouter.match(["properties", "leases"])?.pattern).toBe(
      "/properties/leases",
    );
  });

  it("marks listing and search routes as property routes", () => {
    expect(ardenRouter.isPropertyRoute("/properties/sale")).toBe(true);
    expect(ardenRouter.isPropertyRoute("/properties/[slug]")).toBe(true);
    expect(ardenRouter.isPropertyRoute("/home-search/listings")).toBe(true);
    expect(ardenRouter.isPropertyRoute("/about")).toBe(false);
    expect(ardenRouter.isPropertyRoute("/sell-your-home")).toBe(false);
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: ArdenSettingsSchema,
      routes: [
        {
          path: "/",
          Page: ArdenHomePage,
          contentSchema: ArdenHomeContentSchema,
          defaultContent: ardenHomeDefaultContent,
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
          subdomain: "arden",
          template: "arden",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });

  it("validates default home content against schema", () => {
    const parsed = ArdenHomeContentSchema.parse(ardenHomeDefaultContent);
    expect(parsed.listingsCtaLabel).toBe("View All Properties");
    expect(parsed.founderTitle).toBe("Meet Alexandra Vale");
  });

  it("is registered in the picker catalog and tenant registry", () => {
    expect(WEBSITE_TEMPLATES.some((template) => template.id === "arden")).toBe(
      true,
    );
    expect(TEMPLATE_REGISTRY.arden).toBe(ardenRouter);
  });
});
