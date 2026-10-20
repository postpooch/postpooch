/**
 * POSTPOOCH — TEMPORARY CLASSIFICATION HOLDOUT H (EXPERIMENT ONLY)
 *
 * Compare the exact Version 7 Temporary Noul to candidate H.
 * Shared in both arms: Candidate E Identity, Version 7 Preference,
 * Version 7 Frequency, and Version 7 Temporary Type choice.
 *
 * 42 fresh cases and 8 previously evaluated diagnostic replays.
 * Ground truth remains local. Send ONLY { note: testCase.note } to Jev.
 *
 * For expectedTemporaryType === "unclear", expect needs_review from the
 * existing router rather than a successful automatic temporary route.
 * The Noul only detects a temporary instruction; the unchanged Choice
 * decides its boundary, and these must be evaluated separately.
 */

export const TEMPORARY_HOLDOUT_H_CASES = [
  {"id": "T01", "group": "fresh_temporary", "note": "For the next seven posts, feature seller closing checklists.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "T02", "group": "fresh_temporary", "note": "Make my upcoming post use a handwritten-style headline.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "T03", "group": "fresh_temporary", "note": "In the following three posts, avoid photos with people.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "T04", "group": "fresh_temporary", "note": "Use short question-style captions for the next two posts only.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "T05", "group": "fresh_temporary", "note": "For my next six posts, center the artwork around local parks.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "T06", "group": "fresh_temporary", "note": "Until Sunday, use square-cropped images for each post.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "T07", "group": "fresh_temporary", "note": "During the first week of December 2026, share winter moving tips.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "T08", "group": "fresh_temporary", "note": "For posts published in November 2026, add a short call to action.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "T09", "group": "fresh_temporary", "note": "This Thursday's post should explain seller disclosures.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "T10", "group": "fresh_temporary", "note": "For the next ten days, use sepia photographs.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "T11", "group": "fresh_temporary", "note": "In tomorrow's post, define earnest money.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "T12", "group": "fresh_temporary", "note": "For a brief stretch, make the graphics more playful.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "unclear"},
  {"id": "T13", "group": "fresh_temporary", "note": "For my next handful of posts, focus on moving checklists.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "unclear"},
  {"id": "T14", "group": "fresh_temporary", "note": "For the next two posts, use the same blue border, then stop.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "P01", "group": "fresh_preference", "note": "Use two short paragraphs instead of one dense block in captions.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P02", "group": "fresh_preference", "note": "Favor first-person phrasing whenever a post discusses my work.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P03", "group": "fresh_preference", "note": "Keep property photos bright rather than moody.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P04", "group": "fresh_preference", "note": "Mention HOA fees in more detail inside each HOA-related post.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P05", "group": "fresh_preference", "note": "In general, put the brokerage logo in the bottom-right corner of the graphics.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "P06", "group": "fresh_preference", "note": "Please use a more reassuring tone across all my captions going forward.", "expectedCategories": ["preference"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F01", "group": "fresh_frequency", "note": "Run a neighborhood-history post roughly once every five posts.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F02", "group": "fresh_frequency", "note": "Make client testimonials less common in the posting mix.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F03", "group": "fresh_frequency", "note": "Talk more about home inspection red flags.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F04", "group": "fresh_frequency", "note": "Start including mini market statistics posts occasionally.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F05", "group": "fresh_frequency", "note": "Reduce how many posts focus on staging.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "F06", "group": "fresh_frequency", "note": "Going forward, let some posts include a quiz rather than every post.", "expectedCategories": ["frequency"], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "I01", "group": "fresh_identity", "note": "My new brokerage is Willow Bend Realty.", "expectedCategories": ["identity"], "expectedIdentityFields": ["brokerage_name"], "expectedTemporaryType": null},
  {"id": "I02", "group": "fresh_identity", "note": "I no longer serve Avondale clients.", "expectedCategories": ["identity"], "expectedIdentityFields": ["markets"], "expectedTemporaryType": null},
  {"id": "I03", "group": "fresh_identity", "note": "My primary brand color is now #31647B.", "expectedCategories": ["identity"], "expectedIdentityFields": ["primary_brand_color"], "expectedTemporaryType": null},
  {"id": "I04", "group": "fresh_identity", "note": "I have stopped representing vacation-home investors as my main audience.", "expectedCategories": ["identity"], "expectedIdentityFields": ["target_audience"], "expectedTemporaryType": null},
  {"id": "M01", "group": "fresh_mixed", "note": "Keep every caption calm and straightforward, but in the next two posts use playful headlines.", "expectedCategories": ["preference", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "M02", "group": "fresh_mixed", "note": "Continue using natural-light photography overall; for posts published over the next week, switch to grayscale.", "expectedCategories": ["preference", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "M03", "group": "fresh_mixed", "note": "I now serve Apache Junction; for my next four posts highlight that community.", "expectedCategories": ["identity", "temporary"], "expectedIdentityFields": ["markets"], "expectedTemporaryType": "counter"},
  {"id": "M04", "group": "fresh_mixed", "note": "Share home-inspection tips more often, but for the next seven days focus on pest inspections.", "expectedCategories": ["frequency", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "M05", "group": "fresh_mixed", "note": "Use fewer emojis in general, and during the first half of November 2026 use no emojis at all.", "expectedCategories": ["preference", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "M06", "group": "fresh_mixed", "note": "My professional title is now Listing Advisor, and tomorrow's post should use a checklist.", "expectedCategories": ["identity", "temporary"], "expectedIdentityFields": ["professional_title"], "expectedTemporaryType": "date_range"},
  {"id": "M07", "group": "fresh_mixed", "note": "For the next three posts, explain contingencies in plain language; normally, use plain language in all educational posts.", "expectedCategories": ["preference", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "M08", "group": "fresh_mixed", "note": "Increase the number of posts about relocation, but keep the next two posts about seller closing costs.", "expectedCategories": ["frequency", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "M09", "group": "fresh_mixed", "note": "For the next two posts, use bold graphics, and for the first week of December 2026, publish buyer checklists.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "unclear"},
  {"id": "N01", "group": "fresh_nonactionable", "note": "Would a two-week series about home insurance be useful?", "expectedCategories": [], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "N02", "group": "fresh_nonactionable", "note": "My client closed on a condo two weeks ago.", "expectedCategories": [], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "N03", "group": "fresh_nonactionable", "note": "The flyer mentions that inspections usually take seven days.", "expectedCategories": [], "expectedIdentityFields": [], "expectedTemporaryType": null},
  {"id": "R01", "group": "diagnostic_replay", "note": "Generally avoid stock images, but use grayscale graphics for the next three posts.", "expectedCategories": ["preference", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "R02", "group": "diagnostic_replay", "note": "Keep captions concise as my normal style; for the next week, cover seller concessions.", "expectedCategories": ["preference", "temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "R03", "group": "diagnostic_replay", "note": "For two weeks, make posts about mortgage preapproval more common.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "R04", "group": "diagnostic_replay", "note": "Through October 31, publish only fall home-prep tips.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "date_range"},
  {"id": "R05", "group": "diagnostic_replay", "note": "For the next four posts, feature neighborhood coffee shops.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "R06", "group": "diagnostic_replay", "note": "For the next five posts, discuss commercial leases.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "counter"},
  {"id": "R07", "group": "diagnostic_replay", "note": "For a little while, make my posts more playful.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "unclear"},
  {"id": "R08", "group": "diagnostic_replay", "note": "For the next few posts, focus on home staging.", "expectedCategories": ["temporary"], "expectedIdentityFields": [], "expectedTemporaryType": "unclear"},
] as const;

export const TEMPORARY_HOLDOUT_H_FRESH_COUNT = 42;
export const TEMPORARY_HOLDOUT_H_REPLAY_COUNT = 8;
export const TEMPORARY_HOLDOUT_H_TOTAL_COUNT = 50;
