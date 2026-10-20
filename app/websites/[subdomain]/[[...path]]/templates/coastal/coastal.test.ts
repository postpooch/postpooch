import { describe, expect, it } from "vitest";

import { WEBSITE_TEMPLATES } from "@/app/websites/website-templates";
import { blogPostSlug } from "@/lib/websites/blog-post";
import { newWebsiteProperty } from "@/lib/websites/property";

import { createTemplateRouter } from "../create-template-router";
import { TEMPLATE_REGISTRY } from "../registry";
import { CoastalHomePage } from "./pages/home/home";
import {
  CoastalHomeContentSchema,
  coastalHomeDefaultContent,
} from "./pages/home/schema";
import { coastalRouter } from "./router";
import { CoastalSettingsSchema } from "./settings";

const site = {
  id: "site-1",
  profileId: "profile-1",
  subdomain: "coastal",
  template: "coastal",
  propertiesEnabled: true,
  blogPostsEnabled: true,
  settings: {},
};

const samplePost = {
  id: "00000000-0000-4000-8000-000000000001",
  title: "Preparing a Luxury Home for Market",
  subtitle: "A closer look at preparation.",
  text: "First paragraph.\n\nSecond paragraph.",
  createdAt: "2026-03-12T16:00:00.000Z",
};

describe("coastal template", () => {
  it("parses empty website settings with Vale Coastal Estates defaults", () => {
    const settings = CoastalSettingsSchema.parse({});
    expect(settings.agent.name).toBe("Alexandra Vale");
    expect(settings.agent.monogram).toBe("AV");
    expect(settings.brand.paper).toBe("#f4f0e9");
    expect(settings.catalog.properties).toHaveLength(6);
    expect(settings.catalog.communities).toHaveLength(3);
    expect(settings.catalog.posts).toHaveLength(3);
    expect(settings.catalog.testimonials).toHaveLength(6);
    expect(settings.catalog.buyerSteps).toHaveLength(6);
    expect(settings.catalog.sellerSteps).toHaveLength(5);
    expect(settings.catalog.financingSteps).toHaveLength(5);
    expect(settings.catalog.team).toHaveLength(3);
    expect(settings.navItems).toHaveLength(8);
  });

  it("empties the legacy property catalog after resolveSettings", () => {
    const resolved = coastalRouter.resolveSettings({}) as ReturnType<
      typeof CoastalSettingsSchema.parse
    >;
    expect(resolved.catalog.properties).toEqual([]);
    expect(() => coastalRouter.resolveSettings(resolved)).not.toThrow();
  });

  it("matches coastal-estate-template routes without reserved sitemap files", () => {
    expect(coastalRouter.match(undefined)?.pattern).toBe("/");
    expect(coastalRouter.match(["about"])?.pattern).toBe("/about");
    expect(coastalRouter.match(["team"])?.pattern).toBe("/team");
    expect(coastalRouter.match(["testimonials"])?.pattern).toBe("/testimonials");
    expect(coastalRouter.match(["listings"])?.pattern).toBe("/listings");
    expect(coastalRouter.match(["listings", "oceanfront-crescent"])).toEqual({
      pattern: "/listings/[slug]",
      params: { slug: "oceanfront-crescent" },
      routeIndex: expect.any(Number),
    });
    expect(coastalRouter.match(["sold"])?.pattern).toBe("/sold");
    expect(coastalRouter.match(["buy"])?.pattern).toBe("/buy");
    expect(coastalRouter.match(["buy", "deciding-to-buy"])?.params).toEqual({
      slug: "deciding-to-buy",
    });
    expect(coastalRouter.match(["sell"])?.pattern).toBe("/sell");
    expect(coastalRouter.match(["sell", "closing"])?.pattern).toBe("/sell/[slug]");
    expect(coastalRouter.match(["financing"])?.pattern).toBe("/financing");
    expect(coastalRouter.match(["financing", "pre-approval"])?.pattern).toBe(
      "/financing/[slug]",
    );
    expect(coastalRouter.match(["communities"])?.pattern).toBe("/communities");
    expect(coastalRouter.match(["communities", "newport-beach"])?.params).toEqual({
      slug: "newport-beach",
    });
    expect(coastalRouter.match(["search"])?.pattern).toBe("/search");
    expect(coastalRouter.match(["map"])?.pattern).toBe("/map");
    expect(coastalRouter.match(["valuation"])?.pattern).toBe("/valuation");
    expect(coastalRouter.match(["video"])?.pattern).toBe("/video");
    expect(coastalRouter.match(["media"])?.pattern).toBe("/media");
    expect(coastalRouter.match(["blog"])?.pattern).toBe("/blog");
    expect(
      coastalRouter.match(["blog", "preparing-a-luxury-home-for-market"])?.params,
    ).toEqual({ slug: "preparing-a-luxury-home-for-market" });
    expect(coastalRouter.match(["contact"])?.pattern).toBe("/contact");
    expect(coastalRouter.match(["privacy"])?.pattern).toBe("/privacy");
    expect(coastalRouter.match(["sitemap"])).toBeNull();
    expect(coastalRouter.match(["sitemap.xml"])).toBeNull();
    expect(coastalRouter.match(["robots.txt"])).toBeNull();
    expect(coastalRouter.match(["missing"])).toBeNull();
  });

  it("marks listing surfaces as property routes", () => {
    expect(coastalRouter.isPropertyRoute("/listings")).toBe(true);
    expect(coastalRouter.isPropertyRoute("/listings/[slug]")).toBe(true);
    expect(coastalRouter.isPropertyRoute("/sold")).toBe(true);
    expect(coastalRouter.isPropertyRoute("/search")).toBe(true);
    expect(coastalRouter.isPropertyRoute("/map")).toBe(false);
    expect(coastalRouter.isPropertyRoute("/about")).toBe(false);
  });

  it("renders home defaults without throwing", () => {
    const router = createTemplateRouter({
      settingsSchema: CoastalSettingsSchema,
      routes: [
        {
          path: "/",
          Page: CoastalHomePage,
          contentSchema: CoastalHomeContentSchema,
          defaultContent: coastalHomeDefaultContent,
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
    expect(WEBSITE_TEMPLATES.some((template) => template.id === "coastal")).toBe(
      true,
    );
    expect(TEMPLATE_REGISTRY.coastal).toBe(coastalRouter);
  });

  it("renders every static route and catalog detail from defaults", () => {
    const listing = {
      ...newWebsiteProperty(0),
      slug: "oceanfront-crescent",
      status: "for_sale" as const,
      title: "18 Oceanfront Crescent",
      address: "18 Oceanfront Crescent",
      city: "Newport Beach",
      region: "CA",
      priceAmount: 12_750_000,
      bedrooms: 5,
      bathrooms: 7,
      livingArea: 6480,
      isVisible: true,
      description: "A sculptural coastal residence.",
      images: ["https://example.com/oceanfront.jpg"],
    };
    const sold = {
      ...listing,
      slug: "lido-modern",
      status: "sold" as const,
    };

    const paths = [
      undefined,
      ["about"],
      ["team"],
      ["testimonials"],
      ["listings"],
      ["sold"],
      ["buy"],
      ["buy", "deciding-to-buy"],
      ["sell"],
      ["sell", "closing"],
      ["financing"],
      ["financing", "pre-approval"],
      ["communities"],
      ["communities", "newport-beach"],
      ["search"],
      ["map"],
      ["valuation"],
      ["video"],
      ["media"],
      ["blog"],
      ["blog", blogPostSlug(samplePost)],
      ["contact"],
      ["privacy"],
    ] as const;

    for (const path of paths) {
      const match = coastalRouter.match(path ? [...path] : undefined);
      expect(match, `missing route for ${path?.join("/") ?? "/"}`).not.toBeNull();
      expect(() =>
        coastalRouter.render({
          match: match!,
          site,
          rawContent: null,
          properties: [listing, sold],
          blogPosts: [samplePost],
        }),
      ).not.toThrow();
    }

    const propertyMatch = coastalRouter.match(["listings", listing.slug]);
    expect(propertyMatch).not.toBeNull();
    expect(() =>
      coastalRouter.render({
        match: propertyMatch!,
        site,
        rawContent: null,
        properties: [listing, sold],
      }),
    ).not.toThrow();
  });
});
