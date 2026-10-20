import { describe, expect, it } from "vitest";

import { WEBSITE_TEMPLATES } from "@/app/websites/website-templates";
import { blogPostSlug } from "@/lib/websites/blog-post";
import { newWebsiteProperty } from "@/lib/websites/property";

import { createTemplateRouter } from "../create-template-router";
import { TEMPLATE_REGISTRY } from "../registry";
import { AveryHomePage } from "./pages/home/home";
import {
  AveryHomeContentSchema,
  averyHomeDefaultContent,
} from "./pages/home/schema";
import { averyRouter } from "./router";
import { AverySettingsSchema } from "./settings";

const site = {
  id: "site-1",
  profileId: "profile-1",
  subdomain: "avery",
  template: "avery",
  propertiesEnabled: true,
  blogPostsEnabled: true,
  settings: {},
};

const samplePost = {
  id: "00000000-0000-4000-8000-000000000001",
  title: "The Art of Pricing",
  subtitle: "A closer look at preparation.",
  text: "First paragraph.\n\nSecond paragraph.",
  createdAt: "2026-03-12T16:00:00.000Z",
};

describe("avery template", () => {
  it("parses empty website settings with Avery defaults", () => {
    const settings = AverySettingsSchema.parse({});
    expect(settings.agent.name).toBe("Avery Laurent");
    expect(settings.agent.brandFirst).toBe("AVERY");
    expect(settings.brand.paper).toBe("#f2efe8");
    expect(settings.catalog.properties).toHaveLength(6);
    expect(settings.catalog.neighborhoods).toHaveLength(6);
    expect(settings.catalog.insights).toHaveLength(6);
    expect(settings.catalog.testimonials).toHaveLength(4);
    expect(settings.catalog.beforeAfterCases).toHaveLength(3);
    expect(settings.catalog.resources).toHaveLength(6);
    expect(settings.catalog.buyerSteps).toHaveLength(6);
    expect(settings.navItems.length).toBeGreaterThan(0);
  });

  it("empties the legacy property catalog after resolveSettings", () => {
    const resolved = averyRouter.resolveSettings({}) as ReturnType<
      typeof AverySettingsSchema.parse
    >;
    expect(resolved.catalog.properties).toEqual([]);
    expect(resolved.catalog.insights).toEqual([]);
    expect(resolved.catalog.neighborhoods).toHaveLength(6);
    expect(() => averyRouter.resolveSettings(resolved)).not.toThrow();
  });

  it("matches all Avery routes without reserved sitemap files", () => {
    expect(averyRouter.match(undefined)?.pattern).toBe("/");
    expect(averyRouter.match(["about"])?.pattern).toBe("/about");
    expect(averyRouter.match(["properties"])?.pattern).toBe("/properties");
    expect(averyRouter.match(["properties", "sale"])?.pattern).toBe(
      "/properties/sale",
    );
    expect(averyRouter.match(["properties", "sold"])?.pattern).toBe(
      "/properties/sold",
    );
    expect(averyRouter.match(["properties", "park-avenue-residence"])).toEqual({
      pattern: "/properties/[slug]",
      params: { slug: "park-avenue-residence" },
      routeIndex: expect.any(Number),
    });
    expect(averyRouter.match(["search"])?.pattern).toBe("/search");
    expect(averyRouter.match(["neighborhoods"])?.pattern).toBe("/neighborhoods");
    expect(averyRouter.match(["neighborhoods", "west-village"])?.params).toEqual({
      slug: "west-village",
    });
    expect(averyRouter.match(["insights"])?.pattern).toBe("/insights");
    expect(averyRouter.match(["insights", "the-art-of-pricing"])?.params).toEqual({
      slug: "the-art-of-pricing",
    });
    expect(averyRouter.match(["blog"])?.pattern).toBe("/blog");
    expect(averyRouter.match(["valuation"])?.pattern).toBe("/valuation");
    expect(averyRouter.match(["before-after"])?.pattern).toBe("/before-after");
    expect(averyRouter.match(["concierge"])?.pattern).toBe("/concierge");
    expect(averyRouter.match(["testimonials"])?.pattern).toBe("/testimonials");
    expect(averyRouter.match(["resources"])?.pattern).toBe("/resources");
    expect(averyRouter.match(["buyers-guide"])?.pattern).toBe("/buyers-guide");
    expect(averyRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(averyRouter.match(["sitemap"])).toBeNull();
    expect(averyRouter.match(["sitemap.xml"])).toBeNull();
    expect(averyRouter.match(["robots.txt"])).toBeNull();
    expect(averyRouter.match(["missing"])).toBeNull();
  });

  it("does not let the property detail route steal named listing paths", () => {
    expect(averyRouter.match(["properties", "sale"])?.pattern).toBe(
      "/properties/sale",
    );
    expect(averyRouter.match(["properties", "sold"])?.pattern).toBe(
      "/properties/sold",
    );
  });

  it("marks listing surfaces as property routes", () => {
    expect(averyRouter.isPropertyRoute("/properties")).toBe(true);
    expect(averyRouter.isPropertyRoute("/properties/sale")).toBe(true);
    expect(averyRouter.isPropertyRoute("/properties/sold")).toBe(true);
    expect(averyRouter.isPropertyRoute("/properties/[slug]")).toBe(true);
    expect(averyRouter.isPropertyRoute("/search")).toBe(true);
    expect(averyRouter.isPropertyRoute("/about")).toBe(false);
    expect(averyRouter.isPropertyRoute("/neighborhoods")).toBe(false);
    expect(averyRouter.isPropertyRoute("/blog")).toBe(false);
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: AverySettingsSchema,
      routes: [
        {
          path: "/",
          Page: AveryHomePage,
          contentSchema: AveryHomeContentSchema,
          defaultContent: averyHomeDefaultContent,
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
    expect(WEBSITE_TEMPLATES.some((template) => template.id === "avery")).toBe(
      true,
    );
    expect(TEMPLATE_REGISTRY.avery).toBe(averyRouter);
  });

  it("renders every static route and catalog detail from defaults", () => {
    const listing = {
      ...newWebsiteProperty(0),
      slug: "park-avenue-residence",
      status: "for_sale" as const,
      title: "860 Park Avenue, Residence 9B",
      address: "860 Park Avenue, Residence 9B",
      neighborhood: "Upper East Side",
      city: "New York",
      region: "NY",
      priceAmount: 4_850_000,
      bedrooms: 3,
      bathrooms: 3.5,
      livingArea: 2420,
      isVisible: true,
      description: "A luminous prewar residence.",
      images: ["https://example.com/park.jpg"],
    };
    const sold = {
      ...listing,
      slug: "west-village-penthouse",
      status: "sold" as const,
    };

    const paths = [
      undefined,
      ["about"],
      ["properties"],
      ["properties", "sale"],
      ["properties", "sold"],
      ["search"],
      ["neighborhoods"],
      ["neighborhoods", "west-village"],
      ["insights"],
      ["insights", blogPostSlug(samplePost)],
      ["blog"],
      ["valuation"],
      ["before-after"],
      ["concierge"],
      ["testimonials"],
      ["resources"],
      ["buyers-guide"],
      ["contact"],
    ] as const;

    for (const path of paths) {
      const match = averyRouter.match(path ? [...path] : undefined);
      expect(match, `missing route for ${path?.join("/") ?? "/"}`).not.toBeNull();
      expect(() =>
        averyRouter.render({
          match: match!,
          site,
          rawContent: null,
          properties: [listing, sold],
          blogPosts: [samplePost],
        }),
      ).not.toThrow();
    }

    const propertyMatch = averyRouter.match(["properties", listing.slug]);
    expect(propertyMatch).not.toBeNull();
    expect(() =>
      averyRouter.render({
        match: propertyMatch!,
        site,
        rawContent: null,
        properties: [listing, sold],
      }),
    ).not.toThrow();
  });
});
