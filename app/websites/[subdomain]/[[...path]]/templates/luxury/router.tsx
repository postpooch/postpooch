import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { LuxuryAboutPage } from "./pages/about/about";
import {
  LuxuryAboutContentSchema,
  luxuryAboutDefaultContent,
} from "./pages/about/schema";
import { LuxuryBlogPage } from "./pages/blog/blog";
import {
  LuxuryBlogContentSchema,
  luxuryBlogDefaultContent,
} from "./pages/blog/schema";
import { LuxuryBlogPostPage } from "./pages/blog-post/blog-post";
import {
  LuxuryBlogPostContentSchema,
  luxuryBlogPostDefaultContent,
} from "./pages/blog-post/schema";
import { LuxuryBrandStudioPage } from "./pages/brand-studio/brand-studio";
import {
  LuxuryBrandStudioContentSchema,
  luxuryBrandStudioDefaultContent,
} from "./pages/brand-studio/schema";
import { LuxuryContactPage } from "./pages/contact/contact";
import {
  LuxuryContactContentSchema,
  luxuryContactDefaultContent,
} from "./pages/contact/schema";
import { LuxuryDevelopmentPage } from "./pages/development/development";
import {
  LuxuryDevelopmentContentSchema,
  luxuryDevelopmentDefaultContent,
} from "./pages/development/schema";
import { LuxuryListingsPage } from "./pages/exclusive-listings/exclusive-listings";
import {
  LuxuryListingsContentSchema,
  luxuryListingsDefaultContent,
} from "./pages/exclusive-listings/schema";
import { LuxuryHomePage } from "./pages/home/home";
import {
  LuxuryHomeContentSchema,
  luxuryHomeDefaultContent,
} from "./pages/home/schema";
import { LuxuryHomeSearchPage } from "./pages/home-search/home-search";
import {
  LuxuryHomeSearchContentSchema,
  luxuryHomeSearchDefaultContent,
} from "./pages/home-search/schema";
import { LuxuryValuationPage } from "./pages/home-valuation/home-valuation";
import {
  LuxuryValuationContentSchema,
  luxuryValuationDefaultContent,
} from "./pages/home-valuation/schema";
import { LuxuryMarketingPage } from "./pages/bespoke-marketing/bespoke-marketing";
import {
  LuxuryMarketingContentSchema,
  luxuryMarketingDefaultContent,
} from "./pages/bespoke-marketing/schema";
import { LuxuryTeamPage } from "./pages/meet-the-support-staff/meet-the-support-staff";
import {
  LuxuryTeamContentSchema,
  luxuryTeamDefaultContent,
} from "./pages/meet-the-support-staff/schema";
import { LuxuryNeighborhoodPage } from "./pages/neighborhood/neighborhood";
import {
  LuxuryNeighborhoodContentSchema,
  luxuryNeighborhoodDefaultContent,
} from "./pages/neighborhood/schema";
import { LuxuryNeighborhoodsPage } from "./pages/neighborhoods/neighborhoods";
import {
  LuxuryNeighborhoodsContentSchema,
  luxuryNeighborhoodsDefaultContent,
} from "./pages/neighborhoods/schema";
import { LuxuryDevelopmentsPage } from "./pages/new-developments/new-developments";
import {
  LuxuryDevelopmentsContentSchema,
  luxuryDevelopmentsDefaultContent,
} from "./pages/new-developments/schema";
import { LuxuryPressPage } from "./pages/press/press";
import {
  LuxuryPressContentSchema,
  luxuryPressDefaultContent,
} from "./pages/press/schema";
import { LuxuryPrivacyPage } from "./pages/privacy/privacy";
import {
  LuxuryPrivacyContentSchema,
  luxuryPrivacyDefaultContent,
} from "./pages/privacy/schema";
import { LuxuryPropertyPage } from "./pages/property/property";
import {
  LuxuryPropertyContentSchema,
  luxuryPropertyDefaultContent,
} from "./pages/property/schema";
import { LuxurySalesPage } from "./pages/recent-sales/recent-sales";
import {
  LuxurySalesContentSchema,
  luxurySalesDefaultContent,
} from "./pages/recent-sales/schema";
import { LuxuryVideoGalleryPage } from "./pages/video-gallery/video-gallery";
import {
  LuxuryVideoGalleryContentSchema,
  luxuryVideoGalleryDefaultContent,
} from "./pages/video-gallery/schema";
import { LuxurySettingsSchema } from "./settings";

