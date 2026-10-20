/**
 * POSTPOOCH — PREFERENCE BOUNDARY HOLDOUT G (EXPERIMENT ONLY)
 *
 * Two approaches: Version 7 Preference and candidate G Preference.
 * Both use the exact Candidate E Identity question set; Version 7 Frequency,
 * Temporary, and Temporary Type; and unchanged aggregation/thresholds/routing.
 *
 * 42 fresh cases (not exact copies from previous holdout files) plus
 * 8 marked diagnostic replays. Analyze these cohorts separately.
 *
 * Ground truth is only for LOCAL EVALUATION. Send only { note: testCase.note }
 * to Jev. Never send the expected categories or field labels to the model.
 *
 * Distinctions tested: lasting per-post rules, qualitative topic preferences,
 * ongoing distribution across posts, bounded instructions, pure profile facts,
 * and combinations of independent instructions.
 */

export const PREFERENCE_HOLDOUT_G_CASES = [
  {"id": "P01", "group": "fresh_preference", "note": "Keep the voice understated and professional in captions.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P02", "group": "fresh_preference", "note": "Explain inspection contingencies in more detail within each inspection-related post.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P03", "group": "fresh_preference", "note": "Break captions into short paragraphs with blank lines between them.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P04", "group": "fresh_preference", "note": "End every caption with a direct question to the reader.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P05", "group": "fresh_preference", "note": "Use no more than two hashtags in a caption.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P06", "group": "fresh_preference", "note": "Give property photos a natural-light look without heavy filters.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P07", "group": "fresh_preference", "note": "Don't use stock photography in graphics going forward.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P08", "group": "fresh_preference", "note": "Use fewer emojis in individual captions.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P09", "group": "fresh_preference", "note": "Never use the phrase 'dream home' in my posts.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P10", "group": "fresh_preference", "note": "I prefer practical homeowner advice over luxury celebrity gossip.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P11", "group": "fresh_preference", "note": "When a post explains mortgages, define the financial terms in plain language.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P12", "group": "fresh_preference", "note": "Keep the logo visible on every post graphic.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F01", "group": "fresh_frequency", "note": "Publish seller checklists more often in the feed.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F02", "group": "fresh_frequency", "note": "Talk more about backyard landscaping ideas.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F03", "group": "fresh_frequency", "note": "Once in a while, put out a mortgage-myth post.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F04", "group": "fresh_frequency", "note": "Make open-house updates one in every five posts.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F05", "group": "fresh_frequency", "note": "Stop publishing celebrity mansion roundup posts.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F06", "group": "fresh_frequency", "note": "Give testimonials a bigger share of the posts we publish.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F07", "group": "fresh_frequency", "note": "Only some posts should have a poll, rather than all of them.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "T01", "group": "fresh_temporary", "note": "For the next three posts, use black-and-white photography.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "T02", "group": "fresh_temporary", "note": "During November, add more emojis to captions.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "T03", "group": "fresh_temporary", "note": "Until Friday, leave hashtags out of the posts.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "T04", "group": "fresh_temporary", "note": "Tomorrow's caption should use a very short opening line.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "T05", "group": "fresh_temporary", "note": "Use only my uploaded property photos in the next four posts.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "T06", "group": "fresh_temporary", "note": "For two weeks, make neighborhood tips our main subject.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "T07", "group": "fresh_temporary", "note": "On the next two graphics, put the headline in large type.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "I01", "group": "fresh_identity", "note": "My primary brand color has changed to #286A7F.", "expectedCategories": ["identity"], "expectedIdentityFields": ["primary_brand_color"], "expectedTemporaryType": null},
  {"id": "I02", "group": "fresh_identity", "note": "My secondary brand color is now #C6A052.", "expectedCategories": ["identity"], "expectedIdentityFields": ["secondary_brand_color"], "expectedTemporaryType": null},
  {"id": "I03", "group": "fresh_identity", "note": "My professional title is now Senior Real Estate Advisor.", "expectedCategories": ["identity"], "expectedIdentityFields": ["professional_title"], "expectedTemporaryType": null},
  {"id": "I04", "group": "fresh_identity", "note": "My specialty is selling properties with historic preservation requirements.", "expectedCategories": ["identity"], "expectedIdentityFields": ["specialties"], "expectedTemporaryType": null},
  {"id": "I05", "group": "fresh_identity", "note": "I joined Canyon View Property Group as my brokerage.", "expectedCategories": ["identity"], "expectedIdentityFields": ["brokerage_name"], "expectedTemporaryType": null},
  {"id": "I06", "group": "fresh_identity", "note": "I now represent buyers and sellers in Casa Grande.", "expectedCategories": ["identity"], "expectedIdentityFields": ["markets"], "expectedTemporaryType": null},
  {"id": "M01", "group": "fresh_mixed", "note": "Keep the tone friendly in each caption, and create more posts about home maintenance.", "expectedCategories": ["preference", "frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "M02", "group": "fresh_mixed", "note": "I just joined Sonoran Pines Realty; write captions from a first-person perspective.", "expectedCategories": ["identity", "preference"], "expectedIdentityFields": ["brokerage_name"], "expectedTemporaryType": null},
  {"id": "M03", "group": "fresh_mixed", "note": "Generally avoid stock images, but use grayscale graphics for the next three posts.", "expectedCategories": ["preference", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "M04", "group": "fresh_mixed", "note": "Keep captions concise as my normal style; for the next week, cover seller concessions.", "expectedCategories": ["preference", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "M05", "group": "fresh_mixed", "note": "Use a reassuring voice in captions, and feature mortgage Q&A posts occasionally.", "expectedCategories": ["preference", "frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "M06", "group": "fresh_mixed", "note": "I used to teach high school chemistry; keep my captions playful, and include more neighborhood spotlights in the mix.", "expectedCategories": ["identity", "preference", "frequency"], "expectedIdentityFields": ["personal_context"], "expectedTemporaryType": null},
  {"id": "M07", "group": "fresh_mixed", "note": "My new secondary brand color is #D4973D, and I want that color used on every post graphic.", "expectedCategories": ["identity", "preference"], "expectedIdentityFields": ["secondary_brand_color"], "expectedTemporaryType": null},
  {"id": "N01", "group": "fresh_nonactionable", "note": "Would shorter captions work better for my audience?", "expectedCategories": [], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "N02", "group": "fresh_nonactionable", "note": "Last week's neighborhood graphic looked great.", "expectedCategories": [], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "N03", "group": "fresh_nonactionable", "note": "What tone is currently set in my profile?", "expectedCategories": [], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "R01", "group": "diagnostic_replay", "note": "I prefer practical seller advice over celebrity-home gossip.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "R02", "group": "diagnostic_replay", "note": "Keep my writing conversational generally, but use bullet-point checklists for the next two posts.", "expectedCategories": ["preference", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "R03", "group": "diagnostic_replay", "note": "Continue using natural-light photography overall, but through the end of the month use a monochrome look.", "expectedCategories": ["preference", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "R04", "group": "diagnostic_replay", "note": "My primary brand color is #245C73; make seller advice a bigger share of my posts; and make the next two posts about preparing for a listing photo shoot.", "expectedCategories": ["identity", "frequency", "temporary"], "expectedIdentityFields": ["primary_brand_color"], "expectedTemporaryType": "counter"},
  {"id": "R05", "group": "diagnostic_replay", "note": "Set my primary brand color to #174A56.", "expectedCategories": ["identity"], "expectedIdentityFields": ["primary_brand_color"], "expectedTemporaryType": null},
  {"id": "R06", "group": "diagnostic_replay", "note": "My secondary brand color is now #E9B44C.", "expectedCategories": ["identity"], "expectedIdentityFields": ["secondary_brand_color"], "expectedTemporaryType": null},
  {"id": "R07", "group": "diagnostic_replay", "note": "Use fewer hashtags per post.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "R08", "group": "diagnostic_replay", "note": "Write a post explaining how buyers can choose a brokerage.", "expectedCategories": [], "expectedIdentityFields": [], "expectedTemporaryType": null},
] as const;

export const PREFERENCE_HOLDOUT_G_FRESH_COUNT = 42;
export const PREFERENCE_HOLDOUT_G_REPLAY_COUNT = 8;
export const PREFERENCE_HOLDOUT_G_TOTAL_COUNT = 50;
