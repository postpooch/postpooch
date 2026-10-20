import { createTemplateRouter } from "../create-template-router";
import { blogPostPreviewParams, slugPreviewParams } from "../preview-route";

import { ReyAboutPage } from "./pages/about/about";
import {
  ReyAboutContentSchema,
  reyAboutDefaultContent,
} from "./pages/about/schema";
import { ReyCommunitiesPage } from "./pages/communities/communities";
import {
  ReyCommunitiesContentSchema,
  reyCommunitiesDefaultContent,
} from "./pages/communities/schema";
import { ReyCommunityPage } from "./pages/community/community";
import {
  ReyCommunityContentSchema,
  reyCommunityDefaultContent,
} from "./pages/community/schema";
import { ReyContactPage } from "./pages/contact/contact";
import {
  ReyContactContentSchema,
  reyContactDefaultContent,
} from "./pages/contact/schema";
import { ReyHomePage } from "./pages/home/home";
import {
  ReyHomeContentSchema,
  reyHomeDefaultContent,
} from "./pages/home/schema";
import { ReyJournalPage } from "./pages/journal/journal";
import { ReyJournalPostPage } from "./pages/journal/journal-post";
import {
  ReyJournalContentSchema,
  ReyJournalPostContentSchema,
  reyJournalDefaultContent,
  reyJournalPostDefaultContent,
} from "./pages/journal/schema";
import { ReyPressPage } from "./pages/press/press";
import {
  ReyPressContentSchema,
  reyPressDefaultContent,
} from "./pages/press/schema";
import { ReyPropertiesPage } from "./pages/properties/properties";
import {
  ReyPropertiesContentSchema,
  reyPropertiesDefaultContent,
} from "./pages/properties/schema";
import { ReyPropertyPage } from "./pages/property/property";
import {
  ReyPropertyContentSchema,
  reyPropertyDefaultContent,
} from "./pages/property/schema";
import { ReySoldPage } from "./pages/sold/sold";
import {
  ReySoldContentSchema,
  reySoldDefaultContent,
} from "./pages/sold/schema";
import { ReyTeamPage } from "./pages/team/team";
import {
  ReyTeamContentSchema,
  reyTeamDefaultContent,
} from "./pages/team/schema";
import { ReyTeamMemberPage } from "./pages/team-member/team-member";
import {
  ReyTeamMemberContentSchema,
  reyTeamMemberDefaultContent,
} from "./pages/team-member/schema";
import { ReyTestimonialsPage } from "./pages/testimonials/testimonials";
import {
  ReyTestimonialsContentSchema,
  reyTestimonialsDefaultContent,
} from "./pages/testimonials/schema";
import { ReySettingsSchema } from "./settings";

/**
 * Rey template router — editorial Southern California site from
 * rey-inspired-template. Owns this template's routes, schemas, and defaults.
 *
 * Folder names avoid Next.js reserved special-file keywords (sitemap, robots,
 * icon, opengraph-image, etc.). Route paths are ordinary catch-all segments.
 */
export const reyRouter = createTemplateRouter({
  settingsSchema: ReySettingsSchema,
  legacyPropertyCatalogKey: "properties",
  routes: [
    {
      path: "/",
      Page: ReyHomePage,
      contentSchema: ReyHomeContentSchema,
      defaultContent: reyHomeDefaultContent,
    },
    {
      path: "/about",
      Page: ReyAboutPage,
      contentSchema: ReyAboutContentSchema,
      defaultContent: reyAboutDefaultContent,
    },
    {
      path: "/team",
      Page: ReyTeamPage,
      contentSchema: ReyTeamContentSchema,
      defaultContent: reyTeamDefaultContent,
    },
    {
      path: "/team/[slug]",
      Page: ReyTeamMemberPage,
      contentSchema: ReyTeamMemberContentSchema,
      defaultContent: reyTeamMemberDefaultContent,
      previewParams: (settings) => slugPreviewParams(settings.catalog.team),
    },
    {
      path: "/properties",
      isPropertyRoute: true,
      Page: ReyPropertiesPage,
      contentSchema: ReyPropertiesContentSchema,
      defaultContent: reyPropertiesDefaultContent,
    },
    {
      path: "/properties/[slug]",
      isPropertyRoute: true,
      Page: ReyPropertyPage,
      contentSchema: ReyPropertyContentSchema,
      defaultContent: reyPropertyDefaultContent,
      previewParams: (_settings, properties) => slugPreviewParams(properties),
    },
    {
      path: "/sold",
      isPropertyRoute: true,
      Page: ReySoldPage,
      contentSchema: ReySoldContentSchema,
      defaultContent: reySoldDefaultContent,
    },
    {
      path: "/communities",
      Page: ReyCommunitiesPage,
      contentSchema: ReyCommunitiesContentSchema,
      defaultContent: reyCommunitiesDefaultContent,
    },
    {
      path: "/communities/[slug]",
      Page: ReyCommunityPage,
      contentSchema: ReyCommunityContentSchema,
      defaultContent: reyCommunityDefaultContent,
      previewParams: (settings) =>
        slugPreviewParams(settings.catalog.communities),
    },
    {
      path: "/journal",
      isBlogRoute: true,
      Page: ReyJournalPage,
      contentSchema: ReyJournalContentSchema,
      defaultContent: reyJournalDefaultContent,
    },
    {
      path: "/journal/[slug]",
      isBlogRoute: true,
      Page: ReyJournalPostPage,
      contentSchema: ReyJournalPostContentSchema,
      defaultContent: reyJournalPostDefaultContent,
      previewParams: (_settings, _properties, posts) => blogPostPreviewParams(posts),
    },
    {
      path: "/press",
      Page: ReyPressPage,
      contentSchema: ReyPressContentSchema,
      defaultContent: reyPressDefaultContent,
    },
    {
      path: "/testimonials",
      Page: ReyTestimonialsPage,
      contentSchema: ReyTestimonialsContentSchema,
      defaultContent: reyTestimonialsDefaultContent,
    },
    {
      path: "/contact",
      Page: ReyContactPage,
      contentSchema: ReyContactContentSchema,
      defaultContent: reyContactDefaultContent,
    },
  ],
});
