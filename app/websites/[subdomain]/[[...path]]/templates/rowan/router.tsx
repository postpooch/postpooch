import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { RowanHomePage } from "./pages/home/home";
import {
  RowanHomeContentSchema,
  rowanHomeDefaultContent,
} from "./pages/home/schema";
import { RowanJournalPage } from "./pages/journal/journal";
import { RowanJournalPostPage } from "./pages/journal/journal-post";
import {
  RowanJournalContentSchema,
  RowanJournalPostContentSchema,
  rowanJournalDefaultContent,
  rowanJournalPostDefaultContent,
} from "./pages/journal/schema";
import { RowanListingPage } from "./pages/listing/listing";
import {
  RowanListingContentSchema,
  rowanListingDefaultContent,
} from "./pages/listing/schema";
import { RowanListingsPage } from "./pages/listings/listings";
import {
  RowanListingsContentSchema,
  rowanListingsDefaultContent,
} from "./pages/listings/schema";
import { RowanPrivacyPage } from "./pages/privacy/privacy";
import {
  RowanPrivacyContentSchema,
  rowanPrivacyDefaultContent,
} from "./pages/privacy/schema";
import { RowanProjectPage } from "./pages/project/project";
import {
  RowanProjectContentSchema,
  rowanProjectDefaultContent,
} from "./pages/project/schema";
import { RowanSettingsSchema } from "./settings";

/**
 * Rowan template router — design-led mountain/architectural real estate site
 * from rowan-estates-inspired. Owns this template's routes, schemas, and defaults.
 */
export const rowanRouter = createTemplateRouter({
  settingsSchema: RowanSettingsSchema,
  legacyPropertyCatalogKey: "listings",
  routes: [
    {
      path: "/",
      Page: RowanHomePage,
      contentSchema: RowanHomeContentSchema,
      defaultContent: rowanHomeDefaultContent,
    },
    {
      path: "/listings",
      isPropertyRoute: true,
      Page: RowanListingsPage,
      contentSchema: RowanListingsContentSchema,
      defaultContent: rowanListingsDefaultContent,
    },
    {
      path: "/listings/[slug]",
      isPropertyRoute: true,
      Page: RowanListingPage,
      contentSchema: RowanListingContentSchema,
      defaultContent: rowanListingDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: RowanJournalPage,
      contentSchema: RowanJournalContentSchema,
      defaultContent: rowanJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: RowanJournalPostPage,
      contentSchema: RowanJournalPostContentSchema,
      defaultContent: rowanJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/projects/[slug]",
      Page: RowanProjectPage,
      contentSchema: RowanProjectContentSchema,
      defaultContent: rowanProjectDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.projects),
    },
    {
      path: "/privacy-policy",
      Page: RowanPrivacyPage,
      contentSchema: RowanPrivacyContentSchema,
      defaultContent: rowanPrivacyDefaultContent,
    },
  ],
});
