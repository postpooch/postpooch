import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { MaraAboutPage } from "./pages/about/about";
import {
  MaraAboutContentSchema,
  maraAboutDefaultContent,
} from "./pages/about/schema";
import { MaraBuyPage } from "./pages/buy/buy";
import {
  MaraBuyContentSchema,
  maraBuyDefaultContent,
} from "./pages/buy/schema";
import { MaraBuyerConsultationPage } from "./pages/buyer-consultation/buyer-consultation";
import {
  MaraBuyerConsultationContentSchema,
  maraBuyerConsultationDefaultContent,
} from "./pages/buyer-consultation/schema";
import { MaraCondoPage } from "./pages/condo/condo";
import {
  MaraCondoContentSchema,
  maraCondoDefaultContent,
} from "./pages/condo/schema";
import { MaraCondosPage } from "./pages/condos/condos";
import {
  MaraCondosContentSchema,
  maraCondosDefaultContent,
} from "./pages/condos/schema";
import { MaraContactPage } from "./pages/contact/contact";
import {
  MaraContactContentSchema,
  maraContactDefaultContent,
} from "./pages/contact/schema";
import { MaraHomePage } from "./pages/home/home";
import {
  MaraHomeContentSchema,
  maraHomeDefaultContent,
} from "./pages/home/schema";
import { MaraJournalPage } from "./pages/journal/journal";
import {
  MaraJournalContentSchema,
  maraJournalDefaultContent,
} from "./pages/journal/schema";
import { MaraJournalPostPage } from "./pages/journal-post/journal-post";
import {
  MaraJournalPostContentSchema,
  maraJournalPostDefaultContent,
} from "./pages/journal-post/schema";
import { MaraNeighborhoodPage } from "./pages/neighborhood/neighborhood";
import {
  MaraNeighborhoodContentSchema,
  maraNeighborhoodDefaultContent,
} from "./pages/neighborhood/schema";
import { MaraNeighborhoodsPage } from "./pages/neighborhoods/neighborhoods";
import {
  MaraNeighborhoodsContentSchema,
  maraNeighborhoodsDefaultContent,
} from "./pages/neighborhoods/schema";
import { MaraPrivacyPage } from "./pages/privacy/privacy";
import {
  MaraPrivacyContentSchema,
  maraPrivacyDefaultContent,
} from "./pages/privacy/schema";
import { MaraPropertiesPage } from "./pages/properties/properties";
import {
  MaraPropertiesContentSchema,
  maraPropertiesDefaultContent,
} from "./pages/properties/schema";
import { MaraPropertyPage } from "./pages/property/property";
import {
  MaraPropertyContentSchema,
  maraPropertyDefaultContent,
} from "./pages/property/schema";
import { MaraPropertyAlertsPage } from "./pages/property-alerts/property-alerts";
import {
  MaraPropertyAlertsContentSchema,
  maraPropertyAlertsDefaultContent,
} from "./pages/property-alerts/schema";
import { MaraReviewsPage } from "./pages/reviews/reviews";
import {
  MaraReviewsContentSchema,
  maraReviewsDefaultContent,
} from "./pages/reviews/schema";
import { MaraSellPage } from "./pages/sell/sell";
import {
  MaraSellContentSchema,
  maraSellDefaultContent,
} from "./pages/sell/schema";
import { MaraSellerConsultationPage } from "./pages/seller-consultation/seller-consultation";
import {
  MaraSellerConsultationContentSchema,
  maraSellerConsultationDefaultContent,
} from "./pages/seller-consultation/schema";
import { MaraValuationPage } from "./pages/valuation/valuation";
import {
  MaraValuationContentSchema,
  maraValuationDefaultContent,
} from "./pages/valuation/schema";
import { MaraSettingsSchema } from "./settings";

/**
 * Mara template router — Toronto editorial real estate site from luxury-agent-site.
 * Owns this template's routes, schemas, and defaults.
 */
export const maraRouter = createTemplateRouter({
  settingsSchema: MaraSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "articles",
  routes: [
    {
      path: "/",
      Page: MaraHomePage,
      contentSchema: MaraHomeContentSchema,
      defaultContent: maraHomeDefaultContent,
    },
    {
      path: "/about",
      Page: MaraAboutPage,
      contentSchema: MaraAboutContentSchema,
      defaultContent: maraAboutDefaultContent,
    },
    {
      path: "/properties",
      isPropertyRoute: true,
      Page: MaraPropertiesPage,
      contentSchema: MaraPropertiesContentSchema,
      defaultContent: maraPropertiesDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: MaraPropertyPage,
      contentSchema: MaraPropertyContentSchema,
      defaultContent: maraPropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/condos",
      Page: MaraCondosPage,
      contentSchema: MaraCondosContentSchema,
      defaultContent: maraCondosDefaultContent,
    },
    {
      path: "/condos/[slug]",
      Page: MaraCondoPage,
      contentSchema: MaraCondoContentSchema,
      defaultContent: maraCondoDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.condos),
    },
    {
      path: "/buy",
      Page: MaraBuyPage,
      contentSchema: MaraBuyContentSchema,
      defaultContent: maraBuyDefaultContent,
    },
    {
      path: "/sell",
      Page: MaraSellPage,
      contentSchema: MaraSellContentSchema,
      defaultContent: maraSellDefaultContent,
    },
    {
      path: "/buyer-consultation",
      Page: MaraBuyerConsultationPage,
      contentSchema: MaraBuyerConsultationContentSchema,
      defaultContent: maraBuyerConsultationDefaultContent,
    },
    {
      path: "/seller-consultation",
      Page: MaraSellerConsultationPage,
      contentSchema: MaraSellerConsultationContentSchema,
      defaultContent: maraSellerConsultationDefaultContent,
    },
    {
      path: "/property-alerts",
      Page: MaraPropertyAlertsPage,
      contentSchema: MaraPropertyAlertsContentSchema,
      defaultContent: maraPropertyAlertsDefaultContent,
    },
    {
      path: "/valuation",
      Page: MaraValuationPage,
      contentSchema: MaraValuationContentSchema,
      defaultContent: maraValuationDefaultContent,
    },
    {
      path: "/neighborhoods",
      Page: MaraNeighborhoodsPage,
      contentSchema: MaraNeighborhoodsContentSchema,
      defaultContent: maraNeighborhoodsDefaultContent,
    },
    {
      path: "/neighborhoods/[slug]",
      Page: MaraNeighborhoodPage,
      contentSchema: MaraNeighborhoodContentSchema,
      defaultContent: maraNeighborhoodDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.neighborhoods),
    },
    {
      path: "/reviews",
      Page: MaraReviewsPage,
      contentSchema: MaraReviewsContentSchema,
      defaultContent: maraReviewsDefaultContent,
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: MaraJournalPage,
      contentSchema: MaraJournalContentSchema,
      defaultContent: maraJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: MaraJournalPostPage,
      contentSchema: MaraJournalPostContentSchema,
      defaultContent: maraJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/contact",
      Page: MaraContactPage,
      contentSchema: MaraContactContentSchema,
      defaultContent: maraContactDefaultContent,
    },
    {
      path: "/privacy",
      Page: MaraPrivacyPage,
      contentSchema: MaraPrivacyContentSchema,
      defaultContent: maraPrivacyDefaultContent,
    },
  ],
});
