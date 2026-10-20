import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { AveryAboutPage } from "./pages/about/about";
import {
  AveryAboutContentSchema,
  averyAboutDefaultContent,
} from "./pages/about/schema";
import { AveryBeforeAfterPage } from "./pages/before-after/before-after";
import {
  AveryBeforeAfterContentSchema,
  averyBeforeAfterDefaultContent,
} from "./pages/before-after/schema";
import { AveryBuyersGuidePage } from "./pages/buyers-guide/buyers-guide";
import {
  AveryBuyersGuideContentSchema,
  averyBuyersGuideDefaultContent,
} from "./pages/buyers-guide/schema";
import { AveryConciergePage } from "./pages/concierge/concierge";
import {
  AveryConciergeContentSchema,
  averyConciergeDefaultContent,
} from "./pages/concierge/schema";
import { AveryContactPage } from "./pages/contact/contact";
import {
  AveryContactContentSchema,
  averyContactDefaultContent,
} from "./pages/contact/schema";
import { AveryHomePage } from "./pages/home/home";
import {
  AveryHomeContentSchema,
  averyHomeDefaultContent,
} from "./pages/home/schema";
import { AveryInsightPage } from "./pages/insight/insight";
import {
  AveryInsightContentSchema,
  averyInsightDefaultContent,
} from "./pages/insight/schema";
import { AveryInsightsPage } from "./pages/insights/insights";
import {
  AveryInsightsContentSchema,
  averyInsightsDefaultContent,
} from "./pages/insights/schema";
import { AveryListingsPage } from "./pages/listings/listings";
import {
  AveryListingsContentSchema,
  averyPropertiesDefaultContent,
  averySaleDefaultContent,
  averySoldDefaultContent,
} from "./pages/listings/schema";
import { AveryNeighborhoodPage } from "./pages/neighborhood/neighborhood";
import {
  AveryNeighborhoodContentSchema,
  averyNeighborhoodDefaultContent,
} from "./pages/neighborhood/schema";
import { AveryNeighborhoodsPage } from "./pages/neighborhoods/neighborhoods";
import {
  AveryNeighborhoodsContentSchema,
  averyNeighborhoodsDefaultContent,
} from "./pages/neighborhoods/schema";
import { AveryPropertyPage } from "./pages/property/property";
import {
  AveryPropertyContentSchema,
  averyPropertyDefaultContent,
} from "./pages/property/schema";
import { AveryResourcesPage } from "./pages/resources/resources";
import {
  AveryResourcesContentSchema,
  averyResourcesDefaultContent,
} from "./pages/resources/schema";
import { AverySearchPage } from "./pages/search/search";
import {
  AverySearchContentSchema,
  averySearchDefaultContent,
} from "./pages/search/schema";
import { AveryTestimonialsPage } from "./pages/testimonials/testimonials";
import {
  AveryTestimonialsContentSchema,
  averyTestimonialsDefaultContent,
} from "./pages/testimonials/schema";
import { AveryValuationPage } from "./pages/valuation/valuation";
import {
  AveryValuationContentSchema,
  averyValuationDefaultContent,
} from "./pages/valuation/schema";
import { AverySettingsSchema } from "./settings";

/**
 * Avery template router — editorial New York luxury site.
 * Static nested property paths must be registered before `/properties/[slug]`.
 * Reserved sitemap/robots paths are intentionally omitted.
 */
export const averyRouter = createTemplateRouter({
  settingsSchema: AverySettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "insights",
  routes: [
    {
      path: "/",
      Page: AveryHomePage,
      contentSchema: AveryHomeContentSchema,
      defaultContent: averyHomeDefaultContent,
    },
    {
      path: "/about",
      Page: AveryAboutPage,
      contentSchema: AveryAboutContentSchema,
      defaultContent: averyAboutDefaultContent,
    },
    {
      path: "/properties",
      isPropertyRoute: true,
      Page: AveryListingsPage,
      contentSchema: AveryListingsContentSchema,
      defaultContent: averyPropertiesDefaultContent,
    },
    {
      path: "/properties/sale",
      isPropertyRoute: true,
      Page: AveryListingsPage,
      contentSchema: AveryListingsContentSchema,
      defaultContent: averySaleDefaultContent,
    },
    {
      path: "/properties/sold",
      isPropertyRoute: true,
      Page: AveryListingsPage,
      contentSchema: AveryListingsContentSchema,
      defaultContent: averySoldDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: AveryPropertyPage,
      contentSchema: AveryPropertyContentSchema,
      defaultContent: averyPropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/search",
      isPropertyRoute: true,
      Page: AverySearchPage,
      contentSchema: AverySearchContentSchema,
      defaultContent: averySearchDefaultContent,
    },
    {
      path: "/neighborhoods",
      Page: AveryNeighborhoodsPage,
      contentSchema: AveryNeighborhoodsContentSchema,
      defaultContent: averyNeighborhoodsDefaultContent,
    },
    {
      path: "/neighborhoods/[slug]",
      Page: AveryNeighborhoodPage,
      contentSchema: AveryNeighborhoodContentSchema,
      defaultContent: averyNeighborhoodDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.neighborhoods),
    },
    {
      path: "/insights",
      isBlogRoute: true,
      Page: AveryInsightsPage,
      contentSchema: AveryInsightsContentSchema,
      defaultContent: averyInsightsDefaultContent,
    },
    {
      path: "/insights/[slug]",
      isBlogRoute: true,
      Page: AveryInsightPage,
      contentSchema: AveryInsightContentSchema,
      defaultContent: averyInsightDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/blog",
      isBlogRoute: true,
      Page: AveryInsightsPage,
      contentSchema: AveryInsightsContentSchema,
      defaultContent: averyInsightsDefaultContent,
    },
    {
      path: "/valuation",
      Page: AveryValuationPage,
      contentSchema: AveryValuationContentSchema,
      defaultContent: averyValuationDefaultContent,
    },
    {
      path: "/before-after",
      Page: AveryBeforeAfterPage,
      contentSchema: AveryBeforeAfterContentSchema,
      defaultContent: averyBeforeAfterDefaultContent,
    },
    {
      path: "/concierge",
      Page: AveryConciergePage,
      contentSchema: AveryConciergeContentSchema,
      defaultContent: averyConciergeDefaultContent,
    },
    {
      path: "/testimonials",
      Page: AveryTestimonialsPage,
      contentSchema: AveryTestimonialsContentSchema,
      defaultContent: averyTestimonialsDefaultContent,
    },
    {
      path: "/resources",
      Page: AveryResourcesPage,
      contentSchema: AveryResourcesContentSchema,
      defaultContent: averyResourcesDefaultContent,
    },
    {
      path: "/buyers-guide",
      Page: AveryBuyersGuidePage,
      contentSchema: AveryBuyersGuideContentSchema,
      defaultContent: averyBuyersGuideDefaultContent,
    },
    {
      path: "/contact",
      Page: AveryContactPage,
      contentSchema: AveryContactContentSchema,
      defaultContent: averyContactDefaultContent,
    },
  ],
});
