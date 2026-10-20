import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { SloaneAboutPage } from "./pages/about/about";
import {
  SloaneAboutContentSchema,
  sloaneAboutDefaultContent,
} from "./pages/about/schema";
import { SloaneGuidePage } from "./pages/buying/buying";
import {
  SloaneGuideContentSchema,
  sloaneBuyingDefaultContent,
  sloaneFinancingDefaultContent,
  sloaneSellingDefaultContent,
} from "./pages/buying/schema";
import { SloaneCommunitiesPage } from "./pages/communities/communities";
import {
  SloaneCommunitiesContentSchema,
  sloaneCommunitiesDefaultContent,
} from "./pages/communities/schema";
import { SloaneCommunityPage } from "./pages/community/community";
import {
  SloaneCommunityContentSchema,
  sloaneCommunityDefaultContent,
} from "./pages/community/schema";
import { SloaneContactPage } from "./pages/contact/contact";
import {
  SloaneContactContentSchema,
  sloaneContactDefaultContent,
} from "./pages/contact/schema";
import { SloaneExclusivePage } from "./pages/exclusive/exclusive";
import { SloaneHomePage } from "./pages/home/home";
import {
  SloaneHomeContentSchema,
  sloaneHomeDefaultContent,
} from "./pages/home/schema";
import { SloaneJournalPage } from "./pages/journal/journal";
import {
  SloaneJournalContentSchema,
  sloaneJournalDefaultContent,
} from "./pages/journal/schema";
import { SloaneJournalPostPage } from "./pages/journal-post/journal-post";
import {
  SloaneJournalPostContentSchema,
  sloaneJournalPostDefaultContent,
} from "./pages/journal-post/schema";
import { SloaneLeasePage } from "./pages/lease/lease";
import { SloanePressPage } from "./pages/press/press";
import {
  SloanePressContentSchema,
  sloanePressDefaultContent,
} from "./pages/press/schema";
import { SloanePropertiesPage } from "./pages/properties/properties";
import {
  SloaneListingsContentSchema,
  sloaneExclusiveDefaultContent,
  sloaneLeaseDefaultContent,
  sloanePropertiesDefaultContent,
  sloaneSearchDefaultContent,
  sloaneSoldDefaultContent,
} from "./pages/properties/schema";
import { SloanePropertyPage } from "./pages/property/property";
import {
  SloanePropertyContentSchema,
  sloanePropertyDefaultContent,
} from "./pages/property/schema";
import { SloaneResourcesPage } from "./pages/resources/resources";
import {
  SloaneResourcesContentSchema,
  sloaneResourcesDefaultContent,
} from "./pages/resources/schema";
import { SloaneSearchPage } from "./pages/search/search";
import { SloaneSoldPage } from "./pages/sold/sold";
import { SloaneTeamPage } from "./pages/team/team";
import {
  SloaneTeamContentSchema,
  sloaneTeamDefaultContent,
} from "./pages/team/schema";
import { SloaneTestimonialsPage } from "./pages/testimonials/testimonials";
import {
  SloaneTestimonialsContentSchema,
  sloaneTestimonialsDefaultContent,
} from "./pages/testimonials/schema";
import { SloaneValuationPage } from "./pages/valuation/valuation";
import {
  SloaneValuationContentSchema,
  sloaneValuationDefaultContent,
} from "./pages/valuation/schema";
import { SloaneSettingsSchema } from "./settings";

/**
 * Sloane template router — editorial Los Angeles luxury practice site.
 * Static nested paths are registered before dynamic `[slug]` routes.
 * Reserved sitemap/robots paths are intentionally omitted.
 */
export const sloaneRouter = createTemplateRouter({
  settingsSchema: SloaneSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "posts",
  routes: [
    {
      path: "/",
      Page: SloaneHomePage,
      contentSchema: SloaneHomeContentSchema,
      defaultContent: sloaneHomeDefaultContent,
    },
    {
      path: "/about",
      Page: SloaneAboutPage,
      contentSchema: SloaneAboutContentSchema,
      defaultContent: sloaneAboutDefaultContent,
    },
    {
      path: "/team",
      Page: SloaneTeamPage,
      contentSchema: SloaneTeamContentSchema,
      defaultContent: sloaneTeamDefaultContent,
    },
    {
      path: "/testimonials",
      Page: SloaneTestimonialsPage,
      contentSchema: SloaneTestimonialsContentSchema,
      defaultContent: sloaneTestimonialsDefaultContent,
    },
    {
      path: "/press",
      Page: SloanePressPage,
      contentSchema: SloanePressContentSchema,
      defaultContent: sloanePressDefaultContent,
    },
    {
      path: "/properties",
      isPropertyRoute: true,
      Page: SloanePropertiesPage,
      contentSchema: SloaneListingsContentSchema,
      defaultContent: sloanePropertiesDefaultContent,
    },
    {
      path: "/properties/exclusive",
      isPropertyRoute: true,
      Page: SloaneExclusivePage,
      contentSchema: SloaneListingsContentSchema,
      defaultContent: sloaneExclusiveDefaultContent,
    },
    {
      path: "/properties/lease",
      isPropertyRoute: true,
      Page: SloaneLeasePage,
      contentSchema: SloaneListingsContentSchema,
      defaultContent: sloaneLeaseDefaultContent,
    },
    {
      path: "/properties/sold",
      isPropertyRoute: true,
      Page: SloaneSoldPage,
      contentSchema: SloaneListingsContentSchema,
      defaultContent: sloaneSoldDefaultContent,
    },
    {
      path: "/properties/search",
      isPropertyRoute: true,
      Page: SloaneSearchPage,
      contentSchema: SloaneListingsContentSchema,
      defaultContent: sloaneSearchDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: SloanePropertyPage,
      contentSchema: SloanePropertyContentSchema,
      defaultContent: sloanePropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/communities",
      Page: SloaneCommunitiesPage,
      contentSchema: SloaneCommunitiesContentSchema,
      defaultContent: sloaneCommunitiesDefaultContent,
    },
    {
      path: "/communities/[slug]",
      Page: SloaneCommunityPage,
      contentSchema: SloaneCommunityContentSchema,
      defaultContent: sloaneCommunityDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.communities),
    },
    {
      path: "/resources",
      Page: SloaneResourcesPage,
      contentSchema: SloaneResourcesContentSchema,
      defaultContent: sloaneResourcesDefaultContent,
    },
    {
      path: "/resources/buying",
      Page: SloaneGuidePage,
      contentSchema: SloaneGuideContentSchema,
      defaultContent: sloaneBuyingDefaultContent,
    },
    {
      path: "/resources/selling",
      Page: SloaneGuidePage,
      contentSchema: SloaneGuideContentSchema,
      defaultContent: sloaneSellingDefaultContent,
    },
    {
      path: "/resources/financing",
      Page: SloaneGuidePage,
      contentSchema: SloaneGuideContentSchema,
      defaultContent: sloaneFinancingDefaultContent,
    },
    {
      path: "/resources/valuation",
      Page: SloaneValuationPage,
      contentSchema: SloaneValuationContentSchema,
      defaultContent: sloaneValuationDefaultContent,
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: SloaneJournalPage,
      contentSchema: SloaneJournalContentSchema,
      defaultContent: sloaneJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: SloaneJournalPostPage,
      contentSchema: SloaneJournalPostContentSchema,
      defaultContent: sloaneJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/contact",
      Page: SloaneContactPage,
      contentSchema: SloaneContactContentSchema,
      defaultContent: sloaneContactDefaultContent,
    },
  ],
});
