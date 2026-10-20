import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { RowanHomePage } from "./pages/home/home";
import {
  RowanHomeContentSchema,
  rowanHomeDefaultContent,
} from "./pages/home/schema";
import { RowanSettingsSchema } from "./settings";
import { rowanRouter } from "./router";

describe("rowan template", () => {
  it("parses empty website settings with Avery Rowan defaults", () => {
    const settings = RowanSettingsSchema.parse({});
    expect(settings.agent.name).toBe("Avery Rowan");
    expect(settings.catalog.projects).toHaveLength(4);
    expect(settings.catalog.listings).toHaveLength(4);
    expect(settings.catalog.testimonials).toHaveLength(3);
  });

  it("matches all rowan-estates routes", () => {
    expect(rowanRouter.match(undefined)?.pattern).toBe("/");
    expect(rowanRouter.match(["listings"])?.pattern).toBe("/listings");
    expect(rowanRouter.match(["listings", "41-pine-shadow-lane"])).toEqual({
      pattern: "/listings/[slug]",
      params: { slug: "41-pine-shadow-lane" },
      routeIndex: expect.any(Number),
    });
    expect(rowanRouter.match(["journal"])?.pattern).toBe("/journal");
    expect(rowanRouter.match(["journal", "market-notes"])?.pattern).toBe(
      "/journal/[slug]",
    );
    expect(rowanRouter.match(["projects", "cedar-veil"])).toEqual({
      pattern: "/projects/[slug]",
      params: { slug: "cedar-veil" },
      routeIndex: expect.any(Number),
    });
    expect(rowanRouter.match(["privacy-policy"])?.pattern).toBe(
      "/privacy-policy",
    );
    expect(rowanRouter.match(["missing"])).toBeNull();
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: RowanSettingsSchema,
      routes: [
        {
          path: "/",
          Page: RowanHomePage,
          contentSchema: RowanHomeContentSchema,
          defaultContent: rowanHomeDefaultContent,
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
          subdomain: "avery",
          template: "rowan",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });
});
