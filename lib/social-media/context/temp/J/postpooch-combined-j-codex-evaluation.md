# PostPooch — Combined J full-classifier evaluation (Codex instructions)

## Objective

Test whether the best previously evaluated pieces work well **together**, using a new comprehensive holdout. Compare the current unmodified Version 7 production classifier against an assembled experimental Combined J classifier. This is a controlled offline evaluation, **not a deployment**.

**Supplied files**

- `postpooch-combined-classifier-j.ts`: complete and self-contained experimental definitions, identity aggregation, thresholds, and unchanged Version 7 router.
- `postpooch-combined-holdout-j.ts`: exactly **100 fresh labeled notes**, no diagnostic replays, exported as `COMBINED_J_HOLDOUT_CASES`.
- `postpooch-combined-j-manifest.json`: hashes and provenance of source definitions, for optional preflight verification.

The actual production Version 7 implementation is the baseline. Read it from the existing project: `lib/social-media/context/classification-policy.ts` and its **actual working Jev adapter**, not reconstructed text. Inspect how the project calls Jev and decodes `noul` and `choice` results. Use that already-working integration pattern. Do not introduce a substitute SDK call or guess an API signature.

## 1. Configuration: two independent arms

**Arm A — Production Version 7 baseline**

- The original **single Identity `noul`**.
- Version 7 Preference, Frequency, Temporary, and Temporary Type questions.
- Existing model, score interpretation, thresholds, timeout, zero retries, and deterministic router.

**Arm J — Combined experimental classifier**

- Candidate E: **nine Identity `noul` questions**.
- Candidate I: **one Preference `noul`**.
- Original Version 7: **one Frequency `noul`**.
- Candidate H: **one Temporary `noul`**.
- Original Version 7: **one Temporary Type `choice`**.
- **13 questions total, in ONE Jev request per note**, using the flat `COMBINED_J_QUESTIONS` object.
- Aggregate Identity using `candidateIdentityScore` (maximum of nine scores), then use the exact original Version 7 `decideClassification` logic. The maximum is an experimental routing score, **not a calibrated probability of the union**.

Both arms:

- Model: `jev-latest`; record the exact returned model version.
- Input per request: `{ note: testCase.note }` **only**.
- Include threshold: `0.75`; exclude threshold: `0.25`; Temporary Type threshold: `0.70`.
- Timeout: eight seconds; retries: zero.
- Keep the same question decoding and routing conventions as the verified existing adapter.

**Never send the model the answer key** (`expectedCategories`, `expectedIdentityFields`, `expectedTemporaryType`, `expectedHasRunnableBoundary`, case ID, or group name). Gold labels are only for local scoring.

## 2. Strict preflight: no Jev calls until all pass

1. Verify that all supplied files parse as TypeScript.
2. Verify exactly 100 unique note strings and 100 unique case IDs. All must be `fresh`.
3. Confirm `COMBINED_J_QUESTIONS` contains exactly nine independent Identity questions, Preference, Frequency, Temporary, and Temporary Type; total **13**. No broad Identity `noul` in Arm J, and no duplicate Preference or other questions.
4. Verify the individual question bodies against the exact verified versions (E, I, Version 7, H, Version 7), using the supplied assembled file and, where available, its source manifest. Do not improve, shorten, normalize, or rewrite any prompt. Do not add instructions to the Jev input.
5. Confirm the Version 7 router and all three thresholds are unchanged. Route each arm using the same deterministic function; Arm J's Identity category uses the nine-field maximum.
6. Confirm the current production file and application files will not be changed. Save experiment scripts and outputs **outside the repository**, e.g. in the OS temporary directory.
7. For uncertain scores (`0.25 < p < 0.75`), verify the existing router returns `needs_review`, not an automatic route.
8. Fail preflight if an expected source, actual SDK adapter, decoding convention, or required configuration cannot be verified.

Do not alter gold labels in response to model outputs; raise any ambiguous labeling for human review *after* reporting the original scores.

## 3. Execute exactly 200 Jev attempts

For each of the 100 fresh notes, perform:

- One call with Arm A.
- One call with Arm J.

Total **200 attempted calls**, with **zero retries**. Alternate which arm runs first for successive notes to reduce order effects. Do not run extra diagnostic or follow-up Jev requests. If a request fails, record the failure and continue; do not rerun.

Evaluate all questions of the respective arm **together in one API request per note**: five questions for A and thirteen for J. Do not call Jev independently for each category or Identity field.

Immediately append each call's raw response, decoded scores, metadata, or error to JSONL in the temporary folder so nothing is lost to terminal truncation. Preserve response provenance and hash production sources before and after.

For each call, save:

- Case ID, arm, exact note, category gold labels, and **all returned category probabilities**.
- For J: all nine raw Identity field scores, plus maximum. For A: the original broad Identity score; do not invent field scores for A.
- Temporary Type selected option and **all option probabilities**, separately from any confidence indicator.
- Included categories, uncertain categories, exact `decideClassification` decision (`routed`/`needs_review`), review reason, and whether `routed` has an empty category list.
- Actual model version, input/output tokens, elapsed time, errors/timeouts.

## 4. Ground-truth interpretation (must preserve)

The four categories are **independent**; a note can contain multiple types of instruction:

