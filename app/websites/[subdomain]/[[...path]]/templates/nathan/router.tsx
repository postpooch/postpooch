import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { NathanAboutPage } from "./pages/about/about";
import {
  NathanAboutContentSchema,
  nathanAboutDefaultContent,
} from "./pages/about/schema";
import { NathanContactPage } from "./pages/contact/contact";
import {
  NathanContactContentSchema,
  nathanContactDefaultContent,
} from "./pages/contact/schema";
import { NathanHomePage } from "./pages/home/home";
import {
  NathanHomeContentSchema,
  nathanHomeDefaultContent,
} from "./pages/home/schema";
import { NathanInsightPage } from "./pages/insight/insight";
import {
  NathanInsightContentSchema,
  nathanInsightDefaultContent,
} from "./pages/insight/schema";
import { NathanInsightsPage } from "./pages/insights/insights";
import {
  NathanInsightsContentSchema,
  nathanInsightsDefaultContent,
} from "./pages/insights/schema";
import { NathanNeighborhoodsPage } from "./pages/neighborhoods/neighborhoods";
import {
  NathanNeighborhoodsContentSchema,
  nathanNeighborhoodsDefaultContent,
} from "./pages/neighborhoods/schema";
import { NathanPressPage } from "./pages/press/press";
import {
  NathanPressContentSchema,
  nathanPressDefaultContent,
} from "./pages/press/schema";
import { NathanPrivacyPage } from "./pages/privacy/privacy";
import {
  NathanPrivacyContentSchema,
  nathanPrivacyDefaultContent,
} from "./pages/privacy/schema";
import { NathanPropertiesPage } from "./pages/properties/properties";
import {
  NathanPropertiesContentSchema,
  nathanPropertiesDefaultContent,
} from "./pages/properties/schema";
import { NathanPropertyPage } from "./pages/property/property";
import {
  NathanPropertyContentSchema,
  nathanPropertyDefaultContent,
} from "./pages/property/schema";
import { NathanSoldPage } from "./pages/sold/sold";
import {
  NathanSoldContentSchema,
  nathanSoldDefaultContent,
} from "./pages/sold/schema";
import { NathanSettingsSchema } from "./settings";

/**
 * Nathan template router — NYC private real estate site from vale-estate.
 * Owns this template's routes, schemas, and defaults.
 */
export const nathanRouter = createTemplateRouter({
  settingsSchema: NathanSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "insights",
  routes: [
    {
      path: "/",
      Page: NathanHomePage,
      contentSchema: NathanHomeContentSchema,
      defaultContent: nathanHomeDefaultContent,
    },
    {
      path: "/about",
      Page: NathanAboutPage,
      contentSchema: NathanAboutContentSchema,
      defaultContent: nathanAboutDefaultContent,
    },
    {
      path: "/properties",
      isPropertyRoute: true,
      Page: NathanPropertiesPage,
      contentSchema: NathanPropertiesContentSchema,
      defaultContent: nathanPropertiesDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: NathanPropertyPage,
      contentSchema: NathanPropertyContentSchema,
      defaultContent: nathanPropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/neighborhoods",
      Page: NathanNeighborhoodsPage,
      contentSchema: NathanNeighborhoodsContentSchema,
      defaultContent: nathanNeighborhoodsDefaultContent,
    },
    {
      path: "/sold",
      isPropertyRoute: true,
      Page: NathanSoldPage,
      contentSchema: NathanSoldContentSchema,
      defaultContent: nathanSoldDefaultContent,
    },
    {
      path: "/insights",
      isBlogRoute: true,
      Page: NathanInsightsPage,
      contentSchema: NathanInsightsContentSchema,
      defaultContent: nathanInsightsDefaultContent,
    },
    {
      path: "/insights/[slug]",
      isBlogRoute: true,
      Page: NathanInsightPage,
      contentSchema: NathanInsightContentSchema,
      defaultContent: nathanInsightDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/press",
      Page: NathanPressPage,
      contentSchema: NathanPressContentSchema,
      defaultContent: nathanPressDefaultContent,
    },
    {
      path: "/contact",
      Page: NathanContactPage,
      contentSchema: NathanContactContentSchema,
      defaultContent: nathanContactDefaultContent,
    },
    {
      path: "/privacy",
      Page: NathanPrivacyPage,
      contentSchema: NathanPrivacyContentSchema,
      defaultContent: nathanPrivacyDefaultContent,
    },
  ],
});
