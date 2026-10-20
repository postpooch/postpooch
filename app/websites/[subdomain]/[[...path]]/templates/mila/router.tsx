import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { MilaAanbodPage } from "./pages/aanbod/aanbod";
import {
  MilaAanbodContentSchema,
  milaAanbodDefaultContent,
} from "./pages/aanbod/schema";
import { MilaContactPage } from "./pages/contact/contact";
import {
  MilaContactContentSchema,
  milaContactDefaultContent,
} from "./pages/contact/schema";
import { MilaDienstPage } from "./pages/dienst/dienst";
import {
  MilaDienstContentSchema,
  milaDienstDefaultContent,
} from "./pages/dienst/schema";
import { MilaDienstenPage } from "./pages/diensten/diensten";
import {
  MilaDienstenContentSchema,
  milaDienstenDefaultContent,
} from "./pages/diensten/schema";
import { MilaHomePage } from "./pages/home/home";
import {
  MilaHomeContentSchema,
  milaHomeDefaultContent,
} from "./pages/home/schema";
import { MilaInsightPage } from "./pages/insight/insight";
import {
  MilaInsightContentSchema,
  milaInsightDefaultContent,
} from "./pages/insight/schema";
import { MilaInsightsPage } from "./pages/insights/insights";
import {
  MilaInsightsContentSchema,
  milaInsightsDefaultContent,
} from "./pages/insights/schema";
import { MilaOverMilaPage } from "./pages/over-mila/over-mila";
import {
  MilaOverMilaContentSchema,
  milaOverMilaDefaultContent,
} from "./pages/over-mila/schema";
import { MilaPrivacyPage } from "./pages/privacy/privacy";
import {
  MilaPrivacyContentSchema,
  milaPrivacyDefaultContent,
} from "./pages/privacy/schema";
import { MilaPropertyPage } from "./pages/property/property";
import {
  MilaPropertyContentSchema,
  milaPropertyDefaultContent,
} from "./pages/property/schema";
import { MilaRegioPage } from "./pages/regio/regio";
import {
  MilaRegioContentSchema,
  milaRegioDefaultContent,
} from "./pages/regio/schema";
import { MilaRegiosPage } from "./pages/regios/regios";
import {
  MilaRegiosContentSchema,
  milaRegiosDefaultContent,
} from "./pages/regios/schema";
import { MilaWoningzoekerPage } from "./pages/woningzoeker/woningzoeker";
import {
  MilaWoningzoekerContentSchema,
  milaWoningzoekerDefaultContent,
} from "./pages/woningzoeker/schema";
import { MilaSettingsSchema } from "./settings";

/**
 * Mila template router — personal Utrecht-region brokerage site from mila-wonen.
 * Owns this template's routes, schemas, and defaults.
 */
export const milaRouter = createTemplateRouter({
  settingsSchema: MilaSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "articles",
  routes: [
    {
      path: "/",
      Page: MilaHomePage,
      contentSchema: MilaHomeContentSchema,
      defaultContent: milaHomeDefaultContent,
    },
    {
      path: "/diensten",
      Page: MilaDienstenPage,
      contentSchema: MilaDienstenContentSchema,
      defaultContent: milaDienstenDefaultContent,
    },
    {
      path: "/diensten/[slug]",
      Page: MilaDienstPage,
      contentSchema: MilaDienstContentSchema,
      defaultContent: milaDienstDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.services),
    },
    {
      path: "/aanbod",
      isPropertyRoute: true,
      Page: MilaAanbodPage,
      contentSchema: MilaAanbodContentSchema,
      defaultContent: milaAanbodDefaultContent,
    },
    {
      path: "/aanbod/[slug]",
      isPropertyRoute: true,
      Page: MilaPropertyPage,
      contentSchema: MilaPropertyContentSchema,
      defaultContent: milaPropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/regios",
      Page: MilaRegiosPage,
      contentSchema: MilaRegiosContentSchema,
      defaultContent: milaRegiosDefaultContent,
    },
    {
      path: "/regios/[slug]",
      Page: MilaRegioPage,
      contentSchema: MilaRegioContentSchema,
      defaultContent: milaRegioDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.areas),
    },
    {
      path: "/over-mila",
      Page: MilaOverMilaPage,
      contentSchema: MilaOverMilaContentSchema,
      defaultContent: milaOverMilaDefaultContent,
    },
    {
      path: "/insights",
      isBlogRoute: true,
      Page: MilaInsightsPage,
      contentSchema: MilaInsightsContentSchema,
      defaultContent: milaInsightsDefaultContent,
    },
    {
      path: "/insights/[slug]",
      isBlogRoute: true,
      Page: MilaInsightPage,
      contentSchema: MilaInsightContentSchema,
      defaultContent: milaInsightDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/contact",
      Page: MilaContactPage,
      contentSchema: MilaContactContentSchema,
      defaultContent: milaContactDefaultContent,
    },
    {
      path: "/woningzoeker",
      isPropertyRoute: true,
      Page: MilaWoningzoekerPage,
      contentSchema: MilaWoningzoekerContentSchema,
      defaultContent: milaWoningzoekerDefaultContent,
    },
    {
      path: "/privacy",
      Page: MilaPrivacyPage,
      contentSchema: MilaPrivacyContentSchema,
      defaultContent: milaPrivacyDefaultContent,
    },
  ],
});
