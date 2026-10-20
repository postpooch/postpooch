/**
 * POSTPOOCH — COMBINED CLASSIFIER J / COMPREHENSIVE FRESH HOLDOUT.
 *
 * 100 entirely new user-note texts, with no diagnostic replays.
 * Covers each of nine Identity fields, standalone Preference/Frequency/Temporary,
 * fuzzy post counts (few / handful / couple => counter), date periods,
 * bounded and lasting clauses in one note, two incompatible Temporary boundaries,
 * four-category notes, and non-instructions / questions.
 *
 * GOLD LABELS ARE FOR LOCAL SCORING ONLY.
 * Send the model ONLY { note: testCase.note }; no ID, group, category labels,
 * expected temporary type, examples from this file, or explanatory prefixes.
 *
 * These labels reflect PostPooch's agreed classification definitions.
 * A few notes may be contested; report disputes instead of silently changing
 * their labels after seeing model results.
 *
 * expectedTemporaryType:
 *   counter: includes 'few', 'handful', 'couple'. Downstream agent chooses number.
 *   date_range: bounded calendar date / period.
 *   unclear: no determinate type, or incompatible temporary instructions in
 *            a single-choice classifier; existing router should review.
 *   null: no Temporary instruction.
 *
 * expectedHasRunnableBoundary: false ONLY when current router should review
 *   the type; null when no Temporary exists. This is NOT an additional model
 *   label or a requirement to extract exact numerical values.
 *
 * Recurring weekday posting schedules are excluded, as agreed out of scope.
 */
