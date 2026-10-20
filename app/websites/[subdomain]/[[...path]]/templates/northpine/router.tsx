import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { NorthpineAboutPage } from "./pages/about-us/about-us";
import {
  NorthpineAboutContentSchema,
  northpineAboutDefaultContent,
} from "./pages/about-us/schema";
import { NorthpineAgentPage } from "./pages/agent/agent";
import {
  NorthpineAgentContentSchema,
  northpineAgentDefaultContent,
} from "./pages/agent/schema";
import { NorthpineAttractionPage } from "./pages/attraction/attraction";
import {
  NorthpineAttractionContentSchema,
  northpineAttractionDefaultContent,
} from "./pages/attraction/schema";
import { NorthpineBuyerGuidePage } from "./pages/buyer-guide/buyer-guide";
import {
  NorthpineGuideContentSchema,
  northpineBuyerGuideDefaultContent,
} from "./pages/buyer-guide/schema";
import { NorthpineCommunitiesPage } from "./pages/communities/communities";
import {
  NorthpineCommunitiesContentSchema,
  northpineCommunitiesDefaultContent,
} from "./pages/communities/schema";
import { NorthpineCommunityPage } from "./pages/community/community";
import {
  NorthpineCommunityContentSchema,
  northpineCommunityDefaultContent,
} from "./pages/community/schema";
import { NorthpineContactPage } from "./pages/contact/contact";
import {
  NorthpineContactContentSchema,
  northpineContactDefaultContent,
} from "./pages/contact/schema";
import { NorthpineDreamHomePage } from "./pages/dream-home/dream-home";
import {
  NorthpineLeadContentSchema,
  northpineDreamHomeDefaultContent,
} from "./pages/dream-home/schema";
import { NorthpineFinanceGuidePage } from "./pages/finance-guide/finance-guide";
import { northpineFinanceGuideDefaultContent } from "./pages/finance-guide/schema";
import { NorthpineHomePage } from "./pages/home/home";
import {
  NorthpineHomeContentSchema,
  northpineHomeDefaultContent,
} from "./pages/home/schema";
import { NorthpineHomeWorthPage } from "./pages/home-worth/home-worth";
import { northpineHomeWorthDefaultContent } from "./pages/home-worth/schema";
import { NorthpineHometownPage } from "./pages/hometown/hometown";
import {
  NorthpineHometownContentSchema,
  northpineHometownDefaultContent,
} from "./pages/hometown/schema";
import { NorthpineJournalPage } from "./pages/journal/journal";
import {
  NorthpineJournalContentSchema,
  northpineJournalDefaultContent,
} from "./pages/journal/schema";
import { NorthpineJournalPostPage } from "./pages/journal-post/journal-post";
import {
  NorthpineJournalPostContentSchema,
  northpineJournalPostDefaultContent,
} from "./pages/journal-post/schema";
import { NorthpineListingsPage } from "./pages/listings/listings";
import {
  NorthpineListingsContentSchema,
  northpineListingsDefaultContent,
} from "./pages/listings/schema";
import { NorthpineLoginPage } from "./pages/login/login";
import {
  NorthpineLoginContentSchema,
  northpineLoginDefaultContent,
} from "./pages/login/schema";
import { NorthpineMapSearchPage } from "./pages/map-search/map-search";
import {
  NorthpineMapSearchContentSchema,
  northpineMapSearchDefaultContent,
} from "./pages/map-search/schema";
import { NorthpineMarketingPage } from "./pages/marketing/marketing";
import {
  NorthpineMarketingContentSchema,
  northpineMarketingDefaultContent,
} from "./pages/marketing/schema";
import { NorthpineMovingPage } from "./pages/moving-checklist/moving-checklist";
import {
  NorthpineMovingContentSchema,
  northpineMovingDefaultContent,
} from "./pages/moving-checklist/schema";
import { NorthpinePackingPage } from "./pages/packing-tips/packing-tips";
import {
  NorthpinePackingContentSchema,
  northpinePackingDefaultContent,
} from "./pages/packing-tips/schema";
import { NorthpinePartnersPage } from "./pages/preferred-partners/preferred-partners";
import {
  NorthpinePartnersContentSchema,
  northpinePartnersDefaultContent,
} from "./pages/preferred-partners/schema";
import { NorthpinePropertyPage } from "./pages/property/property";
import {
  NorthpinePropertyContentSchema,
  northpinePropertyDefaultContent,
} from "./pages/property/schema";
import { NorthpinePublicServicesPage } from "./pages/public-services/public-services";
import {
  NorthpinePublicServicesContentSchema,
  northpinePublicServicesDefaultContent,
} from "./pages/public-services/schema";
import { NorthpineRelocatePage } from "./pages/relocate/relocate";
import { northpineRelocateDefaultContent } from "./pages/relocate/schema";
import { NorthpineSearchPage } from "./pages/search/search";
import {
  NorthpineSearchContentSchema,
  northpineSearchDefaultContent,
} from "./pages/search/schema";
import { NorthpineSellerGuidePage } from "./pages/seller-guide/seller-guide";
import { northpineSellerGuideDefaultContent } from "./pages/seller-guide/schema";
import { NorthpineSitemapPage } from "./pages/site-map/site-map";
import {
  NorthpineSitemapContentSchema,
  northpineSitemapDefaultContent,
} from "./pages/site-map/schema";
import { NorthpineSoldPage } from "./pages/sold/sold";
import {
  NorthpineSoldContentSchema,
  northpineSoldDefaultContent,
} from "./pages/sold/schema";
import { NorthpineTestimonialsPage } from "./pages/testimonials/testimonials";
import {
  NorthpineTestimonialsContentSchema,
  northpineTestimonialsDefaultContent,
} from "./pages/testimonials/schema";
import { NorthpineSettingsSchema } from "./settings";

