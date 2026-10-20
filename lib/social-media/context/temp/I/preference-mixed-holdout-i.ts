/**
 * POSTPOOCH — PREFERENCE MIXED-INSTRUCTION HOLDOUT I (EXPERIMENT ONLY)
 *
 * 42 fresh (not exact copies of prior holdout notes) + eight diagnostic
 * replays. Compare Version 7 Preference with Candidate I Preference.
 * Every other question must be shared: Candidate E Identity, Version 7
 * Frequency, Candidate H Temporary, Version 7 Temporary Type.
 *
 * Pass ONLY { note: testCase.note } to Jev. Ground truth stays local.
 * For 'next few' and 'next handful', expected Temporary Type is COUNTER.
 * The downstream agent chooses the actual count; Jev need not do so.
 * 'For a little while' remains unclear under the currently supported types.
 */

export const PREFERENCE_MIXED_HOLDOUT_I_CASES = [
  {
    "id": "PT01",
    "group": "fresh_preference_temporary",
    "note": "As my standard voice, keep captions friendly; for the next two posts, use a formal tone.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "PT02",
    "group": "fresh_preference_temporary",
    "note": "For the next four posts, make the graphics neon; otherwise, keep my designs muted by default.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "PT03",
    "group": "fresh_preference_temporary",
    "note": "Avoid stock images as my general rule. This weekend, use illustrated graphics instead.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "PT04",
    "group": "fresh_preference_temporary",
    "note": "Use natural-light photography in general, except during November when I want black-and-white photos.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "PT05",
    "group": "fresh_preference_temporary",
    "note": "Always write captions from my perspective, but for the next three posts write in third person.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "PT06",
    "group": "fresh_preference_temporary",
    "note": "Keep headlines brief by default, while tomorrow's post can have a longer headline.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "PT07",
    "group": "fresh_preference_temporary",
    "note": "For the next handful of posts, use orange backgrounds; afterward, continue using minimalist designs as usual.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "PT08",
    "group": "fresh_preference_temporary",
    "note": "Going forward, never use the phrase hot market; next week, try playful captions.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "PT09",
    "group": "fresh_preference_temporary",
    "note": "For the next few posts, add a call-to-action banner; normally I don't want banners on graphics.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "PT10",
    "group": "fresh_preference_temporary",
    "note": "When you explain loan terms, keep the language simple; for my next post, cover refinancing.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "PT11",
    "group": "fresh_preference_temporary",
    "note": "In general, do not apply heavy photo filters. For the next six posts, feature condos.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "PT12",
    "group": "fresh_preference_temporary",
    "note": "For posts about inspections, use bullet lists as the standard; on Friday's post try paragraph form.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "PT13",
    "group": "fresh_preference_temporary",
    "note": "I want fewer hashtags in captions from now on; for the next two posts, use no hashtags at all.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "PT14",
    "group": "fresh_preference_temporary",
    "note": "Keep captions warm as my default; for a little while, make the images more whimsical.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear"
  },
  {
    "id": "PT15",
    "group": "fresh_preference_temporary",
    "note": "Normally choose my own uploaded pictures; for next week's graphics use studio photographs.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "PF01",
    "group": "fresh_preference_frequency",
    "note": "Keep every caption conversational; also increase the share of neighborhood history posts.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "PF02",
    "group": "fresh_preference_frequency",
    "note": "Make more posts about escrow, and keep those posts free of jargon.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "PF03",
    "group": "fresh_preference_frequency",
    "note": "Include a poll in about one of every six posts; whenever a poll appears, keep its question under eight words.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "PF04",
    "group": "fresh_preference_frequency",
    "note": "Use softer colors in all graphics, but stop publishing celebrity mansion spotlights.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "PFT01",
    "group": "fresh_preference_frequency_temporary",
    "note": "Keep captions in first person, make more posts about local restaurants, and for the next two posts use black-and-white photos.",
    "expectedCategories": [
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "PFT02",
    "group": "fresh_preference_frequency_temporary",
    "note": "Next week, use bold headings; overall, keep captions concise; occasionally share client Q&A posts.",
    "expectedCategories": [
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "PFT03",
    "group": "fresh_preference_frequency_temporary",
    "note": "Give renovation tips a smaller share of my posts; in general avoid stock imagery; make the next handful of posts about staging.",
    "expectedCategories": [
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "IPT01",
    "group": "fresh_identity_preference_temporary",
    "note": "My professional title is now Associate Broker. As a general rule, avoid emojis. For the next two posts, focus on financing.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "IPT02",
    "group": "fresh_identity_preference_temporary",
    "note": "My brokerage is now Red Mesa Homes; captions should stay upbeat normally, but during November use a serious tone.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "IPT03",
    "group": "fresh_identity_preference_temporary",
    "note": "I now specialize in custom-home builds; use natural-looking photography as my default, and for the next three posts feature property walkthroughs.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "P01",
    "group": "fresh_preference_only",
    "note": "Keep all captions free of exclamation marks going forward.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "P02",
    "group": "fresh_preference_only",
    "note": "On posts about schools, avoid slang and explain terms plainly.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "P03",
    "group": "fresh_preference_only",
    "note": "Use brighter, minimally edited listing pictures as the usual style.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "P04",
    "group": "fresh_preference_only",
    "note": "I prefer practical home maintenance tips over luxury celebrity news.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "P05",
    "group": "fresh_preference_only",
    "note": "Write captions in second person unless I request otherwise.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "T01",
    "group": "fresh_temporary_only",
    "note": "For the next three posts, skip hashtags altogether.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "T02",
    "group": "fresh_temporary_only",
    "note": "This weekend, put yellow ribbons on the graphics.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "T03",
    "group": "fresh_temporary_only",
    "note": "For the next few posts, use handwritten-looking headings.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "T04",
    "group": "fresh_temporary_only",
    "note": "For my next handful of posts, focus on HOA bylaws.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "F01",
    "group": "fresh_frequency_only",
    "note": "Include a myth-busting post about appraisal values every fourth post.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "F02",
    "group": "fresh_frequency_only",
    "note": "Talk more about roof-maintenance topics.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "I01",
    "group": "fresh_identity_only",
    "note": "My primary brand color has changed to #1C5467.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": null
  },
  {
    "id": "I02",
    "group": "fresh_identity_only",
    "note": "I now represent buyers in Carefree.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null
  },
  {
    "id": "I03",
    "group": "fresh_identity_only",
    "note": "My specialties now include land-lease negotiations.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null
  },
  {
    "id": "N01",
    "group": "fresh_nonactionable",
    "note": "Would switching to shorter captions next month improve engagement?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "N02",
    "group": "fresh_nonactionable",
    "note": "The brochure says the property was photographed last Thursday.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "N03",
    "group": "fresh_nonactionable",
    "note": "How many posts did we publish last week?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "R01",
    "group": "diagnostic_replay",
    "note": "Generally avoid stock images, but use grayscale graphics for the next three posts.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "R02",
    "group": "diagnostic_replay",
    "note": "Keep my writing conversational generally, but use bullet-point checklists for the next two posts.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "R03",
    "group": "diagnostic_replay",
    "note": "Continue using natural-light photography overall, but through the end of the month use a monochrome look.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "R04",
    "group": "diagnostic_replay",
    "note": "Keep captions concise as my normal style; for the next week, cover seller concessions.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "R05",
    "group": "diagnostic_replay",
    "note": "Use fewer emojis in general, and during the first half of November 2026 use no emojis at all.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "R06",
    "group": "diagnostic_replay",
    "note": "For the next three posts, explain contingencies in plain language; normally, use plain language in all educational posts.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "R07",
    "group": "diagnostic_replay",
    "note": "My primary brand color is #245C73; make seller advice a bigger share of my posts; and make the next two posts about preparing for a listing photo shoot.",
    "expectedCategories": [
      "identity",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "R08",
    "group": "diagnostic_replay",
    "note": "My secondary brand color is now #E9B44C.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": null
  }
] as const;

export const PREFERENCE_MIXED_HOLDOUT_I_FRESH_COUNT = 42;
export const PREFERENCE_MIXED_HOLDOUT_I_REPLAY_COUNT = 8;
export const PREFERENCE_MIXED_HOLDOUT_I_TOTAL_COUNT = 50;