export const COMBINED_J_HOLDOUT_CASES = [
  {
    "id": "J-ID-01",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "Please change the name shown on my real estate profile to Dana Ortiz.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-02",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "I go by Keira Moss professionally now, not K. Moss.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-03",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "My official title is Broker Associate.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-04",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "I no longer use the title Senior Agent; it's Designated Broker.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-05",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "I moved to Blue Heron Realty last month.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-06",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "My team affiliation is now Mesa Lantern Group.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-07",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "I represent buyers and sellers in Flagstaff and Bellemont.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-08",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "I stopped taking clients in Buckeye; I still work in Goodyear.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-09",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "Most of my clients are nurses buying their first homes.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-10",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "I mainly work with families downsizing after retirement.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-11",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "I no longer handle tax-lien property transactions.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-12",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "I specialize in selling manufactured homes on owned land.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-13",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "Before real estate I repaired boats for twelve years.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-14",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "I grew up on a sheep ranch outside Laramie.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-15",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "My primary brand color is now #1B4965.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-16",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "Please remove olive green as my primary brand color.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-17",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "The secondary color for my branding is coral, #F28C8C.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-ID-18",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "My secondary brand color is no longer charcoal; use cream.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-01",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Put the opening sentence on its own line in every caption.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-02",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "My posts should sound direct but never pushy.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-03",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Please stop using ALL CAPS in graphics.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-04",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Explain escrow terms without abbreviations whenever they come up.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-05",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Avoid showing house numbers in property photos.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-06",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "From now on, use sentence case for headlines.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-07",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "I prefer educational financing explanations to celebrity house chatter.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-08",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Use no more than one emoji in any caption.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-09",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Whenever a post discusses HOAs, define the fees plainly.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-10",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Keep the typography airy with generous margins.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-11",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Write photo captions as complete sentences.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PR-12",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "I want more substance about financing in each financing caption, not more financing posts.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-01",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Share more posts about property tax appeals.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-02",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Make posts about staging less common overall.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-03",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Sometimes weave in a neighborhood history post.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-04",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Let rental-market summaries make up around one fifth of our posts.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-05",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Stop making celebrity property roundup posts altogether.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-06",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Talk more about contingency clauses.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-07",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Work a small-business profile into the lineup once in a while.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-08",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Reduce how often we publish client testimonials.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-09",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Use polls on only a small fraction of posts.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-10",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Feature before-and-after renovation photos in some posts, not every one.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-11",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Give condo association updates a bigger slice of the schedule.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FR-12",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Make fewer posts whose main purpose is announcing a listing.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-TM-01",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For the next five posts, focus on smoke-detector maintenance.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-TM-02",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "In my next post, explain buyer representation agreements.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-TM-03",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For a handful of upcoming posts, show simple packing checklists.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-TM-04",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "Make the next few posts use infographic layouts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-TM-05",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For the next couple of posts, feature first-time renter tips.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-TM-06",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "On October 23, publish a post about our neighborhood food drive.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-TM-07",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For the first half of December, use festive graphic accents.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-TM-08",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "Until October 28, keep captions under 80 words.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-TM-09",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "Over the next ten days, feature water-saving landscaping.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-TM-10",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "This coming Sunday, focus the post on inspection walk-throughs.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-TM-11",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For a little while, let the visuals feel playful.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "expectedHasRunnableBoundary": false
  },
  {
    "id": "J-TM-12",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For the next two posts cover solar panels; during November, cover leasebacks.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "expectedHasRunnableBoundary": false
  },
  {
    "id": "J-PT-01",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "I want headers in title case as a standard; for the next three posts switch to lowercase lettering.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-PT-02",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "When writing about financing, spell out acronyms; through the end of October, add a budget worksheet graphic.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-PT-03",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Keep my captions matter-of-fact normally, but make the next few unusually playful.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-PT-04",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Normally avoid overly saturated images. During the first week of November, try vivid orange artwork.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-PT-05",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "In general, use just one hashtag per caption; for the next handful of posts, don't use hashtags.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-PT-06",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Use original photographs unless I say otherwise; this Saturday, use vector drawings.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-PT-07",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "I like step-by-step explanations in advice posts; for my next two posts, talk about flood insurance.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-PT-08",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Usually keep graphics clean, but for a little while try sticker-style icons.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "expectedHasRunnableBoundary": false
  },
  {
    "id": "J-PF-01",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Publish more short-sale education posts, and explain each legal term in plain words.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PF-02",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Occasionally use a poll, and write each poll question in fewer than seven words.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PF-03",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Reduce the number of luxury listing posts, and keep those that remain visually understated.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PF-04",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Talk less about bidding wars across posts, but give fuller examples whenever you do discuss them.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PF-05",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Show neighborhood walking routes more often, and never put a watermark on their maps.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-PF-06",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Make a client Q&A post roughly once every eight posts, with a warm tone in those Q&As.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-FT-01",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Add seasonal maintenance posts into the regular rotation; next Tuesday, post a hurricane-prep checklist.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-FT-02",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Do more posts on appraisal gaps, but make the next three about mortgage preapproval.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-FT-03",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Feature a vendor recommendation from time to time; for the next handful of posts cover porch repairs.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-FT-04",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Cut back on neighborhood festival posts overall; during October highlight local volunteer opportunities.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-FT-05",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "One in ten posts should include an FAQ poll; tomorrow feature a checklist of loan documents.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-IP-01",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "My brokerage is Cedar Trail Property Group. Write in a calm, measured voice going forward.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-IP-02",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "I now serve Sedona and Cottonwood, and I'd like photos to have softer contrast.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-IP-03",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "My professional title is Principal Broker; always spell out 'homeowners association' in captions.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-IP-04",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "I specialize in investment-grade fourplexes, and I want my captions free of hype.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-IP-05",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "I studied journalism before getting my real estate license, and I prefer concise educational copy.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-IT-01",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "I now work with military spouses relocating to Arizona. For the next two posts, cover VA loan myths.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-IT-02",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "My primary brand color is #226B5E; for this weekend's graphic use purple.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-IT-03",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "I left Summit Gate Realty for Silver Oak Properties. Through Thanksgiving week, highlight charitable giving.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-IT-04",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "I stopped representing vacation-rental investments; for the next few posts discuss fire inspections.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-IF-01",
    "cohort": "fresh",
    "group": "identity_frequency",
    "note": "My market now includes the Verde Valley; let's feature more posts about trail access.",
    "expectedCategories": [
      "identity",
      "frequency"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-IF-02",
    "cohort": "fresh",
    "group": "identity_frequency",
    "note": "I mainly represent teachers buying starter homes, and I'd like fewer listing announcement posts.",
    "expectedCategories": [
      "identity",
      "frequency"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-AF-01",
    "cohort": "fresh",
    "group": "all_four",
    "note": "My team is now Westwind Realty; keep language straightforward, mention escrow myths more often, and make next week's posts use paper-cut illustrations.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "date_range",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-AF-02",
    "cohort": "fresh",
    "group": "all_four",
    "note": "I no longer work on estate-sale transactions; always avoid exclamation points, rotate in more walkability posts, and make the next three posts about drainage.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "counter",
    "expectedHasRunnableBoundary": true
  },
  {
    "id": "J-NA-01",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "Would a three-week series on affordable home updates attract more leads?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-02",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "How often should I publish neighborhood interviews?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-03",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "The last four posts were all about escrow.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-04",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "My client said 'Please use purple for the next two posts' in a testimonial.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-05",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "Can I see the primary color currently saved on my profile?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-06",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "Is using fewer hashtags better for engagement?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-07",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "I toured homes in Tempe last weekend with a buyer.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-08",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "Do you think occasional polls would feel gimmicky?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-09",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "The event flyer says 'Post three neighborhood tips this month'.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-10",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "Does a title like 'Luxury Homes Expert' sound pretentious?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-11",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "The listing description contains the words 'blue accents'.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-12",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "Should we go with square or portrait graphics?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-13",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "What is the difference between a broker associate and a managing broker?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  },
  {
    "id": "J-NA-14",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "A newspaper article predicted a three-day heatwave for Phoenix.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "expectedHasRunnableBoundary": null
  }
] as const;

export const COMBINED_J_HOLDOUT_FRESH_COUNT = 100;
