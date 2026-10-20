# PostPooch — Jev intent-aware benchmark L (full experiment)

## Purpose and fixed decision

Use **ONLY Jev** to select the strongest present-day category-classifier configuration under PostPooch's **revised division of responsibilities**. Do **not** invoke the more expensive second AI agent or simulate its behavior with another model. Read `SCORING-RUBRIC.md` completely; it changes what constitutes a correct label for a quoted request, suggestion, or advisory question. Avoid the previous incorrect rule "a client quote or question always means no category."

This is a **frozen, three-arm, three-repeat benchmark**, not a prompt-generation or model-tuning exercise. Any future prompt changes require another distinct experiment and holdout.

### Inputs (same folder)

- `classification-policy.ts` — exact verified Version 7 source snapshot (SHA-256 checked against manifest), reference baseline. For runtime import in the user's project, prefer the actual matching source `lib/social-media/context/classification-policy.ts` using existing valid aliases. Preserve `server-only` and imports in original; don't blindly rewrite source files.
- `postpooch-combined-classifier-j.ts` — exact Combined J (Candidate E Identity + Candidate I Preference + V7 Frequency + Candidate H Temporary + V7 Temporary Type, with unchanged router).
- `preference-jev-candidate-k.ts` — one Candidate K Preference question.
- `postpooch-jev-intent-holdout-l.ts` AND `.json` — **the same** 288 locally labelled notes; JSON is convenient to read outside a TypeScript runtime.
- `SCORING-RUBRIC.md` — frozen annotation rules and their limitations.
- `benchmark-l-manifest.json` — expected file hashes and counts.

### Three EXACT arms

**V7** (production baseline): Use the real Version 7 `CLASSIFICATION_QUESTIONS` containing **five** questions: broad Identity, Preference, Frequency, Temporary, Temporary Type. Use original `decideClassification()`.

**J**: Use the exact Combined J `COMBINED_J_QUESTIONS` (**13** questions, nine Identity fields) and `candidateIdentityScore()` max aggregation, with unchanged router and thresholds.

**K**: Exactly J, but replace its `preference` key with `PREFERENCE_QUESTION_CANDIDATE_K`. All other **12** questions, Identity aggregation, routing, and thresholds remain identical.

Neither J nor K has been deployed. Treat V7 as comparator, J and K as candidates. **Do not add a new Jev question or gate**, even if you think another prompt could help.

### Mandatory preflight, with ZERO Jev calls before pass

1. Verify all SHA-256 file hashes from the manifest and identical original project source for V7. Verify the verified J/K reference snapshots match the supplied hashes. If a matching file is absent, stop without calling Jev; do not reconstruct missing questions.
2. Compile or transpile both TypeScript source files and the fixture. Verify question maps V7=5 and J=K=13, and K differs from J in Preference **only**. Verify Candidate K wording and all other question definitions are untouched.
3. Verify the `.json` and `.ts` fixtures have exactly the same 288 IDs, notes, and gold labels: **264 unique fresh, 24 diagnostic replay**, fresh split into **22 groups × 12**, no exact duplicates. Validate `expectedTemporaryType` is non-null iff `temporary` is in gold categories and Identity fields are present iff Identity is present. Verify 216 fresh high-confidence and 48 fresh interpretive.
4. Verify **0.75** include, **0.25** exclude, **0.70** Temporary Type threshold, unchanged `decideClassification`, identity max (J/K only), model `jev-latest`, same single-request contract. Use exact proven project SDK decoding (returned `noul` yes-probabilities and `choice` option probabilities).
5. SDK request timeout **8 seconds** and **zero retries** (explicitly disable SDK retry defaults and do not add transport retry). Never call a second AI model, database, or mutation planner.
6. Hash the original production files you inspect before and after; no file edits in the project. Create the runner and outputs **only in a fresh OS temp directory outside the repository**.
7. Inspect the frozen rubric and at least 12 matched contrast cases before testing, resolving any obviously contradictory *file-format* problem **before calls**; do not re-label or change the held-out set to fit candidate responses.

### Execute exactly 2,592 attempts (3 arms × 288 cases × 3 repeats)

