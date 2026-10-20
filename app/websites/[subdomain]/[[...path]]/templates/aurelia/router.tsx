import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { AureliaAboutPage } from "./pages/about/about";
import {
  AureliaAboutContentSchema,
  aureliaAboutDefaultContent,
} from "./pages/about/schema";
import { AureliaAlliancePage } from "./pages/alliance/alliance";
import {
  AureliaAllianceContentSchema,
  aureliaAllianceDefaultContent,
} from "./pages/alliance/schema";
import { AureliaCommunitiesPage } from "./pages/communities/communities";
import {
  AureliaCommunitiesContentSchema,
  aureliaCommunitiesDefaultContent,
} from "./pages/communities/schema";
import { AureliaCommunityPage } from "./pages/community/community";
import {
  AureliaCommunityContentSchema,
  aureliaCommunityDefaultContent,
} from "./pages/community/schema";
import { AureliaContactPage } from "./pages/contact/contact";
import {
  AureliaContactContentSchema,
  aureliaContactDefaultContent,
} from "./pages/contact/schema";
import { AureliaGatedCommunitiesPage } from "./pages/gated-communities/gated-communities";
import {
  AureliaGatedCommunitiesContentSchema,
  aureliaGatedCommunitiesDefaultContent,
} from "./pages/gated-communities/schema";
import { AureliaGlobalPage } from "./pages/global/global";
import {
  AureliaGlobalContentSchema,
  aureliaGlobalDefaultContent,
} from "./pages/global/schema";
import { AureliaHomePage } from "./pages/home/home";
import {
  AureliaHomeContentSchema,
  aureliaHomeDefaultContent,
} from "./pages/home/schema";
import { AureliaHomeSearchPage } from "./pages/home-search/home-search";
import {
  AureliaHomeSearchContentSchema,
  aureliaHomeSearchDefaultContent,
} from "./pages/home-search/schema";
import { AureliaJournalPage } from "./pages/journal/journal";
import {
  AureliaJournalContentSchema,
  aureliaJournalDefaultContent,
} from "./pages/journal/schema";
import { AureliaJournalPostPage } from "./pages/journal-post/journal-post";
import {
  AureliaJournalPostContentSchema,
  aureliaJournalPostDefaultContent,
} from "./pages/journal-post/schema";
import { AureliaLeasesPage } from "./pages/leases/leases";
import {
  AureliaLeasesContentSchema,
  aureliaLeasesDefaultContent,
} from "./pages/leases/schema";
import { AureliaPressPage } from "./pages/press/press";
import {
  AureliaPressContentSchema,
  aureliaPressDefaultContent,
} from "./pages/press/schema";
import { AureliaPropertiesPage } from "./pages/properties/properties";
import {
  AureliaPropertiesContentSchema,
  aureliaPropertiesDefaultContent,
} from "./pages/properties/schema";
import { AureliaPropertyPage } from "./pages/property/property";
import {
  AureliaPropertyContentSchema,
  aureliaPropertyDefaultContent,
} from "./pages/property/schema";
import { AureliaSoldPage } from "./pages/sold/sold";
import {
  AureliaSoldContentSchema,
  aureliaSoldDefaultContent,
} from "./pages/sold/schema";
import { AureliaTestimonialsPage } from "./pages/testimonials/testimonials";
import {
  AureliaTestimonialsContentSchema,
  aureliaTestimonialsDefaultContent,
} from "./pages/testimonials/schema";
import { AureliaSettingsSchema } from "./settings";

/**
 * Aurelia template router — Los Angeles luxury editorial site.
 * Static nested property paths must be registered before `/properties/[slug]`.
 */
export const aureliaRouter = createTemplateRouter({
  settingsSchema: AureliaSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  emptyCatalogKeys: ["globalProperties"],
  legacyBlogCatalogKey: "articles",
  routes: [
    {
      path: "/",
      Page: AureliaHomePage,
      contentSchema: AureliaHomeContentSchema,
      defaultContent: aureliaHomeDefaultContent,
    },
    {
      path: "/about",
      Page: AureliaAboutPage,
      contentSchema: AureliaAboutContentSchema,
      defaultContent: aureliaAboutDefaultContent,
    },
    {
      path: "/properties",
      isPropertyRoute: true,
      Page: AureliaPropertiesPage,
      contentSchema: AureliaPropertiesContentSchema,
      defaultContent: aureliaPropertiesDefaultContent,
    },
    {
      path: "/properties/leases",
      isPropertyRoute: true,
      Page: AureliaLeasesPage,
      contentSchema: AureliaLeasesContentSchema,
      defaultContent: aureliaLeasesDefaultContent,
    },
    {
      path: "/properties/sold",
      isPropertyRoute: true,
      Page: AureliaSoldPage,
      contentSchema: AureliaSoldContentSchema,
      defaultContent: aureliaSoldDefaultContent,
    },
    {
      path: "/properties/global",
      isPropertyRoute: true,
      Page: AureliaGlobalPage,
      contentSchema: AureliaGlobalContentSchema,
      defaultContent: aureliaGlobalDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: AureliaPropertyPage,
      contentSchema: AureliaPropertyContentSchema,
      defaultContent: aureliaPropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/communities",
      Page: AureliaCommunitiesPage,
      contentSchema: AureliaCommunitiesContentSchema,
      defaultContent: aureliaCommunitiesDefaultContent,
    },
    {
      path: "/communities/[slug]",
      Page: AureliaCommunityPage,
      contentSchema: AureliaCommunityContentSchema,
      defaultContent: aureliaCommunityDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.communities),
    },
    {
      path: "/home-search",
      isPropertyRoute: true,
      Page: AureliaHomeSearchPage,
      contentSchema: AureliaHomeSearchContentSchema,
      defaultContent: aureliaHomeSearchDefaultContent,
    },
    {
      path: "/press",
      Page: AureliaPressPage,
      contentSchema: AureliaPressContentSchema,
      defaultContent: aureliaPressDefaultContent,
    },
    {
      path: "/testimonials",
      Page: AureliaTestimonialsPage,
      contentSchema: AureliaTestimonialsContentSchema,
      defaultContent: aureliaTestimonialsDefaultContent,
    },
    {
      path: "/gated-communities",
      isPropertyRoute: true,
      Page: AureliaGatedCommunitiesPage,
      contentSchema: AureliaGatedCommunitiesContentSchema,
      defaultContent: aureliaGatedCommunitiesDefaultContent,
    },
    {
      path: "/international-luxury-alliance",
      Page: AureliaAlliancePage,
      contentSchema: AureliaAllianceContentSchema,
      defaultContent: aureliaAllianceDefaultContent,
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: AureliaJournalPage,
      contentSchema: AureliaJournalContentSchema,
      defaultContent: aureliaJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: AureliaJournalPostPage,
      contentSchema: AureliaJournalPostContentSchema,
      defaultContent: aureliaJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/contact",
      Page: AureliaContactPage,
      contentSchema: AureliaContactContentSchema,
      defaultContent: aureliaContactDefaultContent,
    },
  ],
});
