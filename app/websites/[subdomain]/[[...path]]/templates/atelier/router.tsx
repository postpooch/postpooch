import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { AtelierAboutPage } from "./pages/about/about";
import {
  AtelierAboutContentSchema,
  atelierAboutDefaultContent,
} from "./pages/about/schema";
import { AtelierCommunitiesPage } from "./pages/communities/communities";
import {
  AtelierCommunitiesContentSchema,
  atelierCommunitiesDefaultContent,
} from "./pages/communities/schema";
import { AtelierCommunityPage } from "./pages/community/community";
import {
  AtelierCommunityContentSchema,
  atelierCommunityDefaultContent,
} from "./pages/community/schema";
import { AtelierContactPage } from "./pages/contact/contact";
import {
  AtelierContactContentSchema,
  atelierContactDefaultContent,
} from "./pages/contact/schema";
import { AtelierDevelopmentPage } from "./pages/development/development";
import {
  AtelierDevelopmentContentSchema,
  atelierDevelopmentDefaultContent,
} from "./pages/development/schema";
import { AtelierDevelopmentsPage } from "./pages/developments/developments";
import {
  AtelierDevelopmentsContentSchema,
  atelierDevelopmentsDefaultContent,
} from "./pages/developments/schema";
import { AtelierHomePage } from "./pages/home/home";
import {
  AtelierHomeContentSchema,
  atelierHomeDefaultContent,
} from "./pages/home/schema";
import { AtelierJournalPage } from "./pages/journal/journal";
import {
  AtelierJournalContentSchema,
  atelierJournalDefaultContent,
} from "./pages/journal/schema";
import { AtelierJournalPostPage } from "./pages/journal-post/journal-post";
import {
  AtelierJournalPostContentSchema,
  atelierJournalPostDefaultContent,
} from "./pages/journal-post/schema";
import { AtelierMarketingPage } from "./pages/marketing/marketing";
import {
  AtelierMarketingContentSchema,
  atelierMarketingDefaultContent,
} from "./pages/marketing/schema";
import { AtelierPressPage } from "./pages/press/press";
import {
  AtelierPressContentSchema,
  atelierPressDefaultContent,
} from "./pages/press/schema";
import { AtelierPropertiesPage } from "./pages/properties/properties";
import {
  AtelierPropertiesContentSchema,
  atelierPropertiesDefaultContent,
} from "./pages/properties/schema";
import { AtelierPropertyPage } from "./pages/property/property";
import {
  AtelierPropertyContentSchema,
  atelierPropertyDefaultContent,
} from "./pages/property/schema";
import { AtelierSalesPage } from "./pages/sales/sales";
import {
  AtelierSalesContentSchema,
  atelierSalesDefaultContent,
} from "./pages/sales/schema";
import { AtelierSearchPage } from "./pages/search/search";
import {
  AtelierSearchContentSchema,
  atelierSearchDefaultContent,
} from "./pages/search/schema";
import { AtelierTeamPage } from "./pages/team/team";
import {
  AtelierTeamContentSchema,
  atelierTeamDefaultContent,
} from "./pages/team/schema";
import { AtelierValuationPage } from "./pages/valuation/valuation";
import {
  AtelierValuationContentSchema,
  atelierValuationDefaultContent,
} from "./pages/valuation/schema";
import { AtelierVideosPage } from "./pages/videos/videos";
import {
  AtelierVideosContentSchema,
  atelierVideosDefaultContent,
} from "./pages/videos/schema";
import { AtelierSettingsSchema } from "./settings";

/**
 * Atelier template router — editorial luxury site from atelier-real-estate-template.
 * Owns this template's routes, schemas, and defaults.
 *
 * Intentionally omits Next.js reserved metadata routes (`sitemap.xml`, `robots.txt`)
 * so tenant delivery never collides with the host app sitemap/robots pipeline.
 */
export const atelierRouter = createTemplateRouter({
  settingsSchema: AtelierSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "posts",
  routes: [
    {
      path: "/",
      Page: AtelierHomePage,
      contentSchema: AtelierHomeContentSchema,
      defaultContent: atelierHomeDefaultContent,
    },
    {
      path: "/about",
      Page: AtelierAboutPage,
      contentSchema: AtelierAboutContentSchema,
      defaultContent: atelierAboutDefaultContent,
    },
    {
      path: "/team",
      Page: AtelierTeamPage,
      contentSchema: AtelierTeamContentSchema,
      defaultContent: atelierTeamDefaultContent,
    },
    {
      path: "/press",
      Page: AtelierPressPage,
      contentSchema: AtelierPressContentSchema,
      defaultContent: atelierPressDefaultContent,
    },
    {
      path: "/marketing",
      Page: AtelierMarketingPage,
      contentSchema: AtelierMarketingContentSchema,
      defaultContent: atelierMarketingDefaultContent,
    },
    {
      path: "/properties",
      isPropertyRoute: true,
      Page: AtelierPropertiesPage,
      contentSchema: AtelierPropertiesContentSchema,
      defaultContent: atelierPropertiesDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: AtelierPropertyPage,
      contentSchema: AtelierPropertyContentSchema,
      defaultContent: atelierPropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/sales",
      isPropertyRoute: true,
      Page: AtelierSalesPage,
      contentSchema: AtelierSalesContentSchema,
      defaultContent: atelierSalesDefaultContent,
    },
    {
      path: "/developments",
      Page: AtelierDevelopmentsPage,
      contentSchema: AtelierDevelopmentsContentSchema,
      defaultContent: atelierDevelopmentsDefaultContent,
    },
    {
      path: "/developments/[slug]",
      Page: AtelierDevelopmentPage,
      contentSchema: AtelierDevelopmentContentSchema,
      defaultContent: atelierDevelopmentDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.developments),
    },
    {
      path: "/valuation",
      Page: AtelierValuationPage,
      contentSchema: AtelierValuationContentSchema,
      defaultContent: atelierValuationDefaultContent,
    },
    {
      path: "/search",
      isPropertyRoute: true,
      Page: AtelierSearchPage,
      contentSchema: AtelierSearchContentSchema,
      defaultContent: atelierSearchDefaultContent,
    },
    {
      path: "/communities",
      Page: AtelierCommunitiesPage,
      contentSchema: AtelierCommunitiesContentSchema,
      defaultContent: atelierCommunitiesDefaultContent,
    },
    {
      path: "/communities/[slug]",
      Page: AtelierCommunityPage,
      contentSchema: AtelierCommunityContentSchema,
      defaultContent: atelierCommunityDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.communities),
    },
    {
      path: "/videos",
      Page: AtelierVideosPage,
      contentSchema: AtelierVideosContentSchema,
      defaultContent: atelierVideosDefaultContent,
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: AtelierJournalPage,
      contentSchema: AtelierJournalContentSchema,
      defaultContent: atelierJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: AtelierJournalPostPage,
      contentSchema: AtelierJournalPostContentSchema,
      defaultContent: atelierJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/contact",
      Page: AtelierContactPage,
      contentSchema: AtelierContactContentSchema,
      defaultContent: atelierContactDefaultContent,
    },
  ],
});
