import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { ElenaHomePage } from "./pages/home/home";
import {
  ElenaHomeContentSchema,
  elenaHomeDefaultContent,
} from "./pages/home/schema";
import { ElenaJournalPage } from "./pages/journal/journal";
import { ElenaJournalPostPage } from "./pages/journal/journal-post";
import {
  ElenaJournalContentSchema,
  ElenaJournalPostContentSchema,
  elenaJournalDefaultContent,
  elenaJournalPostDefaultContent,
} from "./pages/journal/schema";
import { ElenaResidencePage } from "./pages/residence/residence";
import {
  ElenaResidenceContentSchema,
  elenaResidenceDefaultContent,
} from "./pages/residence/schema";
import { ElenaSettingsSchema } from "./settings";

/**
 * Elena template router — editorial New York site from elena-hart-real-estate.
 * Owns this template's routes, schemas, and defaults.
 */
export const elenaRouter = createTemplateRouter({
  settingsSchema: ElenaSettingsSchema,
  legacyPropertyCatalogKey: "listings",
  legacyBlogCatalogKey: "journal",
  blogNavigationHrefs: ["#journal"],
  propertyNavigationHrefs: ["#residences", "/#residences"],
  routes: [
    {
      path: "/",
      Page: ElenaHomePage,
      contentSchema: ElenaHomeContentSchema,
      defaultContent: elenaHomeDefaultContent,
    },
    {
      path: "/residences/[slug]",
      isPropertyRoute: true,
      Page: ElenaResidencePage,
      contentSchema: ElenaResidenceContentSchema,
      defaultContent: elenaResidenceDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: ElenaJournalPage,
      contentSchema: ElenaJournalContentSchema,
      defaultContent: elenaJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: ElenaJournalPostPage,
      contentSchema: ElenaJournalPostContentSchema,
      defaultContent: elenaJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
  ],
});
