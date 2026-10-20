import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { CoastalAboutPage } from "./pages/about/about";
import {
  CoastalAboutContentSchema,
  coastalAboutDefaultContent,
} from "./pages/about/schema";
import { CoastalBuyPage } from "./pages/buy/buy";
import {
  CoastalGuideContentSchema,
  coastalBuyDefaultContent,
} from "./pages/buy/schema";
import { CoastalCommunitiesPage } from "./pages/communities/communities";
import {
  CoastalCommunitiesContentSchema,
  coastalCommunitiesDefaultContent,
} from "./pages/communities/schema";
import { CoastalCommunityPage } from "./pages/community/community";
import {
  CoastalCommunityContentSchema,
  coastalCommunityDefaultContent,
} from "./pages/community/schema";
import { CoastalContactPage } from "./pages/contact/contact";
import {
  CoastalContactContentSchema,
  coastalContactDefaultContent,
} from "./pages/contact/schema";
import { CoastalFinancingPage } from "./pages/financing/financing";
import { coastalFinancingDefaultContent } from "./pages/financing/schema";
import { CoastalHomePage } from "./pages/home/home";
import {
  CoastalHomeContentSchema,
  coastalHomeDefaultContent,
} from "./pages/home/schema";
import { CoastalJournalPage } from "./pages/journal/journal";
import {
  CoastalJournalContentSchema,
  coastalJournalDefaultContent,
} from "./pages/journal/schema";
import { CoastalJournalPostPage } from "./pages/journal-post/journal-post";
import {
  CoastalJournalPostContentSchema,
  coastalJournalPostDefaultContent,
} from "./pages/journal-post/schema";
import { CoastalListingPage } from "./pages/listing/listing";
import {
  CoastalListingContentSchema,
  coastalListingDefaultContent,
} from "./pages/listing/schema";
import { CoastalListingsPage } from "./pages/listings/listings";
import {
  CoastalListingsContentSchema,
  coastalListingsDefaultContent,
} from "./pages/listings/schema";
import { CoastalMapPage } from "./pages/map/map";
import {
  CoastalMapContentSchema,
  coastalMapDefaultContent,
} from "./pages/map/schema";
import { CoastalMediaPage } from "./pages/media/media";
import {
  CoastalMediaContentSchema,
  coastalMediaDefaultContent,
} from "./pages/media/schema";
import { CoastalPrivacyPage } from "./pages/privacy/privacy";
import {
  CoastalPrivacyContentSchema,
  coastalPrivacyDefaultContent,
} from "./pages/privacy/schema";
import { CoastalSearchPage } from "./pages/search/search";
import {
  CoastalSearchContentSchema,
  coastalSearchDefaultContent,
} from "./pages/search/schema";
import { CoastalSellPage } from "./pages/sell/sell";
import { coastalSellDefaultContent } from "./pages/sell/schema";
import { CoastalSoldPage } from "./pages/sold/sold";
import {
  CoastalSoldContentSchema,
  coastalSoldDefaultContent,
} from "./pages/sold/schema";
import { CoastalTeamPage } from "./pages/team/team";
import {
  CoastalTeamContentSchema,
  coastalTeamDefaultContent,
} from "./pages/team/schema";
import { CoastalTestimonialsPage } from "./pages/testimonials/testimonials";
import {
  CoastalTestimonialsContentSchema,
  coastalTestimonialsDefaultContent,
} from "./pages/testimonials/schema";
import { CoastalValuationPage } from "./pages/valuation/valuation";
import {
  CoastalValuationContentSchema,
  coastalValuationDefaultContent,
} from "./pages/valuation/schema";
import { CoastalVideoPage } from "./pages/video/video";
import {
  CoastalVideoContentSchema,
  coastalVideoDefaultContent,
} from "./pages/video/schema";
import { CoastalSettingsSchema } from "./settings";

/**
 * Coastal template router — Vale Coastal Estates from coastal-estate-template.
 * Static nested paths are registered before dynamic `[slug]` routes.
 * Reserved sitemap/robots paths are intentionally omitted.
 */
