# Codex execution protocol — PostPooch Jev Benchmark M

**Goal:** A frozen, controlled **Jev-only** comparison of an existing strong classifier (Combined J) versus two minimal attempts to stop forwarding **explicitly non-adopted** third-party instructions, WITHOUT losing relayed requests, advisory suggestions, or actual replacement instructions.

**Read in order:** `SCORING-RUBRIC.md`, this file, `README.md`, `manifest.json`. Check source files before the first Jev request. No production modifications; no second-agent calls.

## 1. Exact candidate arms

Source inputs in this folder:

- `postpooch-combined-classifier-j.ts`: identical to previously verified Combined J; all 13 questions, existing `candidateIdentityScore`, thresholds and `decideClassification`.
- `candidate-relevance-m-n.ts`: exports the exact question maps for all arms.
- `relevance-holdout-m.json` and `.ts`: the **identical** cases/labels in two representations.
- `SCORING-RUBRIC.md`: the annotation contract. Do NOT send it to Jev.
- `manifest.json`: SHA-256 hashes and expected counts.

Compare EXACTLY:

**J:** `QUESTIONS_J`: the unchanged thirteen-question Combined J classifier. This is the current experimental leader, NOT necessarily deployed.

**M:** `QUESTIONS_M`: J except for **one appended sentence pair** in the false description of the existing Temporary `noul`. There is no new question. The positive definition and question text are unchanged.

**N:** `QUESTIONS_N`: M plus equivalent short disqualification wording in the false descriptions of the existing Preference and Frequency `noul`s. Question texts and positive descriptions unchanged. Nine Identity questions and Temporary Type remain the same.

The two candidate arms have no new gating question, no additional model calls per note, and do not perform agent tasks. All 3 arms submit **13** questions together in one Jev call per note.

Do not compare to production Version 7 in this experiment or invoke Candidate K. The benchmark is intended to determine whether a limited *relevance* edit beats the top-tier J baseline. Do not tweak candidate wording after viewing outputs.

## 2. Mandatory preflight: ZERO Jev calls until complete

1. Extract (or copy pre-extracted, if present) files into a fresh **operating-system temporary directory outside the PostPooch repository**. Do not overwrite project files.
2. Verify every file's SHA-256 against `manifest.json`. Confirm the J source hash matches the supplied known Combined J hash (`e10d8e72a2c40625318dcfc24584f5923b90725817f71dd3f042513fe7ba5ad0`); if the project has an older verified J snapshot, it must match. Do **not** recreate missing source files from memory.
3. Compile/transpile sources and fixture using the existing TypeScript toolchain. Verify each arm has 13 questions, same key names and ordering; the **only** variation is the false text of `temporary` for M, and additionally the false texts of `preference` and `frequency` for N. Verify all Identity question descriptions, all positive criteria, all question wording, and Temporary Type are identical. Verify max aggregation, original router, `.75/.25/.70` thresholds, and `jev-latest` are unchanged.
4. Verify JSON and TypeScript fixture contain exactly the same **312 unique** notes: **288 fresh (24 groups of 12), 24 replays**, with **216 fresh high-confidence**, **72 fresh interpretive**, 36 matched `pairId`s, two notes per pair. Validate category labels, exact Identity fields, and boundary types; all 72 paired sides must be present, 36 positive/36 explicit negatives.
5. Check fresh note text against previous Benchmarks L/J/K and any locally available prior fixtures to ensure no exact repeats. Diagnostic replays MUST NOT be counted as new holdout evidence.
6. Confirm the project's actual working TypeSafe Jev adapter can submit one question map and decode `noul` probabilities and `choice` distribution. No separate calls for each question. Match project's verified **8-second timeout** and set **zero retries**, including SDK/transport defaults.
7. Hash any source files inspected in the actual project **before and after** the run. Stop before requests if preflight cannot verify the requested source or settings. Only exception: a documented Windows path concatenation bug in a validation helper may be corrected in an **OS temp copy**, without altering benchmark inputs, hashes or questions.
8. Pre-register the primary metrics and guardrails in `SCORING-RUBRIC.md`. Do not change expected classifications after observing model results.

## 3. Execute exactly 2,808 attempts; ZERO retries

For repeat indexes `r=0,1,2` and all 312 fixture cases in original order (`i=0..311`), send **one request per arm** sequentially. `arms = ['J','M','N']`; rotate within each case using `arms[(i+r+j) % 3]` for position `j=0,1,2`.

