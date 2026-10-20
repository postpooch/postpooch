/**
 * POSTPOOCH — CANDIDATE K: TEMPORARY vs LASTING PREFERENCE HOLDOUT.
 *
 * 42 fresh notes + 8 separately reported diagnostic replays.
 * Do NOT mix replay notes with fresh accuracy denominators.
 *
 * Primary objective: reject Preference for identity facts + bounded visuals,
 * while retaining legitimate enduring rules, including rules overridden for
 * the next N posts or within a calendar window.
 *
 * GOLD LABELS ARE LOCAL ONLY. Send Jev strictly {note: case.note}, never
 * IDs, groups, expected labels, or metadata.
 *
 * IMPORTANT: "few", "handful" and "couple" of posts are valid counter
 * boundaries. The second agent chooses the eventual number.
 * For "a little while" the existing single-choice type is unclear.
 */
export const PREFERENCE_SCOPE_K_CASES = [
  {
    "id": "K-ITV-01",
    "cohort": "fresh",
    "group": "identity_temporary_visual",
    "note": "My primary brand color is now #244B65; for tomorrow's graphic, use a peach background.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-ITV-02",
    "cohort": "fresh",
    "group": "identity_temporary_visual",
    "note": "I changed my secondary brand color to #DAA520. Put dark charcoal behind the headline on the next two posts.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-ITV-03",
    "cohort": "fresh",
    "group": "identity_temporary_visual",
    "note": "I now work with Copper Canyon Realty. For this weekend's listing graphic, try a handwritten font.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-ITV-04",
    "cohort": "fresh",
    "group": "identity_temporary_visual",
    "note": "My service area now includes Fountain Hills. Make the next four posts use textured paper backgrounds.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-ITV-05",
    "cohort": "fresh",
    "group": "identity_temporary_visual",
    "note": "I mainly serve retirees now. For the October 31 post, use bright coral accents.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-ITV-06",
    "cohort": "fresh",
    "group": "identity_temporary_visual",
    "note": "I'm now a Managing Broker. Give next week's graphics black borders.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-ITV-07",
    "cohort": "fresh",
    "group": "identity_temporary_visual",
    "note": "I've stopped handling probate transactions. Use illustrated icons on the next handful of posts.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-ITV-08",
    "cohort": "fresh",
    "group": "identity_temporary_visual",
    "note": "I grew up in Tucson. Use a watercolor skyline for tomorrow's post.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-ITV-09",
    "cohort": "fresh",
    "group": "identity_temporary_visual",
    "note": "My display name should be Avery Lin. For the next three posts, use serif titles.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-ITV-10",
    "cohort": "fresh",
    "group": "identity_temporary_visual",
    "note": "My primary brand color is forest green and my secondary is ivory. For October 24's post, use hot pink lettering.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color",
      "secondary_brand_color"
    ],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-TV-01",
    "cohort": "fresh",
    "group": "temporary_visual_only",
    "note": "Make this Friday's open house graphic use a lavender headline.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-TV-02",
    "cohort": "fresh",
    "group": "temporary_visual_only",
    "note": "For the next five posts, switch to close-up home photos.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-TV-03",
    "cohort": "fresh",
    "group": "temporary_visual_only",
    "note": "Use a sepia treatment for the next few posts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-TV-04",
    "cohort": "fresh",
    "group": "temporary_visual_only",
    "note": "On October 31, draw a playful pumpkin border around the graphic.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-TV-05",
    "cohort": "fresh",
    "group": "temporary_visual_only",
    "note": "For the next handful of posts, use thick outlined lettering.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-TV-06",
    "cohort": "fresh",
    "group": "temporary_visual_only",
    "note": "For the next two weeks, put a small gold corner stamp on the visuals.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-TV-07",
    "cohort": "fresh",
    "group": "temporary_visual_only",
    "note": "For a little while, use sticker-style labels.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear"
  },
  {
    "id": "K-PT-01",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Keep property photos true-to-life by default; for the next two posts, switch to architectural line drawings.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-PT-02",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Normally avoid all-caps headlines. For the October 27 post, use an all-caps headline.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-PT-03",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Use cheerful language as my normal caption voice; for next week's market update, write in a serious tone.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-PT-04",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "As a rule, keep captions under 100 words; for the next three posts, include longer explanations.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-PT-05",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Always use my own uploaded photos when possible, but for the next couple of posts use watercolor renderings.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-PT-06",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Generally leave decorative borders off my graphics; for tomorrow's post, add an ornate frame.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-PT-07",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "I prefer practical mortgage explanations over celebrity-homes chatter, and for the next four posts use minimalist photos.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-PT-08",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Don't normally put speech bubbles in my designs; for October 26's event post, include one.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-IPT-01",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "My primary brand color is now #40715F. As a lasting rule, keep layouts airy; for tomorrow's graphic, use a crowded collage.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-IPT-02",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "I joined Desert Crest Homes; normally write captions with short paragraphs, but next week's posts should use bullet lists.",
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
    "id": "K-IPT-03",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "My secondary brand color is #D9BD78. Keep photo colors natural generally; for the next two posts use a blue tint.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-IPT-04",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "I specialize in seller-financed transactions. As a standing preference, keep language friendly; use a formal style for the next few posts.",
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
    "id": "K-PF-01",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Mix neighborhood trivia into some posts, and whenever you do, keep the facts to two short sentences.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-PF-02",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Publish renovation advice less often; in any renovation post, explain costs using plain language.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-PF-03",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Put polls in one out of every five posts; keep the answer options short when a poll is used.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-PF-04",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Talk more about first-time buyer financing, but avoid acronyms in those posts.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-PF-05",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Include behind-the-scenes updates occasionally; when writing one, use a first-person voice.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-P-01",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Keep typography simple across all future graphics.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-P-02",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "When writing about local schools, avoid ranking schools or making sweeping claims.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-P-03",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "I prefer practical tips over celebrity real estate stories.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-F-01",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Add more seller checklist posts to the ongoing content mix.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-F-02",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Show customer testimonials occasionally in my posts.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-I-01",
    "cohort": "fresh",
    "group": "identity_only",
    "note": "My primary brand color has changed to #345C81.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": null
  },
  {
    "id": "K-NA-01",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "The event invitation said 'Use bold pink headlines for the next two posts,' but that was a sample slogan from the venue.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-NA-02",
    "cohort": "fresh",
    "group": "nonactionable",
    "note": "Would a post with a purple background perform better this weekend?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-R-01",
    "cohort": "replay",
    "group": "diagnostic_replay",
    "note": "My primary brand color is #226B5E; for this weekend's graphic use purple.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-R-02",
    "cohort": "replay",
    "group": "diagnostic_replay",
    "note": "Occasionally use a poll, and write each poll question in fewer than seven words.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-R-03",
    "cohort": "replay",
    "group": "diagnostic_replay",
    "note": "Talk less about bidding wars across posts, but give fuller examples whenever you do discuss them.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-R-04",
    "cohort": "replay",
    "group": "diagnostic_replay",
    "note": "I want fewer hashtags in captions from now on; for the next two posts, use no hashtags at all.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter"
  },
  {
    "id": "K-R-05",
    "cohort": "replay",
    "group": "diagnostic_replay",
    "note": "Include a poll in about one of every six posts; whenever a poll appears, keep its question under eight words.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-R-06",
    "cohort": "replay",
    "group": "diagnostic_replay",
    "note": "My client said 'Please use purple for the next two posts' in a testimonial.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  },
  {
    "id": "K-R-07",
    "cohort": "replay",
    "group": "diagnostic_replay",
    "note": "Normally choose my own uploaded pictures; for next week's graphics use studio photographs.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range"
  },
  {
    "id": "K-R-08",
    "cohort": "replay",
    "group": "diagnostic_replay",
    "note": "The event flyer says 'Post three neighborhood tips this month'.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null
  }
] as const;

export const PREFERENCE_SCOPE_K_FRESH_COUNT = 42;
export const PREFERENCE_SCOPE_K_REPLAY_COUNT = 8;
