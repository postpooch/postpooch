import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { ArdenAboutPage } from "./pages/about/about";
import {
  ArdenAboutContentSchema,
  ardenAboutDefaultContent,
} from "./pages/about/schema";
import { ArdenAgentPage } from "./pages/agent/agent";
import {
  ArdenAgentContentSchema,
  ardenAgentDefaultContent,
} from "./pages/agent/schema";
import { ArdenHomePage } from "./pages/home/home";
import {
  ArdenHomeContentSchema,
  ardenHomeDefaultContent,
} from "./pages/home/schema";
import { ArdenJournalPage } from "./pages/journal/journal";
import { ArdenJournalPostPage } from "./pages/journal/journal-post";
import {
  ArdenJournalContentSchema,
  ArdenJournalPostContentSchema,
  ardenJournalDefaultContent,
  ardenJournalPostDefaultContent,
} from "./pages/journal/schema";
import {
  ArdenLeasePage,
  ArdenSalePage,
  ArdenSoldPage,
  ArdenWorldwidePage,
} from "./pages/listings/listings";
import {
  ArdenListingsContentSchema,
  ardenLeaseDefaultContent,
  ardenSaleDefaultContent,
  ardenSoldDefaultContent,
  ardenWorldwideDefaultContent,
} from "./pages/listings/schema";
import { ArdenMarketPage } from "./pages/market/market";
import {
  ArdenMarketContentSchema,
  ardenNapaDefaultContent,
  ardenSonomaDefaultContent,
} from "./pages/market/schema";
import {
  ArdenContactPage,
  ArdenCopilotPage,
  ArdenFilmsPage,
  ArdenPressPage,
  ArdenSearchPage,
  ArdenTestimonialsPage,
} from "./pages/more/more";
import {
  ArdenContactContentSchema,
  ArdenCopilotContentSchema,
  ArdenFilmsContentSchema,
  ArdenPressContentSchema,
  ArdenSearchContentSchema,
  ArdenTestimonialsContentSchema,
  ardenContactDefaultContent,
  ardenCopilotDefaultContent,
  ardenFilmsDefaultContent,
  ardenPressDefaultContent,
  ardenSearchDefaultContent,
  ardenTestimonialsDefaultContent,
} from "./pages/more/schema";
import {
  ArdenNeighborhoodPage,
  ArdenNeighborhoodsPage,
} from "./pages/neighborhoods/neighborhoods";
import {
  ArdenNeighborhoodContentSchema,
  ArdenNeighborhoodsContentSchema,
  ardenNeighborhoodDefaultContent,
  ardenNeighborhoodsDefaultContent,
} from "./pages/neighborhoods/schema";
import { ArdenPropertyPage } from "./pages/property/property";
import {
  ArdenPropertyContentSchema,
  ardenPropertyDefaultContent,
} from "./pages/property/schema";
import { ArdenSellPage } from "./pages/sell-your-home/sell-your-home";
import {
  ArdenSellContentSchema,
  ardenSellDefaultContent,
} from "./pages/sell-your-home/schema";
import { ArdenBrokeragePage } from "./pages/the-brokerage/the-brokerage";
import {
  ArdenBrokerageContentSchema,
  ardenBrokerageDefaultContent,
} from "./pages/the-brokerage/schema";
import { ArdenSettingsSchema } from "./settings";

/**
 * Arden template router — Wine Country editorial site from arden-vale-real-estate.
 * Owns this template's routes, schemas, and defaults.
 *
 * Folder names avoid Next.js reserved special-file keywords (sitemap, robots,
 * not-found, page, layout, icon). Route paths are ordinary catch-all segments.
 */
