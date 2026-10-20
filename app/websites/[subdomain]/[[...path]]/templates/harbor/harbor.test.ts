import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { HarborHomePage } from "./pages/home/home";
import {
  HarborHomeContentSchema,
  harborHomeDefaultContent,
} from "./pages/home/schema";
import { harborRouter } from "./router";
import { HarborSettingsSchema } from "./settings";

describe("harbor template", () => {
  it("parses empty website settings with Avery Rowan defaults", () => {
    const settings = HarborSettingsSchema.parse({});
    expect(settings.agent.name).toBe("Avery Rowan");
    expect(settings.agent.monogram).toBe("AR");
    expect(settings.brand.paper).toBe("#f3f0e9");
    expect(settings.catalog.listings).toHaveLength(6);
    expect(settings.catalog.testimonials).toHaveLength(6);
    expect(settings.catalog.posts).toHaveLength(3);
    expect(settings.catalog.buildings).toHaveLength(6);
    expect(settings.catalog.neighbourhoods).toHaveLength(8);
    expect(settings.catalog.processSell).toHaveLength(4);
    expect(settings.catalog.processBuy).toHaveLength(4);
    expect(settings.catalog.posts[0]?.body?.length).toBeGreaterThan(0);
    expect(settings.navItems).toHaveLength(5);
    expect(settings.menuExtras).toHaveLength(2);
    expect(settings.menuSecondary).toHaveLength(3);
  });

  it("matches all harbor-house-realty routes", () => {
    expect(harborRouter.match(undefined)?.pattern).toBe("/");
    expect(harborRouter.match(["sell"])?.pattern).toBe("/sell");
    expect(harborRouter.match(["buy"])?.pattern).toBe("/buy");
    expect(harborRouter.match(["marketing"])?.pattern).toBe("/marketing");
    expect(harborRouter.match(["listings"])?.pattern).toBe("/listings");
    expect(harborRouter.match(["listings", "lake-house-modern"])).toEqual({
      pattern: "/listings/[slug]",
      params: { slug: "lake-house-modern" },
      routeIndex: expect.any(Number),
    });
    expect(harborRouter.match(["about"])?.pattern).toBe("/about");
    expect(harborRouter.match(["reviews"])?.pattern).toBe("/reviews");
    expect(harborRouter.match(["journal"])?.pattern).toBe("/journal");
    expect(
      harborRouter.match([
        "journal",
        "pricing-a-home-in-a-shifting-market",
      ])?.params,
    ).toEqual({ slug: "pricing-a-home-in-a-shifting-market" });
    expect(harborRouter.match(["condo-guide"])?.pattern).toBe("/condo-guide");
    expect(harborRouter.match(["home-value"])?.pattern).toBe("/home-value");
    expect(harborRouter.match(["market-report"])?.pattern).toBe(
      "/market-report",
    );
    expect(harborRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(harborRouter.match(["privacy"])?.pattern).toBe("/privacy");
    expect(harborRouter.match(["ai-disclosure"])?.pattern).toBe(
      "/ai-disclosure",
    );
    expect(harborRouter.match(["missing"])).toBeNull();
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: HarborSettingsSchema,
      routes: [
        {
          path: "/",
          Page: HarborHomePage,
          contentSchema: HarborHomeContentSchema,
          defaultContent: harborHomeDefaultContent,
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
          subdomain: "harbor",
          template: "harbor",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });
});
