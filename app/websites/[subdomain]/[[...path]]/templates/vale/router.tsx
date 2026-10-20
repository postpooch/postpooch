import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { ValeAboutPage } from "./pages/about/about";
import {
  ValeAboutContentSchema,
  valeAboutDefaultContent,
} from "./pages/about/schema";
import { ValeContactPage } from "./pages/contact/contact";
import {
  ValeContactContentSchema,
  valeContactDefaultContent,
} from "./pages/contact/schema";
import { ValeHomePage } from "./pages/home/home";
import {
  ValeHomeContentSchema,
  valeHomeDefaultContent,
} from "./pages/home/schema";
import { ValeJournalPage } from "./pages/journal/journal";
import {
  ValeJournalContentSchema,
  valeJournalDefaultContent,
} from "./pages/journal/schema";
import { ValeJournalPostPage } from "./pages/journal-post/journal-post";
import {
  ValeJournalPostContentSchema,
  valeJournalPostDefaultContent,
} from "./pages/journal-post/schema";
import { ValePropertiesPage } from "./pages/properties/properties";
import {
  ValePropertiesContentSchema,
  valePropertiesDefaultContent,
} from "./pages/properties/schema";
import { ValePropertyPage } from "./pages/property/property";
import {
  ValePropertyContentSchema,
  valePropertyDefaultContent,
} from "./pages/property/schema";
import { ValeServicesPage } from "./pages/services/services";
import {
  ValeServicesContentSchema,
  valeServicesDefaultContent,
} from "./pages/services/schema";
import { ValeSettingsSchema } from "./settings";

/**
 * Vale template router — coastal editorial real estate site from vale-estates.
 * Owns this template's routes, schemas, and defaults.
 */
export const valeRouter = createTemplateRouter({
  settingsSchema: ValeSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "articles",
  routes: [
    {
      path: "/",
      Page: ValeHomePage,
      contentSchema: ValeHomeContentSchema,
      defaultContent: valeHomeDefaultContent,
    },
    {
      path: "/about",
      Page: ValeAboutPage,
      contentSchema: ValeAboutContentSchema,
      defaultContent: valeAboutDefaultContent,
    },
    {
      path: "/services",
      Page: ValeServicesPage,
      contentSchema: ValeServicesContentSchema,
      defaultContent: valeServicesDefaultContent,
    },
    {
      path: "/properties",
      isPropertyRoute: true,
      Page: ValePropertiesPage,
      contentSchema: ValePropertiesContentSchema,
      defaultContent: valePropertiesDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: ValePropertyPage,
      contentSchema: ValePropertyContentSchema,
      defaultContent: valePropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: ValeJournalPage,
      contentSchema: ValeJournalContentSchema,
      defaultContent: valeJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: ValeJournalPostPage,
      contentSchema: ValeJournalPostContentSchema,
      defaultContent: valeJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/contact",
      Page: ValeContactPage,
      contentSchema: ValeContactContentSchema,
      defaultContent: valeContactDefaultContent,
    },
  ],
});
