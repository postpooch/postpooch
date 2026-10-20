import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { MaraHomePage } from "./pages/home/home";
import {
  MaraHomeContentSchema,
  maraHomeDefaultContent,
} from "./pages/home/schema";
import { maraRouter } from "./router";
import { newWebsiteProperty } from "@/lib/websites/property";
import { MaraSettingsSchema } from "./settings";

describe("mara template", () => {
  it("parses empty website settings with Mara Vale defaults", () => {
    const settings = MaraSettingsSchema.parse({});
    expect(settings.agent.name).toBe("Mara Vale");
    expect(settings.agent.monogram).toBe("MV");
    expect(settings.brand.ink).toBe("#171713");
    expect(settings.catalog.properties).toHaveLength(6);
    expect(settings.catalog.neighborhoods).toHaveLength(6);
    expect(settings.catalog.condos).toHaveLength(4);
    expect(settings.catalog.articles).toHaveLength(4);
    expect(settings.catalog.testimonials).toHaveLength(3);
    expect(settings.catalog.properties[0]?.gallery.length).toBeGreaterThan(0);
    expect(settings.catalog.articles[0]?.body.length).toBeGreaterThan(0);
  });

  it("matches all luxury-agent-site routes", () => {
    expect(maraRouter.match(undefined)?.pattern).toBe("/");
    expect(maraRouter.match(["about"])?.pattern).toBe("/about");
    expect(maraRouter.match(["properties"])?.pattern).toBe("/properties");
    expect(maraRouter.match(["properties", "18-ridgewood-crescent"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "18-ridgewood-crescent" },
      routeIndex: expect.any(Number),
    });
    expect(maraRouter.match(["condos"])?.pattern).toBe("/condos");
    expect(maraRouter.match(["condos", "one-bedford"])?.params).toEqual({
      slug: "one-bedford",
    });
    expect(maraRouter.match(["buy"])?.pattern).toBe("/buy");
    expect(maraRouter.match(["sell"])?.pattern).toBe("/sell");
    expect(maraRouter.match(["buyer-consultation"])?.pattern).toBe(
      "/buyer-consultation",
    );
    expect(maraRouter.match(["seller-consultation"])?.pattern).toBe(
      "/seller-consultation",
    );
    expect(maraRouter.match(["property-alerts"])?.pattern).toBe(
      "/property-alerts",
    );
    expect(maraRouter.match(["valuation"])?.pattern).toBe("/valuation");
    expect(maraRouter.match(["neighborhoods"])?.pattern).toBe("/neighborhoods");
    expect(maraRouter.match(["neighborhoods", "rosedale"])?.params).toEqual({
      slug: "rosedale",
    });
    expect(maraRouter.match(["reviews"])?.pattern).toBe("/reviews");
    expect(maraRouter.match(["journal"])?.pattern).toBe("/journal");
    expect(
      maraRouter.match(["journal", "buy-the-street-before-the-house"])?.params,
    ).toEqual({ slug: "buy-the-street-before-the-house" });
    expect(maraRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(maraRouter.match(["privacy"])?.pattern).toBe("/privacy");
    expect(maraRouter.match(["missing"])).toBeNull();
  });

  it("editorPreviewMatch uses visible tenant property slugs for property routes", () => {
    const settings = MaraSettingsSchema.parse({});
    const property = {
      ...newWebsiteProperty(0),
      slug: "tenant-property",
      title: "Tenant property",
      isVisible: true,
    };
    expect(
      maraRouter.editorPreviewMatch("/properties/[slug]", settings, [property]),
    ).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "tenant-property" },
      routeIndex: expect.any(Number),
    });
    expect(maraRouter.editorPreviewMatch("/", settings)).toEqual({
      pattern: "/",
      params: {},
      routeIndex: expect.any(Number),
    });
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: MaraSettingsSchema,
      routes: [
        {
          path: "/",
          Page: MaraHomePage,
          contentSchema: MaraHomeContentSchema,
          defaultContent: maraHomeDefaultContent,
        },
      ],
    });

    const match = router.match(undefined);
    expect(match).not.toBeNull();

    expect(() =>
      router.render({
        match: match!,
        site: {
          id: "site-1",
          profileId: "profile-1",
          subdomain: "mara",
          template: "mara",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });
});
