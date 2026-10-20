# PostPooch Jev-only benchmark L

**Goal:** Choose among the current Jev question sets **V7**, **Combined J**, and **Combined J with Candidate K Preference**, using the clarified boundary between category relevance (Jev) and exact intent resolution (the next AI agent).

This ZIP contains the **three exact verified question-source snapshots**, a **264-note fresh benchmark** in both JSON and TypeScript, **24 diagnostic replays**, an explicit scoring rubric, and complete Codex instructions. Each candidate uses the existing deterministic routing function and thresholds.

### The experiment

| Item | Count |
| --- | ---: |
| Fresh notes | 264 |
| Fresh groups | 22 × 12 |
| Fresh relatively unambiguous labels | 216 |
| Fresh interpretation-sensitive labels | 48 |
| Diagnostic replays (not counted as fresh) | 24 |
| Arms | 3: V7, J, K |
| Repetitions per note/arm | 3 |
| **Total Jev attempts** | **2,592** |
| Second-agent/model calls | **0** |

**Start by reading `SCORING-RUBRIC.md`, then `CODEX-EVALUATION.md`.** Copy the whole folder somewhere Codex can read. Tell Codex to run the experiment, with **zero production edits**, and return the metrics and exact saved paths. Only the original note text is provided as Jev input.

**Key correction from earlier evaluations:** A quoted client suggestion or advisory question can be *relevant to a Jev category* even though the downstream agent has not yet decided whether to carry out the proposed change. A quote that is explicitly only for transcription, or a request for an unrelated app feature, can still have no relevant posting category. `routed: []` does not prove the app will respond appropriately.

**Interpretive cases are deliberately separate.** The 12 contrast pairs each have one actionable/relevant side and one explicitly no-action/background side. The benchmark reports both categories and repeat-to-repeat consistency; it does not judge which specific color, posting ratio, or exact count the second agent should choose.

Do not rely on scores from previous reports without re-scoring their labels under this rubric. The earlier verdict that all quotes and questions were inherently non-actionable is not valid under this clarified policy.
