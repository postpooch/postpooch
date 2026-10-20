import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { RoweAboutPage } from "./pages/about/about";
import {
  RoweAboutContentSchema,
  roweAboutDefaultContent,
} from "./pages/about/schema";
import { RoweContactPage } from "./pages/contact/contact";
import {
  RoweContactContentSchema,
  roweContactDefaultContent,
} from "./pages/contact/schema";
import { RoweHomePage } from "./pages/home/home";
import {
  RoweHomeContentSchema,
  roweHomeDefaultContent,
} from "./pages/home/schema";
import { RoweJournalPage } from "./pages/journal/journal";
import {
  RoweJournalContentSchema,
  roweJournalDefaultContent,
} from "./pages/journal/schema";
import { RoweJournalEntryPage } from "./pages/journal-entry/journal-entry";
import {
  RoweJournalEntryContentSchema,
  roweJournalEntryDefaultContent,
} from "./pages/journal-entry/schema";
import { RowePrivacyPage } from "./pages/privacy/privacy";
import {
  RowePrivacyContentSchema,
  rowePrivacyDefaultContent,
} from "./pages/privacy/schema";
import { RowePropertiesPage } from "./pages/properties/properties";
import {
  RowePropertiesContentSchema,
  rowePropertiesDefaultContent,
} from "./pages/properties/schema";
import { RowePropertyPage } from "./pages/property/property";
import {
  RowePropertyContentSchema,
  rowePropertyDefaultContent,
} from "./pages/property/schema";
import { RoweServicePage } from "./pages/service/service";
import {
  RoweServiceContentSchema,
  roweServiceDefaultContent,
} from "./pages/service/schema";
import { RoweServicesPage } from "./pages/services/services";
import {
  RoweServicesContentSchema,
  roweServicesDefaultContent,
} from "./pages/services/schema";
import { RoweSettingsSchema } from "./settings";

/**
 * Rowe template router — Avery Rowe private real estate site from estate-agent-site.
 * Owns this template's routes, schemas, and defaults.
 */
export const roweRouter = createTemplateRouter({
  settingsSchema: RoweSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "journal",
  routes: [
    {
      path: "/",
      Page: RoweHomePage,
      contentSchema: RoweHomeContentSchema,
      defaultContent: roweHomeDefaultContent,
    },
    {
      path: "/about",
      Page: RoweAboutPage,
      contentSchema: RoweAboutContentSchema,
      defaultContent: roweAboutDefaultContent,
    },
    {
      path: "/contact",
      Page: RoweContactPage,
      contentSchema: RoweContactContentSchema,
      defaultContent: roweContactDefaultContent,
    },
    {
      path: "/privacy",
      Page: RowePrivacyPage,
      contentSchema: RowePrivacyContentSchema,
      defaultContent: rowePrivacyDefaultContent,
    },
    {
      path: "/properties",
      isPropertyRoute: true,
      Page: RowePropertiesPage,
      contentSchema: RowePropertiesContentSchema,
      defaultContent: rowePropertiesDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: RowePropertyPage,
      contentSchema: RowePropertyContentSchema,
      defaultContent: rowePropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/services",
      Page: RoweServicesPage,
      contentSchema: RoweServicesContentSchema,
      defaultContent: roweServicesDefaultContent,
    },
    {
      path: "/services/[slug]",
      Page: RoweServicePage,
      contentSchema: RoweServiceContentSchema,
      defaultContent: roweServiceDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.services),
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: RoweJournalPage,
      contentSchema: RoweJournalContentSchema,
      defaultContent: roweJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: RoweJournalEntryPage,
      contentSchema: RoweJournalEntryContentSchema,
      defaultContent: roweJournalEntryDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
  ],
});
