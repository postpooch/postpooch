import { describe, expect, it } from "vitest";

import { createTemplateRouter } from "../create-template-router";
import { ElenaHomePage } from "./pages/home/home";
import {
  ElenaHomeContentSchema,
  elenaHomeDefaultContent,
} from "./pages/home/schema";
import { elenaRouter } from "./router";
import { ElenaSettingsSchema } from "./settings";

describe("elena template", () => {
  it("parses empty website settings with Elena Hart defaults", () => {
    const settings = ElenaSettingsSchema.parse({});
    expect(settings.agent.firstName).toBe("Elena");
    expect(settings.agent.lastName).toBe("Hart");
    expect(settings.agent.initials).toBe("EH");
    expect(settings.brand.ink).toBe("#171714");
    expect(settings.navItems).toHaveLength(5);
    expect(settings.catalog.stats).toHaveLength(3);
    expect(settings.catalog.services).toHaveLength(4);
    expect(settings.catalog.listings).toHaveLength(3);
    expect(settings.catalog.journal).toHaveLength(3);
    expect(settings.catalog.processSteps).toHaveLength(4);
  });

  it("matches home and journal routes", () => {
    expect(elenaRouter.match(undefined)?.pattern).toBe("/");
    expect(elenaRouter.match([])?.pattern).toBe("/");
    expect(elenaRouter.match(["residences", "park-slope-townhouse"])?.pattern).toBe(
      "/residences/[slug]",
    );
    expect(elenaRouter.match(["journal"])?.pattern).toBe("/journal");
    expect(elenaRouter.match(["journal", "market-notes"])?.pattern).toBe("/journal/[slug]");
    expect(elenaRouter.match(["about"])).toBeNull();
    expect(elenaRouter.match(["missing"])).toBeNull();
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: ElenaSettingsSchema,
      routes: [
        {
          path: "/",
          Page: ElenaHomePage,
          contentSchema: ElenaHomeContentSchema,
          defaultContent: elenaHomeDefaultContent,
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
          subdomain: "elena",
          template: "elena",
          propertiesEnabled: true,
          blogPostsEnabled: true,
          settings: {},
        },
        rawContent: null,
      }),
    ).not.toThrow();
  });

  it("validates default home content against schema", () => {
    const parsed = ElenaHomeContentSchema.parse(elenaHomeDefaultContent);
    expect(parsed.heroTitleEmphasis).toBe("move through");
    expect(parsed.aboutCtaHref).toBe("#contact");
  });
});