- **Identity:** A profile fact belonging to one or more of Candidate E's nine fields.
- **Preference:** A lasting default about what individual social media posts say or look like. A context-specific lasting rule (e.g. a writing rule when discussing mortgages) is still Preference. A separate Temporary instruction does not erase a lasting Preference.
- **Frequency:** How often a topic, post type, or optional feature appears **across different posts**. “Talk more about X” means more posts on X. More words *inside* a single post is Preference, not Frequency.
- **Temporary:** An instruction with a limited post-count or calendar boundary. “Next few posts,” “next handful of posts,” and “next couple of posts” are **`counter`**. The **second agent** is responsible for judging the exact number. Never mark these wrong simply because they do not specify a digit. A dated post or bounded calendar interval is `date_range`.

A vague span with **no identifiable boundary kind** (“for a little while”) remains `unclear` under the existing Choice. A single note containing **two independent, incompatible Temporary boundary kinds** also expects `unclear` because the current one-choice output cannot faithfully express both. This is a representation limit, not a license to silently choose one instruction and discard the other.

Recurring weekday schedules without a finite end were deliberately excluded as outside current scope.

## 5. Report both accuracy and routing safety — do not conflate them

**Category recognition:** For each arm and each of the four categories, calculate TP, FN, FP, uncertain negatives, precision, recall. A genuine category scoring below `.75` is a missed confident inclusion, even if the overall note went to review. On an absent category, `.25 < p < .75` causes unnecessary uncertainty; do not count it as a true negative.

**Whole-note recognition:** Exact included category-set match, exact-match rates by fixture group, and full error rows with exact note, gold categories, both arms' probabilities and actual routing. Also show exact match for all nine Candidate E Identity fields for Arm J; the original broad Identity question has no comparable field-by-field output.

**Temporary boundary:** Score all Temporary notes separately: `counter`, `date_range`, `unclear`. Account for selected-option probability versus the fixed `.70` routing threshold. Explicitly evaluate the two fuzzy-count controls (“few” and “handful”) as valid counter selections. The second agent's final numeric choice is **not part of this experiment**.

**Routing:** Report separately, for each arm:

1. Correct automatic routes: `routed`, the complete category set is correct, and any Temporary Type is correct and representable.
2. Unsafe/silent misroutes: `routed` with any missing category, invented category, or wrong/unrepresentable Temporary Type.
3. Necessary reviews: `needs_review` where gold Temporary Type is inherently `unclear` under the current representation.
4. Unnecessary reviews: `needs_review` on a fully specified, otherwise representable gold-labeled note.
5. Empty-category routes: `routed` with `categories: []` on the 14 non-actionable cases. **Report these separately; the classifier's `routed` result does not establish what the rest of the application does with an empty category list.**
6. Review reason breakdown: `routing_uncertainty` versus `temporary_type_uncertainty`, and which individual scores caused the review. Note that category uncertainty can mask Temporary Type uncertainty due to router order.

Do not use a single “correct routing” number that combines automatic routes, unnecessary review, and genuinely required review as if they were the same outcome. You may provide an additional safety metric (`reviewed OR routed correctly`) but label it distinctly.

**Efficiency:** Paired request token count (input, output, total), median/P90 latency, actual failures/timeouts, and cost difference if the price source is known; otherwise report token differences only. Arm J has more questions, so compare **one request per arm**, not 13 separate requests.

**Evaluation scope:** These are 100 manually constructed challenge notes. They measure behavior on this synthetic holdout, not a statistically representative real-user error rate. Do not claim production reliability from one run.

## 6. Final output

Provide the following tables, with complete machine-readable raw artifacts saved locally:

1. **All four category metrics** for A versus J (TP/FN/FP/uncertain negatives/precision/recall).
2. **Exact whole-note category accuracy by group** and 9-field Identity accuracy for J.
3. **Temporary Type results**, including fuzzy counters, unresolved duration, and incompatible boundaries.
4. **Routing safety**, with correct automatic routes, silent misroutes, justified vs unnecessary reviews, and empty-category routes.
5. **All errors and uncertain cases**, with exact notes, probabilities, and detailed reasons (CSV if too long for terminal).
6. **Token and latency comparison**, from paired successful calls.

Produce a short, evidence-based conclusion:

- Is the assembled classifier better than original Version 7 on this fresh holdout?
- Does it maintain Candidate I's mixed Preference + Temporary improvements?
- Does it preserve Version 7 Frequency's across-post distinction?
- Does it recognize Identity without excess field false positives caused by maximum aggregation?
- Does Candidate H retain Temporary recall while controlling advisory-question false positives?
- Does the unchanged Temporary Type Choice select `counter` for “few” and “handful”?
- What specifically remains wrong, and which errors would silently change the wrong user settings?
- Which problems are due to Jev's classification versus the existing router versus the current single-choice representation?
- Should Combined J remain experimental, or is there enough evidence to propose a separate, user-approved production integration?

**Restrictions:** no repository changes, no database operations, no app deployments, no prompt edits, no threshold changes, no mutation planner work, no additional AI agents, no model retries, no further Jev experiments after viewing results. Stop after the offline report. Share exact filesystem paths of the saved raw JSONL, JSON, and CSV artifacts. Do not claim Combined J has been deployed or production-tested.