/**
 * Luxury realtor template router — routes, schemas, and defaults for the
 * multi-tenant luxury website experience.
 */
export const luxuryRouter = createTemplateRouter({
  settingsSchema: LuxurySettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "posts",
  routes: [
    {
      path: "/",
      Page: LuxuryHomePage,
      contentSchema: LuxuryHomeContentSchema,
      defaultContent: luxuryHomeDefaultContent,
    },
    {
      path: "/about",
      Page: LuxuryAboutPage,
      contentSchema: LuxuryAboutContentSchema,
      defaultContent: luxuryAboutDefaultContent,
    },
    {
      path: "/meet-the-support-staff",
      Page: LuxuryTeamPage,
      contentSchema: LuxuryTeamContentSchema,
      defaultContent: luxuryTeamDefaultContent,
    },
    {
      path: "/press",
      Page: LuxuryPressPage,
      contentSchema: LuxuryPressContentSchema,
      defaultContent: luxuryPressDefaultContent,
    },
    {
      path: "/bespoke-marketing",
      Page: LuxuryMarketingPage,
      contentSchema: LuxuryMarketingContentSchema,
      defaultContent: luxuryMarketingDefaultContent,
    },
    {
      path: "/exclusive-listings",
      isPropertyRoute: true,
      Page: LuxuryListingsPage,
      contentSchema: LuxuryListingsContentSchema,
      defaultContent: luxuryListingsDefaultContent,
    },
    {
      path: "/recent-sales",
      isPropertyRoute: true,
      Page: LuxurySalesPage,
      contentSchema: LuxurySalesContentSchema,
      defaultContent: luxurySalesDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: LuxuryPropertyPage,
      contentSchema: LuxuryPropertyContentSchema,
      defaultContent: luxuryPropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/home-search",
      isPropertyRoute: true,
      Page: LuxuryHomeSearchPage,
      contentSchema: LuxuryHomeSearchContentSchema,
      defaultContent: luxuryHomeSearchDefaultContent,
    },
    {
      path: "/home-valuation",
      Page: LuxuryValuationPage,
      contentSchema: LuxuryValuationContentSchema,
      defaultContent: luxuryValuationDefaultContent,
    },
    {
      path: "/new-developments",
      Page: LuxuryDevelopmentsPage,
      contentSchema: LuxuryDevelopmentsContentSchema,
      defaultContent: luxuryDevelopmentsDefaultContent,
    },
    {
      path: "/new-developments/[slug]",
      Page: LuxuryDevelopmentPage,
      contentSchema: LuxuryDevelopmentContentSchema,
      defaultContent: luxuryDevelopmentDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.developments),
    },
    {
      path: "/neighborhoods",
      Page: LuxuryNeighborhoodsPage,
      contentSchema: LuxuryNeighborhoodsContentSchema,
      defaultContent: luxuryNeighborhoodsDefaultContent,
    },
    {
      path: "/neighborhoods/[slug]",
      Page: LuxuryNeighborhoodPage,
      contentSchema: LuxuryNeighborhoodContentSchema,
      defaultContent: luxuryNeighborhoodDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.communities),
    },
    {
      path: "/video-gallery",
      Page: LuxuryVideoGalleryPage,
      contentSchema: LuxuryVideoGalleryContentSchema,
      defaultContent: luxuryVideoGalleryDefaultContent,
    },
    {
      path: "/blog",
      isBlogRoute: true,
      Page: LuxuryBlogPage,
      contentSchema: LuxuryBlogContentSchema,
      defaultContent: luxuryBlogDefaultContent,
    },
    {
      path: "/blog/[slug]",
      isBlogRoute: true,
      Page: LuxuryBlogPostPage,
      contentSchema: LuxuryBlogPostContentSchema,
      defaultContent: luxuryBlogPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/contact",
      Page: LuxuryContactPage,
      contentSchema: LuxuryContactContentSchema,
      defaultContent: luxuryContactDefaultContent,
    },
    {
      path: "/privacy",
      Page: LuxuryPrivacyPage,
      contentSchema: LuxuryPrivacyContentSchema,
      defaultContent: luxuryPrivacyDefaultContent,
    },
    {
      path: "/brand-studio",
      Page: LuxuryBrandStudioPage,
      contentSchema: LuxuryBrandStudioContentSchema,
      defaultContent: luxuryBrandStudioDefaultContent,
    },
  ],
});
