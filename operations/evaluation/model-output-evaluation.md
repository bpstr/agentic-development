# Model output evaluation

Model output evaluation checks whether a particular generated result meets its contract. It is narrower than evaluating a complete agent run: a good answer may follow an unauthorized action, and valid structured output can still refer to the wrong record.

Choose checks according to the output. Parse structured objects and validate required fields deterministically. Compare identifiers and numeric facts against authoritative inputs. Grade prose for relevance, completeness, and factual support, allowing equivalent wording when exact phrasing is not required.

For a release summary, useful criteria include every confirmed blocker being mentioned, every citation resolving to supplied evidence, and no unsupported deadline being asserted. These are separate checks; a single “quality” score can hide an unacceptable factual error.

Model judges can help assess meaning at scale, but their outputs depend on the rubric, examples, model, and supplied evidence. Calibrate them against human-reviewed cases and inspect disagreements. [OpenAI's evaluation guidance](https://developers.openai.com/api/docs/guides/evaluation-best-practices) discusses task-specific testing and grader choices.

Use paired comparisons on the same inputs when comparing prompt or model revisions. Retain raw outputs and judgments so a score change can be investigated. Repeated sampling exposes variability; one success does not establish reliability. Report case counts and failure categories alongside aggregate scores, latency, and cost.

## A grader that distinguishes evidence from presentation

Consider this **illustrative source packet**: issue T-42 blocks release R7; its current owner is Mila; no release date has been approved. Compare two outputs against the same packet, with candidate names hidden from the grader.

| Check | Output A: “R7 is blocked by T-42, owned by Mila. No approved release date is recorded.” | Output B: “Mila will resolve T-42 and ship R7 on Friday.” |
| --- | --- | --- |
| Required blocker mentioned | Pass | Pass |
| Owner agrees with the source | Pass | Pass |
| No unsupported deadline or commitment | Pass | Fail |
| Approval to publish | Not established by this check | Not established by this check |

Output B may sound more actionable but invents both a commitment and a date. A style preference must not override that factual failure. Verify exact identifiers in code; use a semantic grader only where interpretation is needed. Give that grader the relevant source, a criterion-specific rubric, and an `insufficient_evidence` outcome rather than requiring a guess.

To calibrate, have a reviewer label supported, contradicted, and unsupported claims in a small set of representative packets. Inspect false passes separately from false failures: a judge that accepts fabricated commitments is unsuitable even when its overall agreement is high. Include a verbose unsupported answer, a concise correct answer, changed identifier spelling, conflicting source revisions, and instructions embedded in the candidate output. Treat candidate text as data, not grading instructions.

Randomize candidate order for pairwise judgments and check whether swapping the order changes preferences. Save the rubric, evidence revision, judge configuration, and raw judgments. Neither a different judge model nor multiple agreeing judges automatically supplies independent ground truth. Whole-run reliability and repeated-trial interpretation belong in [agent evaluation](agent-evaluation.md).
