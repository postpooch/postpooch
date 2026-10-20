import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { VossHomePage } from "./pages/home/home";
import {
  VossHomeContentSchema,
  vossHomeDefaultContent,
} from "./pages/home/schema";
import { vossRouter } from "./router";
import { VossSettingsSchema } from "./settings";

describe("voss template", () => {
  it("parses empty website settings with Mara Voss defaults", () => {
    const settings = VossSettingsSchema.parse({});
    expect(settings.agent.fullName).toBe("Mara Voss");
    expect(settings.agent.monogram).toBe("MV");
    expect(settings.brand.copper).toBe("#9b5d43");
    expect(settings.brand.accentLight).toBe("#d9b5a5");
    expect(settings.catalog.properties).toHaveLength(6);
    expect(settings.catalog.neighborhoods).toHaveLength(4);
    expect(settings.catalog.journal).toHaveLength(3);
    expect(settings.catalog.services).toHaveLength(6);
    expect(settings.catalog.developments).toHaveLength(3);
    expect(settings.catalog.press).toHaveLength(5);
    expect(settings.navItems).toHaveLength(6);
  });

  it("matches all mara-voss-real-estate routes", () => {
    expect(vossRouter.match(undefined)?.pattern).toBe("/");
    expect(vossRouter.match(["about"])?.pattern).toBe("/about");
    expect(vossRouter.match(["properties"])?.pattern).toBe("/properties");
    expect(vossRouter.match(["properties", "central-park-aerie"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "central-park-aerie" },
      routeIndex: expect.any(Number),
    });
    expect(vossRouter.match(["services"])?.pattern).toBe("/services");
    expect(vossRouter.match(["new-developments"])?.pattern).toBe(
      "/new-developments",
    );
    expect(vossRouter.match(["press"])?.pattern).toBe("/press");
    expect(vossRouter.match(["guides", "closing-costs"])?.pattern).toBe(
      "/guides/closing-costs",
    );
    expect(vossRouter.match(["neighborhoods"])?.pattern).toBe(
      "/neighborhoods",
    );
    expect(vossRouter.match(["journal"])?.pattern).toBe("/journal");
    expect(vossRouter.match(["journal", "market-notes"])?.pattern).toBe(
      "/journal/[slug]",
    );
    expect(vossRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(vossRouter.match(["missing"])).toBeNull();
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: VossSettingsSchema,
      routes: [
        {
          path: "/",
          Page: VossHomePage,
          contentSchema: VossHomeContentSchema,
          defaultContent: vossHomeDefaultContent,
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
          subdomain: "voss",
          template: "voss",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });
});