- For each repeat **1, 2, 3**, for each of 288 cases, invoke each of **V7**, **J**, and **K** exactly once, **sequentially**, no repeats/retries on errors.
- Deterministically rotate order to avoid one arm always going first. For zero-indexed case `i` and repeat `r`, use order `arms[(i+r+j) % 3]` for `j = 0,1,2`, where `arms = ['V7','J','K']`. Record order position.
- One Jev request per arm/case/repeat, containing the full question set for that arm. Jev input state must be **exactly `{ note: case.note }`**, NEVER ID, group, labels, rationale, cohort, intent rubric, or expected decision. The static question text is the arm's only classification instruction.
- Immediately append each raw response **or failure** to `records.jsonl` outside the repo before moving on. Include an idempotency key `(caseId,arm,repeat)` in the saved local record. In case of interruption, **resume by skipping already-attempted keys**; do not re-run previously attempted failures. This is still a fixed 2,592-*attempt* design, not a requirement for 2,592 successful responses.
- Record all returned scores, choice probabilities, model string, SDK usage, request latency, arm, repetition, order, note text, and any error. Keep local labels separate from Jev request input.
- If excessive rate limits or quotas interrupt the experiment, record the interruption and report incomplete paired evidence rather than silently retrying or changing the experiment.
- Do not make any extra Jev calls after all 2,592 attempts or modify prompts after looking at preliminary results.

### Score ONLY preserved data; never rerun model for scoring

Report **three distinct cohorts**:

1. **Fresh high-confidence core (216 notes)** — the primary, less-disputed evidence.
2. **Fresh interpretation-sensitive (48 notes)** — bare quotes, overrides, advisory questions and tentative suggestions; crucial to the new intent contract but potentially subject to labeling judgment.
3. **Previously seen diagnostic replays (24 notes)** — include examples that previous reports called non-actionable but whose relevance is revised. Diagnose, **never** use these as fresh accuracy evidence.

Also provide all-fresh (264) results with subgroup counts, but **never** allow a good all-fresh number to hide failure on the interpretive group. The 22 groups are each intentionally size 12 and are NOT weighted by production prevalence.

For each arm give metrics **per single actual invocation**, **per note majority over three repetitions**, and **per note unanimous consistency**. A repeated question getting mixed classifications is not a stable classifier. **Do not average probabilities across repetitions and apply the router to that average**; the deployed system makes one decision from one request. Three repeats are for stability measurement only.

#### Required analyses

**A. Relevant-category classification**: For each category separately report TP/FN/FP, uncertain negatives, precision, recall; clearly distinguish positive notes with scores (i) `<=.25` and (ii) `.25<p<.75`. Exact four-category set rates. Include mixed-note recall and count of instances where a relevant category would be absent from the second-agent route.

**B. Crucial semantic slices**: quoted-but-actionable, quoted-overridden, quoted-explicitly-nonactionable, advisory questions, tentative suggestions, and all 12 **matched minimal pairs**. A pair is a success only when the arm's two notes both get the correct exact category set in the **same repeat**. Show which pairs fail and why, with all three arms' probabilities. Never penalize a correctly forwarded quoted/advisory suggestion merely because the second agent might later decline to act.

**C. Independent instructions & lasting scope**: Preference + Temporary and Identity + Temporary, including brand-color fact + next-day visual request (no automatically inferred lasting Preference), Preference + Frequency, Frequency + Temporary, and all-four mixed notes. Report silent auto-routing of extraneous permanent Preferences separately.

**D. Identity detail**: For J/K, calculate exact nine-field sets, each field's TP/FP/FN and uncertain scores, team-name mistaken for display name, title mistaken for specialty, profile market vs location mentioned as post topic. V7 has only a broad Identity question; mark fine-field measurement N/A for V7, not zero.

**E. Temporary Type**: Accuracy of counter/date_range/unclear; `few`, `handful`, and `couple` = counter, even without number. `tomorrow`/specific date = date_range. "For a little while" or separately incompatible boundaries = unclear with expected review. Score raw `choice` correctness separately from inclusion and router. For selected choice, the router uses `probabilities[choice]`, **not** merely top-level Choice confidence.

