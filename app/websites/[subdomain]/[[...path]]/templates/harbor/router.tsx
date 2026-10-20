import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { HarborAboutPage } from "./pages/about/about";
import {
  HarborAboutContentSchema,
  harborAboutDefaultContent,
} from "./pages/about/schema";
import { HarborAiDisclosurePage } from "./pages/ai-disclosure/ai-disclosure";
import {
  HarborAiDisclosureContentSchema,
  harborAiDisclosureDefaultContent,
} from "./pages/ai-disclosure/schema";
import { HarborBuyPage } from "./pages/buy/buy";
import {
  HarborBuyContentSchema,
  harborBuyDefaultContent,
} from "./pages/buy/schema";
import { HarborCondoGuidePage } from "./pages/condo-guide/condo-guide";
import {
  HarborCondoGuideContentSchema,
  harborCondoGuideDefaultContent,
} from "./pages/condo-guide/schema";
import { HarborContactPage } from "./pages/contact/contact";
import {
  HarborContactContentSchema,
  harborContactDefaultContent,
} from "./pages/contact/schema";
import { HarborHomePage } from "./pages/home/home";
import {
  HarborHomeContentSchema,
  harborHomeDefaultContent,
} from "./pages/home/schema";
import { HarborHomeValuePage } from "./pages/home-value/home-value";
import {
  HarborHomeValueContentSchema,
  harborHomeValueDefaultContent,
} from "./pages/home-value/schema";
import { HarborJournalPage } from "./pages/journal/journal";
import {
  HarborJournalContentSchema,
  harborJournalDefaultContent,
} from "./pages/journal/schema";
import { HarborJournalPostPage } from "./pages/journal-post/journal-post";
import {
  HarborJournalPostContentSchema,
  harborJournalPostDefaultContent,
} from "./pages/journal-post/schema";
import { HarborListingPage } from "./pages/listing/listing";
import {
  HarborListingContentSchema,
  harborListingDefaultContent,
} from "./pages/listing/schema";
import { HarborListingsPage } from "./pages/listings/listings";
import {
  HarborListingsContentSchema,
  harborListingsDefaultContent,
} from "./pages/listings/schema";
import { HarborMarketReportPage } from "./pages/market-report/market-report";
import {
  HarborMarketReportContentSchema,
  harborMarketReportDefaultContent,
} from "./pages/market-report/schema";
import { HarborMarketingPage } from "./pages/marketing/marketing";
import {
  HarborMarketingContentSchema,
  harborMarketingDefaultContent,
} from "./pages/marketing/schema";
import { HarborPrivacyPage } from "./pages/privacy/privacy";
import {
  HarborPrivacyContentSchema,
  harborPrivacyDefaultContent,
} from "./pages/privacy/schema";
import { HarborReviewsPage } from "./pages/reviews/reviews";
import {
  HarborReviewsContentSchema,
  harborReviewsDefaultContent,
} from "./pages/reviews/schema";
import { HarborSellPage } from "./pages/sell/sell";
import {
  HarborSellContentSchema,
  harborSellDefaultContent,
} from "./pages/sell/schema";
import { HarborSettingsSchema } from "./settings";

/**
 * Harbor template router — Avery Rowan Toronto West real estate site
 * from harbor-house-realty. Owns this template's routes, schemas, and defaults.
 */
export const harborRouter = createTemplateRouter({
  settingsSchema: HarborSettingsSchema,
  legacyPropertyCatalogKey: "listings",
  legacyBlogCatalogKey: "posts",
  routes: [
    {
      path: "/",
      Page: HarborHomePage,
      contentSchema: HarborHomeContentSchema,
      defaultContent: harborHomeDefaultContent,
    },
    {
      path: "/sell",
      Page: HarborSellPage,
      contentSchema: HarborSellContentSchema,
      defaultContent: harborSellDefaultContent,
    },
    {
      path: "/buy",
      Page: HarborBuyPage,
      contentSchema: HarborBuyContentSchema,
      defaultContent: harborBuyDefaultContent,
    },
    {
      path: "/marketing",
      Page: HarborMarketingPage,
      contentSchema: HarborMarketingContentSchema,
      defaultContent: harborMarketingDefaultContent,
    },
    {
      path: "/listings",
      isPropertyRoute: true,
      Page: HarborListingsPage,
      contentSchema: HarborListingsContentSchema,
      defaultContent: harborListingsDefaultContent,
    },
    {
      path: "/listings/[slug]",
      isPropertyRoute: true,
      Page: HarborListingPage,
      contentSchema: HarborListingContentSchema,
      defaultContent: harborListingDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/about",
      Page: HarborAboutPage,
      contentSchema: HarborAboutContentSchema,
      defaultContent: harborAboutDefaultContent,
    },
    {
      path: "/reviews",
      Page: HarborReviewsPage,
      contentSchema: HarborReviewsContentSchema,
      defaultContent: harborReviewsDefaultContent,
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: HarborJournalPage,
      contentSchema: HarborJournalContentSchema,
      defaultContent: harborJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: HarborJournalPostPage,
      contentSchema: HarborJournalPostContentSchema,
      defaultContent: harborJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/condo-guide",
      Page: HarborCondoGuidePage,
      contentSchema: HarborCondoGuideContentSchema,
      defaultContent: harborCondoGuideDefaultContent,
    },
    {
      path: "/home-value",
      Page: HarborHomeValuePage,
      contentSchema: HarborHomeValueContentSchema,
      defaultContent: harborHomeValueDefaultContent,
    },
    {
      path: "/market-report",
      Page: HarborMarketReportPage,
      contentSchema: HarborMarketReportContentSchema,
      defaultContent: harborMarketReportDefaultContent,
    },
    {
      path: "/contact",
      Page: HarborContactPage,
      contentSchema: HarborContactContentSchema,
      defaultContent: harborContactDefaultContent,
    },
    {
      path: "/privacy",
      Page: HarborPrivacyPage,
      contentSchema: HarborPrivacyContentSchema,
      defaultContent: harborPrivacyDefaultContent,
    },
    {
      path: "/ai-disclosure",
      Page: HarborAiDisclosurePage,
      contentSchema: HarborAiDisclosureContentSchema,
      defaultContent: harborAiDisclosureDefaultContent,
    },
  ],
});
