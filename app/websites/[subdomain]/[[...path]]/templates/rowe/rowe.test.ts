import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { RoweHomePage } from "./pages/home/home";
import {
  RoweHomeContentSchema,
  roweHomeDefaultContent,
} from "./pages/home/schema";
import { roweRouter } from "./router";
import { RoweSettingsSchema } from "./settings";

describe("rowe template", () => {
  it("parses empty website settings with Avery Rowe defaults", () => {
    const settings = RoweSettingsSchema.parse({});
    expect(settings.agent.name).toBe("Avery Rowe");
    expect(settings.agent.wordmark).toBe("AVERY ROWE");
    expect(settings.brand.paper).toBe("#eeeae2");
    expect(settings.catalog.services).toHaveLength(4);
    expect(settings.catalog.properties).toHaveLength(3);
    expect(settings.catalog.journal).toHaveLength(6);
    expect(settings.catalog.services[0]?.body.length).toBeGreaterThan(0);
    expect(settings.navItems).toHaveLength(4);
  });

  it("matches all estate-agent-site routes", () => {
    expect(roweRouter.match(undefined)?.pattern).toBe("/");
    expect(roweRouter.match(["about"])?.pattern).toBe("/about");
    expect(roweRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(roweRouter.match(["privacy"])?.pattern).toBe("/privacy");
    expect(roweRouter.match(["properties"])?.pattern).toBe("/properties");
    expect(roweRouter.match(["properties", "canyon-glass-house"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "canyon-glass-house" },
      routeIndex: expect.any(Number),
    });
    expect(roweRouter.match(["services"])?.pattern).toBe("/services");
    expect(
      roweRouter.match(["services", "buyer-representation"])?.params,
    ).toEqual({ slug: "buyer-representation" });
    expect(roweRouter.match(["journal"])?.pattern).toBe("/journal");
    expect(
      roweRouter.match(["journal", "the-case-for-quiet-listings"])?.params,
    ).toEqual({ slug: "the-case-for-quiet-listings" });
    expect(roweRouter.match(["missing"])).toBeNull();
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: RoweSettingsSchema,
      routes: [
        {
          path: "/",
          Page: RoweHomePage,
          contentSchema: RoweHomeContentSchema,
          defaultContent: roweHomeDefaultContent,
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
          subdomain: "rowe",
          template: "rowe",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });
});
