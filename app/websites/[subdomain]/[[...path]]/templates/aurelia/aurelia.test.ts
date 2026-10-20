import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { AureliaHomePage } from "./pages/home/home";
import {
  AureliaHomeContentSchema,
  aureliaHomeDefaultContent,
} from "./pages/home/schema";
import { aureliaRouter } from "./router";
import { AureliaSettingsSchema } from "./settings";

describe("aurelia template", () => {
  it("parses empty website settings with Aurelia defaults", () => {
    const settings = AureliaSettingsSchema.parse({});
    expect(settings.agent.brand).toBe("Aurelia Estates");
    expect(settings.agent.monogram).toBe("AE");
    expect(settings.brand.accent).toBe("#8d775d");
    expect(settings.catalog.properties).toHaveLength(8);
    expect(settings.catalog.communities).toHaveLength(6);
    expect(settings.catalog.articles).toHaveLength(6);
    expect(settings.catalog.press).toHaveLength(6);
    expect(settings.catalog.testimonials).toHaveLength(6);
    expect(settings.catalog.globalProperties).toHaveLength(6);
    expect(settings.navItems.length).toBeGreaterThan(0);
  });

  it("empties the legacy property catalog after resolveSettings", () => {
    const resolved = aureliaRouter.resolveSettings({}) as ReturnType<
      typeof AureliaSettingsSchema.parse
    >;
    expect(resolved.catalog.properties).toEqual([]);
    expect(resolved.catalog.globalProperties).toEqual([]);
    expect(() => aureliaRouter.resolveSettings(resolved)).not.toThrow();
  });

  it("matches all Aurelia routes without reserved sitemap files", () => {
    expect(aureliaRouter.match(undefined)?.pattern).toBe("/");
    expect(aureliaRouter.match(["about"])?.pattern).toBe("/about");
    expect(aureliaRouter.match(["properties"])?.pattern).toBe("/properties");
    expect(aureliaRouter.match(["properties", "leases"])?.pattern).toBe(
      "/properties/leases",
    );
    expect(aureliaRouter.match(["properties", "sold"])?.pattern).toBe(
      "/properties/sold",
    );
    expect(aureliaRouter.match(["properties", "global"])?.pattern).toBe(
      "/properties/global",
    );
    expect(aureliaRouter.match(["properties", "crestline-residence"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "crestline-residence" },
      routeIndex: expect.any(Number),
    });
    expect(aureliaRouter.match(["communities"])?.pattern).toBe("/communities");
    expect(aureliaRouter.match(["communities", "beverly-hills"])?.params).toEqual({
      slug: "beverly-hills",
    });
    expect(aureliaRouter.match(["home-search"])?.pattern).toBe("/home-search");
    expect(aureliaRouter.match(["press"])?.pattern).toBe("/press");
    expect(aureliaRouter.match(["testimonials"])?.pattern).toBe("/testimonials");
    expect(aureliaRouter.match(["gated-communities"])?.pattern).toBe(
      "/gated-communities",
    );
    expect(
      aureliaRouter.match(["international-luxury-alliance"])?.pattern,
    ).toBe("/international-luxury-alliance");
    expect(aureliaRouter.match(["journal"])?.pattern).toBe("/journal");
    expect(
      aureliaRouter.match(["journal", "buying-a-legacy-estate"])?.params,
    ).toEqual({ slug: "buying-a-legacy-estate" });
    expect(aureliaRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(aureliaRouter.match(["sitemap"])).toBeNull();
    expect(aureliaRouter.match(["sitemap.xml"])).toBeNull();
    expect(aureliaRouter.match(["robots.txt"])).toBeNull();
    expect(aureliaRouter.match(["missing"])).toBeNull();
  });

  it("marks listing surfaces as property routes", () => {
    expect(aureliaRouter.isPropertyRoute("/properties")).toBe(true);
    expect(aureliaRouter.isPropertyRoute("/properties/leases")).toBe(true);
    expect(aureliaRouter.isPropertyRoute("/properties/sold")).toBe(true);
    expect(aureliaRouter.isPropertyRoute("/properties/[slug]")).toBe(true);
    expect(aureliaRouter.isPropertyRoute("/home-search")).toBe(true);
    expect(aureliaRouter.isPropertyRoute("/gated-communities")).toBe(true);
    expect(aureliaRouter.isPropertyRoute("/properties/global")).toBe(true);
    expect(aureliaRouter.isPropertyRoute("/about")).toBe(false);
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: AureliaSettingsSchema,
      routes: [
        {
          path: "/",
          Page: AureliaHomePage,
          contentSchema: AureliaHomeContentSchema,
          defaultContent: aureliaHomeDefaultContent,
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
          subdomain: "aurelia",
          template: "aurelia",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });
});