/**
 * Northpine template router — mountain-market site from northpine-realty-template.
 * Owns this template's routes, schemas, and defaults.
 */
export const northpineRouter = createTemplateRouter({
  settingsSchema: NorthpineSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "posts",
  routes: [
    {
      path: "/",
      Page: NorthpineHomePage,
      contentSchema: NorthpineHomeContentSchema,
      defaultContent: northpineHomeDefaultContent,
    },
    {
      path: "/about-us",
      Page: NorthpineAboutPage,
      contentSchema: NorthpineAboutContentSchema,
      defaultContent: northpineAboutDefaultContent,
    },
    {
      path: "/agents/[slug]",
      Page: NorthpineAgentPage,
      contentSchema: NorthpineAgentContentSchema,
      defaultContent: northpineAgentDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.team),
    },
    {
      path: "/about-my-hometown",
      Page: NorthpineHometownPage,
      contentSchema: NorthpineHometownContentSchema,
      defaultContent: northpineHometownDefaultContent,
    },
    {
      path: "/testimonials",
      Page: NorthpineTestimonialsPage,
      contentSchema: NorthpineTestimonialsContentSchema,
      defaultContent: northpineTestimonialsDefaultContent,
    },
    {
      path: "/homes-for-sale-featured",
      isPropertyRoute: true,
      Page: NorthpineListingsPage,
      contentSchema: NorthpineListingsContentSchema,
      defaultContent: northpineListingsDefaultContent,
    },
    {
      path: "/sold-featured-listing",
      isPropertyRoute: true,
      Page: NorthpineSoldPage,
      contentSchema: NorthpineSoldContentSchema,
      defaultContent: northpineSoldDefaultContent,
    },
    {
      path: "/property/[slug]",
      isPropertyRoute: true,
      Page: NorthpinePropertyPage,
      contentSchema: NorthpinePropertyContentSchema,
      defaultContent: northpinePropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/communities",
      Page: NorthpineCommunitiesPage,
      contentSchema: NorthpineCommunitiesContentSchema,
      defaultContent: northpineCommunitiesDefaultContent,
    },
    {
      path: "/community-resources",
      Page: NorthpineCommunitiesPage,
      contentSchema: NorthpineCommunitiesContentSchema,
      defaultContent: northpineCommunitiesDefaultContent,
    },
    {
      path: "/community/[slug]",
      Page: NorthpineCommunityPage,
      contentSchema: NorthpineCommunityContentSchema,
      defaultContent: northpineCommunityDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.communities),
    },
    {
      path: "/homes-for-sale-search-advanced",
      isPropertyRoute: true,
      Page: NorthpineSearchPage,
      contentSchema: NorthpineSearchContentSchema,
      defaultContent: northpineSearchDefaultContent,
    },
    {
      path: "/homes-for-sale-search",
      isPropertyRoute: true,
      Page: NorthpineSearchPage,
      contentSchema: NorthpineSearchContentSchema,
      defaultContent: northpineSearchDefaultContent,
    },
    {
      path: "/search",
      isPropertyRoute: true,
      Page: NorthpineSearchPage,
      contentSchema: NorthpineSearchContentSchema,
      defaultContent: northpineSearchDefaultContent,
    },
    {
      path: "/homes-for-sale-map-search",
      isPropertyRoute: true,
      Page: NorthpineMapSearchPage,
      contentSchema: NorthpineMapSearchContentSchema,
      defaultContent: northpineMapSearchDefaultContent,
    },
    {
      path: "/user-login",
      isPropertyRoute: true,
      Page: NorthpineLoginPage,
      contentSchema: NorthpineLoginContentSchema,
      defaultContent: northpineLoginDefaultContent,
    },
    {
      path: "/sellers",
      Page: NorthpineSellerGuidePage,
      contentSchema: NorthpineGuideContentSchema,
      defaultContent: northpineSellerGuideDefaultContent,
    },
    {
      path: "/sellers/[slug]",
      Page: NorthpineSellerGuidePage,
      contentSchema: NorthpineGuideContentSchema,
      defaultContent: northpineSellerGuideDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.sellerGuides),
    },
    {
      path: "/buyers",
      Page: NorthpineBuyerGuidePage,
      contentSchema: NorthpineGuideContentSchema,
      defaultContent: northpineBuyerGuideDefaultContent,
    },
    {
      path: "/buyers/[slug]",
      Page: NorthpineBuyerGuidePage,
      contentSchema: NorthpineGuideContentSchema,
      defaultContent: northpineBuyerGuideDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.buyerGuides),
    },
    {
      path: "/financing-options",
      Page: NorthpineFinanceGuidePage,
      contentSchema: NorthpineGuideContentSchema,
      defaultContent: northpineFinanceGuideDefaultContent,
    },
    {
      path: "/financing-options/[slug]",
      Page: NorthpineFinanceGuidePage,
      contentSchema: NorthpineGuideContentSchema,
      defaultContent: northpineFinanceGuideDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.financeGuides),
    },
    {
      path: "/marketing",
      Page: NorthpineMarketingPage,
      contentSchema: NorthpineMarketingContentSchema,
      defaultContent: northpineMarketingDefaultContent,
    },
    {
      path: "/packing-tips",
      Page: NorthpinePackingPage,
      contentSchema: NorthpinePackingContentSchema,
      defaultContent: northpinePackingDefaultContent,
    },
    {
      path: "/moving-checklist",
      Page: NorthpineMovingPage,
      contentSchema: NorthpineMovingContentSchema,
      defaultContent: northpineMovingDefaultContent,
    },
    {
      path: "/public-services",
      Page: NorthpinePublicServicesPage,
      contentSchema: NorthpinePublicServicesContentSchema,
      defaultContent: northpinePublicServicesDefaultContent,
    },
    {
      path: "/preferred-partners",
      Page: NorthpinePartnersPage,
      contentSchema: NorthpinePartnersContentSchema,
      defaultContent: northpinePartnersDefaultContent,
    },
    {
      path: "/category/blog",
      isBlogRoute: true,
      Page: NorthpineJournalPage,
      contentSchema: NorthpineJournalContentSchema,
      defaultContent: northpineJournalDefaultContent,
    },
    {
      path: "/blog",
      isBlogRoute: true,
      Page: NorthpineJournalPage,
      contentSchema: NorthpineJournalContentSchema,
      defaultContent: northpineJournalDefaultContent,
    },
    {
      path: "/blog/[slug]",
      isBlogRoute: true,
      Page: NorthpineJournalPostPage,
      contentSchema: NorthpineJournalPostContentSchema,
      defaultContent: northpineJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/contact",
      Page: NorthpineContactPage,
      contentSchema: NorthpineContactContentSchema,
      defaultContent: northpineContactDefaultContent,
    },
    {
      path: "/my-calendar",
      Page: NorthpineContactPage,
      contentSchema: NorthpineContactContentSchema,
      defaultContent: northpineContactDefaultContent,
    },
    {
      path: "/home-worth",
      Page: NorthpineHomeWorthPage,
      contentSchema: NorthpineLeadContentSchema,
      defaultContent: northpineHomeWorthDefaultContent,
    },
    {
      path: "/what-is-my-home-worth",
      Page: NorthpineHomeWorthPage,
      contentSchema: NorthpineLeadContentSchema,
      defaultContent: northpineHomeWorthDefaultContent,
    },
    {
      path: "/dream-home",
      Page: NorthpineDreamHomePage,
      contentSchema: NorthpineLeadContentSchema,
      defaultContent: northpineDreamHomeDefaultContent,
    },
    {
      path: "/find-my-dream-home",
      Page: NorthpineDreamHomePage,
      contentSchema: NorthpineLeadContentSchema,
      defaultContent: northpineDreamHomeDefaultContent,
    },
    {
      path: "/relocate",
      Page: NorthpineRelocatePage,
      contentSchema: NorthpineLeadContentSchema,
      defaultContent: northpineRelocateDefaultContent,
    },
    {
      path: "/help-me-relocate",
      Page: NorthpineRelocatePage,
      contentSchema: NorthpineLeadContentSchema,
      defaultContent: northpineRelocateDefaultContent,
    },
    {
      path: "/sitemap",
      Page: NorthpineSitemapPage,
      contentSchema: NorthpineSitemapContentSchema,
      defaultContent: northpineSitemapDefaultContent,
    },
    {
      path: "/[slug]",
      Page: NorthpineAttractionPage,
      contentSchema: NorthpineAttractionContentSchema,
      defaultContent: northpineAttractionDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.attractions),
    },
  ],
});
