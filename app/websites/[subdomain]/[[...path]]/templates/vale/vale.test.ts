import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { ValeHomeContentSchema, valeHomeDefaultContent } from "./pages/home/schema";
import { ValeHomePage } from "./pages/home/home";
import { ValeSettingsSchema } from "./settings";
import { valeRouter } from "./router";

describe("vale template", () => {
  it("parses empty website settings with Mara Vale defaults", () => {
    const settings = ValeSettingsSchema.parse({});
    expect(settings.agent.name).toBe("Mara Vale");
    expect(settings.catalog.properties).toHaveLength(4);
    expect(settings.catalog.articles).toHaveLength(3);
    expect(settings.catalog.services).toHaveLength(4);
  });

  it("matches all vale-estates routes", () => {
    expect(valeRouter.match(undefined)?.pattern).toBe("/");
    expect(valeRouter.match(["about"])?.pattern).toBe("/about");
    expect(valeRouter.match(["services"])?.pattern).toBe("/services");
    expect(valeRouter.match(["properties"])?.pattern).toBe("/properties");
    expect(valeRouter.match(["properties", "ocean-house"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "ocean-house" },
      routeIndex: expect.any(Number),
    });
    expect(valeRouter.match(["journal"])?.pattern).toBe("/journal");
    expect(valeRouter.match(["journal", "private-market"])?.params).toEqual({
      slug: "private-market",
    });
    expect(valeRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(valeRouter.match(["missing"])).toBeNull();
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: ValeSettingsSchema,
      routes: [
        {
          path: "/",
          Page: ValeHomePage,
          contentSchema: ValeHomeContentSchema,
          defaultContent: valeHomeDefaultContent,
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
          template: "vale",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });
});