**F. Real router result**: Run the unchanged deterministic router for every arm's classification. Report disjoint outcomes per attempt: (1) correct nonempty automatic route, (2) incorrect nonempty auto-route (missing/extra category or wrong temporary type), (3) justified review for expected `unclear` boundary, (4) unnecessary review for otherwise representable labels, (5) correct empty-category route, (6) incorrect empty-category route. Do not claim any automatically routed category actually became a DB mutation; second agent is not evaluated. For `routed: []`, note that the surrounding application's response behavior is unknown.

**G. Uncertainty and threshold instability**: Reports by category of middle scores causing reviews. For the three repeated invocations of a given note/arm, list category bucket flips (`<=.25`, `( .25,.75 )`, `>=.75`), the router decision changes, and `choice` changes. Compare arm-level consistency per note. Variability in unchanged questions must not be automatically attributed to a changed Preference.

**H. Costs/latency**: Tokens and latency by arm, per-run median/P90 and per-request means. Same-model returned version, errors, timeouts, success rate. Do not invent monetary API prices; compare measured tokens. Compare only fully paired successful cases in paired usage summaries.

**I. Paired comparisons and uncertainty**: Give note-level *paired* disagreements V7↔J, V7↔K, J↔K, particularly high-confidence core and interpretive groups. Use a simple note-clustered bootstrap (e.g., 2,000 deterministic resamples of fresh note IDs, carrying their three repetitions together) for intervals on the **difference** in correct exact-set rate. Do not treat 3 repetitions as 3 independent notes. State synthetic sampling limits.

**J. Detailed downloadable error artifact**: For every wrong or uncertain note, include exact note, gold confidence, rationale, expected categories/fields/type, all raw scores, observed categories/type, decision, reason, arm and repetition, and note whether the disagreement is a rubric issue or model issue without editing gold labels.

### Decision rule, fixed before results

The result is **NOT** "the arm with the most routed requests wins." Use this order:

1. First ensure strong exact-category coverage on the **216 fresh high-confidence** notes, especially no silent dropped categories in multi-instruction notes, no invented permanent Preference for a bounded visual request, and no spurious Identity field hints.
2. Verify that the same arm also handles the **48 interpretive** fresh examples by routing relevant advice/quoted requests **without treating explicit non-adoption as an instruction**. If one category of interpretive prompts performs poorly, explain the trade-off, not an overall percentage alone.
3. Compare actual wrong automatic routes, unnecessary reviews, Temporary Type, and repeat-to-repeat instability. A review is safer than silently losing or fabricating a category, but excessive reviews matter operationally.
4. If J and K differ by <2 percentage points in core exact-set accuracy, or paired uncertainty includes a tie, do **not** proclaim a decisive winner on accuracy alone. Prefer lower confident wrong-processor routing and stable legitimate-category recall; if these also tie, prefer lower token usage and report "practically tied."
5. Report any unresolved semantic labels or groups transparently; do not silently redefine the category meanings to force a winner.

### Expected final outputs

- One readable `report.md` with an executive decision and **actual numbers**, no hand-wavy score.
- `records.jsonl` preserved raw responses.
- `all-results.json` and `all-results.csv` with every arm/case/repeat.
- `category-metrics.csv`, `group-metrics.csv`, `matched-pair-results.csv`, `identity-field-metrics.csv`, `temporary-type-results.csv`, `routing-results.csv`, `repeat-stability.csv`, `all-errors-and-uncertainty.csv`, `usage.csv`, `paired-disagreements.csv`.
- `manifest.json` with model version, SHA-256 hashes before/after, exact completed attempts, SDK timeout and retry settings, errors, timestamps, and all actual result paths.
- Clear recommended **Jev-only** classifier arm: V7, J or K, or no clear winner. **No production integration automatically**.

## Absolute restrictions

No second AI. No evaluator AI calls. No mutation planner. No database. No deployments. No repo modifications. No prompt rewriting during the run. No dynamic threshold tuning. No retries. No additional arms. No further experiments after reading results. Stop after offline analysis and return the preserved file paths.
