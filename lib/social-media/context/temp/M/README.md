# PostPooch — Jev relevance experiment M

The next **Jev-only** test after Benchmark L, addressing explicit non-adoption of quoted instructions without losing proposals the realtor wants the next agent to consider.

**Frozen comparisons:**

| Arm | Questions | Changes versus Combined J |
|---|---:|---|
| **J** | 13 | Exactly the verified Combined J baseline |
| **M** | 13 | One small appended clarification to Temporary's `false` criterion |
| **N** | 13 | Same Temporary clarification + matching clarification to Preference and Frequency `false` criteria |

All questions are submitted together in **one** Jev call per note. Identity's nine field questions and Temporary Type are unmodified. Thresholds/router/Identity max aggregation are unmodified. This is **not** a new action/intent detector and does not touch the downstream expensive AI agent.

| Dataset | Notes |
|---|---:|
| Fresh clear/high-confidence | 216 |
| Fresh interpretation-sensitive (bare relays and advisory questions) | 72 |
| Diagnostic replays | 24 |
| **Total** | **312** |
| Repeats per note and arm | 3 |
| Arms | 3 |
| **Total Jev attempts** | **2,808** |
| Matched quote-vs-non-adoption pairs | 36 |

**Start with `SCORING-RUBRIC.md` and `CODEX-EVALUATION.md`.** The benchmark tests a small change in category relevance, not whether the second agent would actually adopt an idea. A bare quote or question can be routed for judgment. An explicit disclaimer with no independent instruction should not be forwarded as a posting change. If a real replacement instruction remains, it must be recognized.

The required experiment is expensive in request count but avoids the separate costly agent entirely. It has **not been run** by the package author. The tests use synthetic, challenging notes and do not estimate production prevalence.

**Files:** verified Combined J source, Candidate M/N question maps, holdout JSON and TypeScript, frozen scoring rubric, full Codex execution/report instructions, validation helper, hash manifest.
