import { describe, expect, it } from "vitest";

import { WEBSITE_TEMPLATES } from "@/app/websites/website-templates";
import { blogPostSlug } from "@/lib/websites/blog-post";
import { newWebsiteProperty } from "@/lib/websites/property";

import { createTemplateRouter } from "../create-template-router";
import { TEMPLATE_REGISTRY } from "../registry";
import { SloaneHomePage } from "./pages/home/home";
import {
  SloaneHomeContentSchema,
  sloaneHomeDefaultContent,
} from "./pages/home/schema";
import { sloaneRouter } from "./router";
import { SloaneSettingsSchema } from "./settings";

const site = {
  id: "site-1",
  profileId: "profile-1",
  subdomain: "sloane",
  template: "sloane",
  propertiesEnabled: true,
  blogPostsEnabled: true,
  settings: {},
};

const samplePost = {
  id: "00000000-0000-4000-8000-000000000001",
  title: "Design Before Listing",
  subtitle: "A closer look at preparation.",
  text: "First paragraph.\n\nSecond paragraph.",
  createdAt: "2026-03-12T16:00:00.000Z",
};

describe("sloane template", () => {
  it("parses empty website settings with Sloane Reed defaults", () => {
    const settings = SloaneSettingsSchema.parse({});
    expect(settings.agent.name).toBe("Sloane Reed");
    expect(settings.agent.monogram).toBe("SR");
    expect(settings.brand.paper).toBe("#f3f0e9");
    expect(settings.catalog.properties).toHaveLength(8);
    expect(settings.catalog.communities).toHaveLength(10);
    expect(settings.catalog.posts).toHaveLength(3);
    expect(settings.catalog.testimonials).toHaveLength(6);
    expect(settings.catalog.press).toHaveLength(6);
    expect(settings.catalog.team).toHaveLength(3);
    expect(settings.navItems).toHaveLength(6);
  });

  it("empties the legacy property catalog after resolveSettings", () => {
    const resolved = sloaneRouter.resolveSettings({}) as ReturnType<
      typeof SloaneSettingsSchema.parse
    >;
    expect(resolved.catalog.properties).toEqual([]);
    expect(resolved.catalog.posts).toEqual([]);
    expect(() => sloaneRouter.resolveSettings(resolved)).not.toThrow();
  });

  it("matches sloane-reed routes without reserved sitemap files", () => {
    expect(sloaneRouter.match(undefined)?.pattern).toBe("/");
    expect(sloaneRouter.match(["about"])?.pattern).toBe("/about");
    expect(sloaneRouter.match(["team"])?.pattern).toBe("/team");
    expect(sloaneRouter.match(["testimonials"])?.pattern).toBe("/testimonials");
    expect(sloaneRouter.match(["press"])?.pattern).toBe("/press");
    expect(sloaneRouter.match(["properties"])?.pattern).toBe("/properties");
    expect(sloaneRouter.match(["properties", "exclusive"])?.pattern).toBe(
      "/properties/exclusive",
    );
    expect(sloaneRouter.match(["properties", "lease"])?.pattern).toBe(
      "/properties/lease",
    );
    expect(sloaneRouter.match(["properties", "sold"])?.pattern).toBe("/properties/sold");
    expect(sloaneRouter.match(["properties", "search"])?.pattern).toBe(
      "/properties/search",
    );
    expect(sloaneRouter.match(["properties", "skyline-residence"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "skyline-residence" },
      routeIndex: expect.any(Number),
    });
    expect(sloaneRouter.match(["communities"])?.pattern).toBe("/communities");
    expect(sloaneRouter.match(["communities", "beverly-hills"])?.params).toEqual({
      slug: "beverly-hills",
    });
    expect(sloaneRouter.match(["resources"])?.pattern).toBe("/resources");
    expect(sloaneRouter.match(["resources", "buying"])?.pattern).toBe(
      "/resources/buying",
    );
    expect(sloaneRouter.match(["resources", "selling"])?.pattern).toBe(
      "/resources/selling",
    );
    expect(sloaneRouter.match(["resources", "financing"])?.pattern).toBe(
      "/resources/financing",
    );
    expect(sloaneRouter.match(["resources", "valuation"])?.pattern).toBe(
      "/resources/valuation",
    );
    expect(sloaneRouter.match(["journal"])?.pattern).toBe("/journal");
    expect(sloaneRouter.match(["journal", "design-before-listing"])?.params).toEqual({
      slug: "design-before-listing",
    });
    expect(sloaneRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(sloaneRouter.match(["sitemap"])).toBeNull();
    expect(sloaneRouter.match(["sitemap.xml"])).toBeNull();
    expect(sloaneRouter.match(["robots.txt"])).toBeNull();
    expect(sloaneRouter.match(["missing"])).toBeNull();
  });

  it("marks listing surfaces as property routes", () => {
    expect(sloaneRouter.isPropertyRoute("/properties")).toBe(true);
    expect(sloaneRouter.isPropertyRoute("/properties/exclusive")).toBe(true);
    expect(sloaneRouter.isPropertyRoute("/properties/lease")).toBe(true);
    expect(sloaneRouter.isPropertyRoute("/properties/sold")).toBe(true);
    expect(sloaneRouter.isPropertyRoute("/properties/search")).toBe(true);
    expect(sloaneRouter.isPropertyRoute("/properties/[slug]")).toBe(true);
    expect(sloaneRouter.isPropertyRoute("/about")).toBe(false);
    expect(sloaneRouter.isPropertyRoute("/communities")).toBe(false);
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: SloaneSettingsSchema,
      routes: [
        {
          path: "/",
          Page: SloaneHomePage,
          contentSchema: SloaneHomeContentSchema,
          defaultContent: sloaneHomeDefaultContent,
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
    expect(WEBSITE_TEMPLATES.some((template) => template.id === "sloane")).toBe(true);
    expect(TEMPLATE_REGISTRY.sloane).toBe(sloaneRouter);
  });

  it("editorPreviewMatch uses visible tenant property slugs for property routes", () => {
    const settings = SloaneSettingsSchema.parse({});
    const property = {
      ...newWebsiteProperty(0),
      slug: "tenant-property",
      title: "Tenant property",
      isVisible: true,
    };
    expect(
      sloaneRouter.editorPreviewMatch("/properties/[slug]", settings, [property]),
    ).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "tenant-property" },
      routeIndex: expect.any(Number),
    });
    expect(sloaneRouter.editorPreviewMatch("/", settings)).toEqual({
      pattern: "/",
      params: {},
      routeIndex: expect.any(Number),
    });
  });

  it("renders every static route and catalog detail from defaults", () => {
    const listing = {
      ...newWebsiteProperty(0),
      slug: "skyline-residence",
      status: "for_sale" as const,
      title: "1425 Skyline Drive",
      address: "1425 Skyline Drive",
      city: "Los Angeles",
      region: "CA",
      priceAmount: 8_750_000,
      bedrooms: 5,
      bathrooms: 6,
      livingArea: 5480,
      isVisible: true,
      description: "A private architectural residence above the city.",
      images: ["https://example.com/skyline.jpg"],
    };
    const leased = {
      ...listing,
      slug: "oak-modern",
      status: "for_rent" as const,
    };
    const sold = {
      ...listing,
      slug: "stonegate-estate",
      status: "sold" as const,
    };

    const paths = [
      undefined,
      ["about"],
      ["team"],
      ["testimonials"],
      ["press"],
      ["properties"],
      ["properties", "exclusive"],
      ["properties", "lease"],
      ["properties", "sold"],
      ["properties", "search"],
      ["communities"],
      ["communities", "beverly-hills"],
      ["resources"],
      ["resources", "buying"],
      ["resources", "selling"],
      ["resources", "financing"],
      ["resources", "valuation"],
      ["journal"],
      ["journal", blogPostSlug(samplePost)],
      ["contact"],
    ] as const;

    for (const path of paths) {
      const segments = path ? [...path] : undefined;
      const match = sloaneRouter.match(segments);
      expect(match, `missing route for ${path?.join("/") ?? "/"}`).not.toBeNull();
      expect(() =>
        sloaneRouter.render({
          match: match!,
          site,
          rawContent: null,
          properties: [listing, leased, sold],
          blogPosts: [samplePost],
        }),
      ).not.toThrow();
    }

    const propertyMatch = sloaneRouter.match(["properties", listing.slug]);
    expect(propertyMatch).not.toBeNull();
    expect(() =>
      sloaneRouter.render({
        match: propertyMatch!,
        site,
        rawContent: null,
        properties: [listing, leased, sold],
      }),
    ).not.toThrow();
  });
});
