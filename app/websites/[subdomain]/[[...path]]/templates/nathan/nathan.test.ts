import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { NathanHomePage } from "./pages/home/home";
import {
  NathanHomeContentSchema,
  nathanHomeDefaultContent,
} from "./pages/home/schema";
import { nathanRouter } from "./router";
import { NathanSettingsSchema } from "./settings";

describe("nathan template", () => {
  it("parses empty website settings with Nathan Vale defaults", () => {
    const settings = NathanSettingsSchema.parse({});
    expect(settings.agent.fullName).toBe("Nathan Vale");
    expect(settings.agent.monogram).toBe("NV");
    expect(settings.brand.cobalt).toBe("#3155ff");
    expect(settings.catalog.properties).toHaveLength(6);
    expect(settings.catalog.neighborhoods).toHaveLength(6);
    expect(settings.catalog.sold).toHaveLength(4);
    expect(settings.catalog.additionalSold).toHaveLength(4);
    expect(settings.catalog.insights).toHaveLength(3);
    expect(settings.catalog.press).toHaveLength(5);
    expect(settings.catalog.insights[0]?.body.length).toBeGreaterThan(0);
    expect(settings.navItems).toHaveLength(6);
  });

  it("matches all vale-estate routes", () => {
    expect(nathanRouter.match(undefined)?.pattern).toBe("/");
    expect(nathanRouter.match(["about"])?.pattern).toBe("/about");
    expect(nathanRouter.match(["properties"])?.pattern).toBe("/properties");
    expect(nathanRouter.match(["properties", "glass-house-tribeca"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "glass-house-tribeca" },
      routeIndex: expect.any(Number),
    });
    expect(nathanRouter.match(["neighborhoods"])?.pattern).toBe(
      "/neighborhoods",
    );
    expect(nathanRouter.match(["sold"])?.pattern).toBe("/sold");
    expect(nathanRouter.match(["insights"])?.pattern).toBe("/insights");
    expect(
      nathanRouter.match(["insights", "the-new-luxury-buyer"])?.params,
    ).toEqual({ slug: "the-new-luxury-buyer" });
    expect(nathanRouter.match(["press"])?.pattern).toBe("/press");
    expect(nathanRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(nathanRouter.match(["privacy"])?.pattern).toBe("/privacy");
    expect(nathanRouter.match(["missing"])).toBeNull();
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: NathanSettingsSchema,
      routes: [
        {
          path: "/",
          Page: NathanHomePage,
          contentSchema: NathanHomeContentSchema,
          defaultContent: nathanHomeDefaultContent,
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
          subdomain: "nathan",
          template: "nathan",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });
});
