import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { VossAboutPage } from "./pages/about/about";
import {
  VossAboutContentSchema,
  vossAboutDefaultContent,
} from "./pages/about/schema";
import { VossClosingCostsPage } from "./pages/closing-costs/closing-costs";
import {
  VossClosingCostsContentSchema,
  vossClosingCostsDefaultContent,
} from "./pages/closing-costs/schema";
import { VossContactPage } from "./pages/contact/contact";
import {
  VossContactContentSchema,
  vossContactDefaultContent,
} from "./pages/contact/schema";
import { VossHomePage } from "./pages/home/home";
import {
  VossHomeContentSchema,
  vossHomeDefaultContent,
} from "./pages/home/schema";
import { VossJournalPage } from "./pages/journal/journal";
import {
  VossJournalContentSchema,
  vossJournalDefaultContent,
} from "./pages/journal/schema";
import { VossJournalPostPage } from "./pages/journal-post/journal-post";
import {
  VossJournalPostContentSchema,
  vossJournalPostDefaultContent,
} from "./pages/journal-post/schema";
import { VossNeighborhoodsPage } from "./pages/neighborhoods/neighborhoods";
import {
  VossNeighborhoodsContentSchema,
  vossNeighborhoodsDefaultContent,
} from "./pages/neighborhoods/schema";
import { VossNewDevelopmentsPage } from "./pages/new-developments/new-developments";
import {
  VossNewDevelopmentsContentSchema,
  vossNewDevelopmentsDefaultContent,
} from "./pages/new-developments/schema";
import { VossPressPage } from "./pages/press/press";
import {
  VossPressContentSchema,
  vossPressDefaultContent,
} from "./pages/press/schema";
import { VossPropertiesPage } from "./pages/properties/properties";
import {
  VossPropertiesContentSchema,
  vossPropertiesDefaultContent,
} from "./pages/properties/schema";
import { VossPropertyPage } from "./pages/property/property";
import {
  VossPropertyContentSchema,
  vossPropertyDefaultContent,
} from "./pages/property/schema";
import { VossServicesPage } from "./pages/services/services";
import {
  VossServicesContentSchema,
  vossServicesDefaultContent,
} from "./pages/services/schema";
import { VossSettingsSchema } from "./settings";

/**
 * Voss template router — NYC private real estate site from mara-voss-real-estate.
 * Owns this template's routes, schemas, and defaults.
 */
export const vossRouter = createTemplateRouter({
  settingsSchema: VossSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "journal",
  routes: [
    {
      path: "/",
      Page: VossHomePage,
      contentSchema: VossHomeContentSchema,
      defaultContent: vossHomeDefaultContent,
    },
    {
      path: "/about",
      Page: VossAboutPage,
      contentSchema: VossAboutContentSchema,
      defaultContent: vossAboutDefaultContent,
    },
    {
      path: "/properties",
      isPropertyRoute: true,
      Page: VossPropertiesPage,
      contentSchema: VossPropertiesContentSchema,
      defaultContent: vossPropertiesDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: VossPropertyPage,
      contentSchema: VossPropertyContentSchema,
      defaultContent: vossPropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/services",
      Page: VossServicesPage,
      contentSchema: VossServicesContentSchema,
      defaultContent: vossServicesDefaultContent,
    },
    {
      path: "/new-developments",
      Page: VossNewDevelopmentsPage,
      contentSchema: VossNewDevelopmentsContentSchema,
      defaultContent: vossNewDevelopmentsDefaultContent,
    },
    {
      path: "/press",
      Page: VossPressPage,
      contentSchema: VossPressContentSchema,
      defaultContent: vossPressDefaultContent,
    },
    {
      path: "/guides/closing-costs",
      Page: VossClosingCostsPage,
      contentSchema: VossClosingCostsContentSchema,
      defaultContent: vossClosingCostsDefaultContent,
    },
    {
      path: "/neighborhoods",
      Page: VossNeighborhoodsPage,
      contentSchema: VossNeighborhoodsContentSchema,
      defaultContent: vossNeighborhoodsDefaultContent,
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: VossJournalPage,
      contentSchema: VossJournalContentSchema,
      defaultContent: vossJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: VossJournalPostPage,
      contentSchema: VossJournalPostContentSchema,
      defaultContent: vossJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/contact",
      Page: VossContactPage,
      contentSchema: VossContactContentSchema,
      defaultContent: vossContactDefaultContent,
    },
  ],
});