export const ardenRouter = createTemplateRouter({
  settingsSchema: ArdenSettingsSchema,
  legacyPropertyCatalogKey: "properties",
  legacyBlogCatalogKey: "posts",
  routes: [
    {
      path: "/",
      Page: ArdenHomePage,
      contentSchema: ArdenHomeContentSchema,
      defaultContent: ardenHomeDefaultContent,
    },
    {
      path: "/about",
      Page: ArdenAboutPage,
      contentSchema: ArdenAboutContentSchema,
      defaultContent: ardenAboutDefaultContent,
    },
    {
      path: "/the-brokerage",
      Page: ArdenBrokeragePage,
      contentSchema: ArdenBrokerageContentSchema,
      defaultContent: ardenBrokerageDefaultContent,
    },
    {
      path: "/agents/[slug]",
      Page: ArdenAgentPage,
      contentSchema: ArdenAgentContentSchema,
      defaultContent: ardenAgentDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.agents),
    },
    {
      path: "/blog",
      isBlogRoute: true,
      Page: ArdenJournalPage,
      contentSchema: ArdenJournalContentSchema,
      defaultContent: ardenJournalDefaultContent,
    },
    {
      path: "/blog/[slug]",
      isBlogRoute: true,
      Page: ArdenJournalPostPage,
      contentSchema: ArdenJournalPostContentSchema,
      defaultContent: ardenJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/properties/sale",
      isPropertyRoute: true,
      Page: ArdenSalePage,
      contentSchema: ArdenListingsContentSchema,
      defaultContent: ardenSaleDefaultContent,
    },
    {
      path: "/properties/sold",
      isPropertyRoute: true,
      Page: ArdenSoldPage,
      contentSchema: ArdenListingsContentSchema,
      defaultContent: ardenSoldDefaultContent,
    },
    {
      path: "/properties/worldwide",
      isPropertyRoute: true,
      Page: ArdenWorldwidePage,
      contentSchema: ArdenListingsContentSchema,
      defaultContent: ardenWorldwideDefaultContent,
    },
    {
      path: "/properties/leases",
      isPropertyRoute: true,
      Page: ArdenLeasePage,
      contentSchema: ArdenListingsContentSchema,
      defaultContent: ardenLeaseDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: ArdenPropertyPage,
      contentSchema: ArdenPropertyContentSchema,
      defaultContent: ardenPropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/sell-your-home",
      Page: ArdenSellPage,
      contentSchema: ArdenSellContentSchema,
      defaultContent: ardenSellDefaultContent,
    },
    {
      path: "/press",
      Page: ArdenPressPage,
      contentSchema: ArdenPressContentSchema,
      defaultContent: ardenPressDefaultContent,
    },
    {
      path: "/neighborhoods",
      Page: ArdenNeighborhoodsPage,
      contentSchema: ArdenNeighborhoodsContentSchema,
      defaultContent: ardenNeighborhoodsDefaultContent,
    },
    {
      path: "/neighborhoods/[slug]",
      Page: ArdenNeighborhoodPage,
      contentSchema: ArdenNeighborhoodContentSchema,
      defaultContent: ardenNeighborhoodDefaultContent,
      previewParams: (settings) =>
        slugPreviewParams(settings.catalog.neighborhoods),
    },
    {
      path: "/napa-valley-real-estate",
      Page: ArdenMarketPage,
      contentSchema: ArdenMarketContentSchema,
      defaultContent: ardenNapaDefaultContent,
    },
    {
      path: "/sonoma-valley-real-estate",
      Page: ArdenMarketPage,
      contentSchema: ArdenMarketContentSchema,
      defaultContent: ardenSonomaDefaultContent,
    },
    {
      path: "/presence-copilot",
      Page: ArdenCopilotPage,
      contentSchema: ArdenCopilotContentSchema,
      defaultContent: ardenCopilotDefaultContent,
    },
    {
      path: "/home-search/listings",
      isPropertyRoute: true,
      Page: ArdenSearchPage,
      contentSchema: ArdenSearchContentSchema,
      defaultContent: ardenSearchDefaultContent,
    },
    {
      path: "/videos",
      Page: ArdenFilmsPage,
      contentSchema: ArdenFilmsContentSchema,
      defaultContent: ardenFilmsDefaultContent,
    },
    {
      path: "/testimonials",
      Page: ArdenTestimonialsPage,
      contentSchema: ArdenTestimonialsContentSchema,
      defaultContent: ardenTestimonialsDefaultContent,
    },
    {
      path: "/contact",
      Page: ArdenContactPage,
      contentSchema: ArdenContactContentSchema,
      defaultContent: ardenContactDefaultContent,
    },
  ],
});