export const coastalRouter = createTemplateRouter({
  settingsSchema: CoastalSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "posts",
  routes: [
    {
      path: "/",
      Page: CoastalHomePage,
      contentSchema: CoastalHomeContentSchema,
      defaultContent: coastalHomeDefaultContent,
    },
    {
      path: "/about",
      Page: CoastalAboutPage,
      contentSchema: CoastalAboutContentSchema,
      defaultContent: coastalAboutDefaultContent,
    },
    {
      path: "/team",
      Page: CoastalTeamPage,
      contentSchema: CoastalTeamContentSchema,
      defaultContent: coastalTeamDefaultContent,
    },
    {
      path: "/testimonials",
      Page: CoastalTestimonialsPage,
      contentSchema: CoastalTestimonialsContentSchema,
      defaultContent: coastalTestimonialsDefaultContent,
    },
    {
      path: "/listings",
      isPropertyRoute: true,
      Page: CoastalListingsPage,
      contentSchema: CoastalListingsContentSchema,
      defaultContent: coastalListingsDefaultContent,
    },
    {
      path: "/listings/[slug]",
      isPropertyRoute: true,
      Page: CoastalListingPage,
      contentSchema: CoastalListingContentSchema,
      defaultContent: coastalListingDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/sold",
      isPropertyRoute: true,
      Page: CoastalSoldPage,
      contentSchema: CoastalSoldContentSchema,
      defaultContent: coastalSoldDefaultContent,
    },
    {
      path: "/buy",
      Page: CoastalBuyPage,
      contentSchema: CoastalGuideContentSchema,
      defaultContent: coastalBuyDefaultContent,
    },
    {
      path: "/buy/[slug]",
      Page: CoastalBuyPage,
      contentSchema: CoastalGuideContentSchema,
      defaultContent: coastalBuyDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.buyerSteps),
    },
    {
      path: "/sell",
      Page: CoastalSellPage,
      contentSchema: CoastalGuideContentSchema,
      defaultContent: coastalSellDefaultContent,
    },
    {
      path: "/sell/[slug]",
      Page: CoastalSellPage,
      contentSchema: CoastalGuideContentSchema,
      defaultContent: coastalSellDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.sellerSteps),
    },
    {
      path: "/financing",
      Page: CoastalFinancingPage,
      contentSchema: CoastalGuideContentSchema,
      defaultContent: coastalFinancingDefaultContent,
    },
    {
      path: "/financing/[slug]",
      Page: CoastalFinancingPage,
      contentSchema: CoastalGuideContentSchema,
      defaultContent: coastalFinancingDefaultContent,
      previewParams: (settings) =>
        slugPreviewParams(settings.catalog.financingSteps),
    },
    {
      path: "/communities",
      Page: CoastalCommunitiesPage,
      contentSchema: CoastalCommunitiesContentSchema,
      defaultContent: coastalCommunitiesDefaultContent,
    },
    {
      path: "/communities/[slug]",
      Page: CoastalCommunityPage,
      contentSchema: CoastalCommunityContentSchema,
      defaultContent: coastalCommunityDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.communities),
    },
    {
      path: "/search",
      isPropertyRoute: true,
      Page: CoastalSearchPage,
      contentSchema: CoastalSearchContentSchema,
      defaultContent: coastalSearchDefaultContent,
    },
    {
      path: "/map",
      Page: CoastalMapPage,
      contentSchema: CoastalMapContentSchema,
      defaultContent: coastalMapDefaultContent,
    },
    {
      path: "/valuation",
      Page: CoastalValuationPage,
      contentSchema: CoastalValuationContentSchema,
      defaultContent: coastalValuationDefaultContent,
    },
    {
      path: "/video",
      Page: CoastalVideoPage,
      contentSchema: CoastalVideoContentSchema,
      defaultContent: coastalVideoDefaultContent,
    },
    {
      path: "/media",
      Page: CoastalMediaPage,
      contentSchema: CoastalMediaContentSchema,
      defaultContent: coastalMediaDefaultContent,
    },
    {
      path: "/blog",
      isBlogRoute: true,
      Page: CoastalJournalPage,
      contentSchema: CoastalJournalContentSchema,
      defaultContent: coastalJournalDefaultContent,
    },
    {
      path: "/blog/[slug]",
      isBlogRoute: true,
      Page: CoastalJournalPostPage,
      contentSchema: CoastalJournalPostContentSchema,
      defaultContent: coastalJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/contact",
      Page: CoastalContactPage,
      contentSchema: CoastalContactContentSchema,
      defaultContent: coastalContactDefaultContent,
    },
    {
      path: "/privacy",
      Page: CoastalPrivacyPage,
      contentSchema: CoastalPrivacyContentSchema,
      defaultContent: coastalPrivacyDefaultContent,
    },
  ],
});
