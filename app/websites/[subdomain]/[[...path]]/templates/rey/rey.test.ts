import { describe, expect, it } from "vitest";

import { WEBSITE_TEMPLATES } from "@/app/websites/website-templates";
import { newWebsiteProperty } from "@/lib/websites/property";

import { createTemplateRouter } from "../create-template-router";
import { TEMPLATE_REGISTRY } from "../registry";
import { ReyHomePage } from "./pages/home/home";
import {
  ReyHomeContentSchema,
  reyHomeDefaultContent,
} from "./pages/home/schema";
import { reyRouter } from "./router";
import { ReySettingsSchema } from "./settings";

const site = {
  id: "site-1",
  profileId: "profile-1",
  subdomain: "rey",
  template: "rey",
  propertiesEnabled: true,
  blogPostsEnabled: true,
  settings: {},
};

describe("rey template", () => {
  it("parses empty website settings with Elena Vale defaults", () => {
    const settings = ReySettingsSchema.parse({});
    expect(settings.agent.fullName).toBe("Elena Vale");
    expect(settings.agent.monogram).toBe("EV");
    expect(settings.brand.ink).toBe("#11110f");
    expect(settings.catalog.properties).toHaveLength(6);
    expect(settings.catalog.communities).toHaveLength(6);
    expect(settings.catalog.team).toHaveLength(6);
    expect(settings.catalog.testimonials).toHaveLength(6);
    expect(settings.catalog.press).toHaveLength(8);
    expect(settings.catalog.team[0]?.bio.length).toBeGreaterThan(0);
    expect(settings.navItems).toHaveLength(8);
  });

  it("empties legacy catalog properties when resolving settings", () => {
    const settings = reyRouter.resolveSettings({}) as {
      catalog: { properties: unknown[] };
    };
    expect(settings.catalog.properties).toEqual([]);
  });

  it("matches all rey-inspired-template routes", () => {
    expect(reyRouter.match(undefined)?.pattern).toBe("/");
    expect(reyRouter.match(["about"])?.pattern).toBe("/about");
    expect(reyRouter.match(["team"])?.pattern).toBe("/team");
    expect(reyRouter.match(["team", "elena-vale"])).toEqual({
      pattern: "/team/[slug]",
      params: { slug: "elena-vale" },
      routeIndex: expect.any(Number),
    });
    expect(reyRouter.match(["properties"])?.pattern).toBe("/properties");
    expect(reyRouter.match(["properties", "crestline-modern"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "crestline-modern" },
      routeIndex: expect.any(Number),
    });
    expect(reyRouter.match(["sold"])?.pattern).toBe("/sold");
    expect(reyRouter.match(["communities"])?.pattern).toBe("/communities");
    expect(reyRouter.match(["communities", "beverly-hills"])).toEqual({
      pattern: "/communities/[slug]",
      params: { slug: "beverly-hills" },
      routeIndex: expect.any(Number),
    });
    expect(reyRouter.match(["journal"])?.pattern).toBe("/journal");
    expect(reyRouter.match(["journal", "market-notes"])?.pattern).toBe("/journal/[slug]");
    expect(reyRouter.match(["press"])?.pattern).toBe("/press");
    expect(reyRouter.match(["testimonials"])?.pattern).toBe("/testimonials");
    expect(reyRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(reyRouter.match(["sitemap"])).toBeNull();
    expect(reyRouter.match(["sitemap.xml"])).toBeNull();
    expect(reyRouter.match(["robots.txt"])).toBeNull();
    expect(reyRouter.match(["missing"])).toBeNull();
  });

  it("hides property navigation when properties are disabled", () => {
    expect(reyRouter.isPropertyRoute("/properties")).toBe(true);
    expect(reyRouter.isPropertyRoute("/properties/[slug]")).toBe(true);
    expect(reyRouter.isPropertyRoute("/sold")).toBe(true);
    expect(reyRouter.isPropertyRoute("/communities")).toBe(false);
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: ReySettingsSchema,
      routes: [
        {
          path: "/",
          Page: ReyHomePage,
          contentSchema: ReyHomeContentSchema,
          defaultContent: reyHomeDefaultContent,
        },
      ],
    });

    const match = router.match(undefined);
    expect(match).not.toBeNull();

    expect(() =>
      router.render({
        match: match!,
        site,
        rawContent: null,
      }),
    ).not.toThrow();
  });

  it("is registered in the picker catalog and tenant registry", () => {
    expect(WEBSITE_TEMPLATES.some((template) => template.id === "rey")).toBe(
      true,
    );
    expect(TEMPLATE_REGISTRY.rey).toBe(reyRouter);
  });

  it("renders every static route and catalog detail from defaults", () => {
    const listing = {
      ...newWebsiteProperty(0),
      slug: "crestline-modern",
      status: "for_sale" as const,
      title: "1420 Crestline Drive",
      address: "1420 Crestline Drive",
      city: "Beverly Hills",
      region: "CA",
      priceAmount: 31_500_000,
      bedrooms: 6,
      bathrooms: 9,
      livingArea: 11_420,
      lotSize: 36_155,
      isVisible: true,
      description: "A sculptural contemporary residence above the city.",
      images: ["https://example.com/crestline.jpg"],
    };

    const staticPaths = [
      undefined,
      ["about"],
      ["team"],
      ["team", "elena-vale"],
      ["properties"],
      ["sold"],
      ["communities"],
      ["communities", "beverly-hills"],
      ["journal"],
      ["press"],
      ["testimonials"],
      ["contact"],
    ] as const;

    for (const path of staticPaths) {
      const match = reyRouter.match(path ? [...path] : undefined);
      expect(match, `missing route for ${path?.join("/") ?? "/"}`).not.toBeNull();
      expect(() =>
        reyRouter.render({
          match: match!,
          site,
          rawContent: null,
        }),
      ).not.toThrow();
    }

    const propertyMatch = reyRouter.match(["properties", listing.slug]);
    expect(propertyMatch).not.toBeNull();
    expect(() =>
      reyRouter.render({
        match: propertyMatch!,
        site,
        rawContent: null,
        properties: [listing],
      }),
    ).not.toThrow();
  });
});