- **Total:** `312 notes × 3 arms × 3 repeats = 2,808 attempted Jev calls`, **936 attempts per arm**.
- For every request supply Jev state **EXACTLY** `{ note: case.note }`. No ID, category, expected answer, group name, explanation, rubric, pair ID, cohort, model instruction or benchmark context goes into state.
- Use exactly the frozen arm's question map; response decode must use Jev's actual output semantics (Noul yes-probabilities; Choice selected label, full distribution, selected-option probability and `confidence`).
- **Append** one record for every response or failure to `records.jsonl` immediately before starting the next call. Record `(caseId,arm,repeat)` as the unique attempt key, exact note, arm, repetition, order position, all 9 Identity field probabilities, max Identity score, Preference/Frequency/Temporary scores, Temporary Type option probabilities/selected option/confidence, router output, model version, SDK tokens and request elapsed milliseconds. Do not print secrets/tokens.
- Zero retries even for timeouts, rate limits, network errors or 5xx responses. On interruption, resume from saved JSONL keys **without attempting any existing key again**. An error counts as an attempt. If environment is interrupted permanently, analyze completed pairs and clearly mark incomplete rather than exceeding authorized count.
- Do not inspect scores or tune questions during collection; only run frozen protocol. Stop at 2,808 attempts; no extra Jev calls.
- Run no other AI models, web/LLM classifier, mutation planner or second-agent processing. No application changes, deployments, database, AWS, or external writes beyond model calls and local temp artifacts.

## 4. Offline evaluation — no Jev calls

Score only the persisted raw results. Follow `SCORING-RUBRIC.md` literally. Keep these **three** cohorts separate:

- 216 fresh high-confidence notes (primary, clearer labels)
- 72 fresh interpretation-sensitive notes (relay/advice)
- 24 diagnostic replays (known cases; never used to claim out-of-sample gains)

**Required complete deliverables:**

1. `report.md`: recommendation and key numbers, with primary findings and caveats.
2. `records.jsonl`: append-only all raw or decoded Jev attempts/errors.
3. `all-results.json` and `all-results.csv`: one row per arm/case/repeat containing full probabilities and routing.
4. `category-metrics.csv`: TP/FN/FP/uncertain negatives, precision, recall for all four categories and each cohort, including per-category confidence-bucket breakdowns.
5. `group-metrics.csv`: exact category sets, relevant-category recall, correct automatic routes, incorrect automatic routes, correct/incorrect empty sets, review outcomes for **all 24 fresh groups** and replays, per arm.
6. `target-nonadoption.csv`: each of 36 fresh explicit-nonadoption notes × repeats × arms; exact note, all probabilities, included set, uncertainty categories, route, false categories; aggregate by Temporary, Preference, Frequency target group.
7. `replacement-and-relay.csv`: each fresh positive replacement and separately the 72 interpretive relay/advisory cases, with full classifications and all category misses.
8. `matched-pairs.csv`: each 36 pair IDs × arm × repeat showing both positive and negative predictions, both scores, both correct status, and pair success.
9. `all-errors-and-uncertainty.csv`: all wrong confident inclusions, missed categories, wrong Identity fields, wrong Temporary Types, incorrect nonempty/empty routes, reviews and all `.25 < p < .75` scores. Exact note text required.
10. `routing-summary.csv`: correct nonempty, incorrect nonempty, justified reviews, unnecessary reviews, correct empty, incorrect empty, separately tracking silent omissions vs extra categories. **Do not assume `routed: []` means the user gets no response.**
11. `identity-fields.csv`: field-wise TP/FN/FP, uncertain negatives, and exact field-set accuracy for all J/M/N.
12. `temporary-types.csv`: original Temporary Type selection, its option probability, correct/incorrect counter/date_range/unclear, and reviewed vs routed. `few`, `couple`, and `handful` are valid **counter**.
13. `repeat-stability.csv`: same category buckets/included sets/route across three repeats, unanimity and majority outcomes per note, by arm/cohort.
14. `paired-bootstrap.csv`: paired note-clustered 95% intervals for M−J, N−J and N−M across target error rate, legitimate-category recall, exact-set correctness, and incorrect automatic route. Preserve matched quote-pair clusters for pairs.
15. `usage.csv`: input/output/total tokens, tokens per call, median/P90 latencies, failures/timeouts; compare paired successful attempts.
16. `experiment-manifest.json`: exact package hashes, monitored before/after project source hashes, request counts, SDK config and results-file SHA-256 hashes.

**In the human report explicitly list** which quoted non-adoption notes remain wrong, which relayed/advisory proposals were incorrectly rejected, which mixed replacement instructions were lost, and all new silent misroutes.

## 5. Select a winner ONLY by the pre-registered rules

Apply the explicit primary improvement and non-regression criteria from `SCORING-RUBRIC.md`, rather than simply picking the best overall average:

- Did the candidate actually reduce spurious confident categories on the 36 **high-confidence explicit disclaims** by at least 10 pp, with paired evidence supporting a real difference?
- Did it preserve relevant-category recall in the high-confidence core and in the interpretation-sensitive relay/advice cases, within the 2 pp guardrails?
- Did it avoid new incorrect automatic/empty routes, Identity-field errors, or Temporary Type errors?
- Did matched-pair accuracy improve without refusing legitimate quotes/questions?
- Are there material token/latency costs?
- Is M (one change) enough, or does N (three changes) provide validated incremental benefit without regression? If indistinguishable, choose M. If neither meets the criteria, retain J.

A test winner is only a **preferred experimental Jev configuration**, NOT approval for deployment or certification of second-agent behavior.

After the complete report, stop. Do **not** change production files or propose/run additional uncontrolled requests.
