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

## Evaluate revision trajectories

For an [evaluator–optimizer loop](../../patterns/evaluator-optimizer-pattern.md), evaluating only the last response hides whether a later pass destroyed an earlier success. Preserve each candidate, its parent, model configuration, source/contract revision, feedback, checks, selection decision, latency, and resource use.

Separate these quantities:

| Measure | Question |
| --- | --- |
| First-candidate quality | How good was the starting point? |
| Final-candidate quality | What did blind continuation leave at the end? |
| Selected-candidate quality | What would the actual acceptance/stopping policy deliver? |
| Oracle-best quality | What could a retrospective perfect selector have picked? |
| Repair rate | Among prior failures, how many became successes? |
| Regression rate | Among prior successes, how many became failures? |
| False acceptance | How often did the gate promote a genuinely worse candidate? |
| Progress retention | Which previously satisfied requirements were lost? |

The oracle-best candidate uses hindsight or evaluation labels unavailable during deployment. Report it only as a diagnostic bound, never as the implemented system's success rate. Likewise, a deployment selector's highest score is not ground truth. Verify selected outputs with independent final assessment.

Define the unit for repair/regression rates explicitly: whole task, individual requirement, test case, or factual claim. Report numerators and denominators. Do not substitute a large number of correlated test assertions for a large number of independent tasks. Include failure severity: preserving ninety cosmetic properties does not outweigh one broken tenant boundary.

### Design a fair comparison

Use identical starting artifacts and source snapshots for competing policies. Compare a single strong attempt, longer internal reasoning, blind sequential revision, evidence-gated revision, fresh-context critique, and independent candidate selection as separate conditions where relevant. Do not bundle several improvements into one condition and attribute the difference only to model size.

Measure both fixed-call/fixed-iteration behavior and budget-matched outcomes. Tokens, wall time, tool costs, and monetary cost answer different questions; equal turn counts do not imply equal compute. Record exact model identifiers, effort settings, prompts, tool availability, context strategy, and retry policy. Repeat trials across varied tasks and randomize execution order when feasible.

Keep development tasks for prompt, rubric, and stopping-rule tuning separate from held-out evaluation tasks. In code experiments, distinguish tests available to the repair agent from held-out checks used for final assessment. Repeated optimization against one visible test suite can hide untested regressions. For architecture documents, combine requirement-level expert assessment with targeted feasibility evidence; an LLM preference score alone cannot establish buildability.

### Test the evaluator as well as the reviser

[Research on self-preference in rubric-based judging](https://arxiv.org/abs/2604.06996) reports bias even with objectively checkable rubrics. Treat independent authorship, anonymized candidate labels, order randomization, and judge diversity as mitigations to test, not automatic guarantees.

Include deliberately correct artifacts to measure unnecessary edits; seeded defects to measure repairs; fluent but unsupported proposals; verbose regressions; contradictory requirements; evaluator timeouts; test tampering; and repeated naming or architecture oscillations. Inspect rejected improvements as well as accepted regressions.

If the stopping policy repeatedly checks a noisy score, it can eventually select noise as apparent progress. Validate that policy on held-out trajectories and use independent final checks instead of tuning it to favorable intermediate results. Log `no_change`, `blocked`, `incomplete`, and `accepted` distinctly. Documentation or test commands written by an agent are not evidence those checks ran.


### Compare context-continuity policies

When the workflow uses follow-up prompts over the same artifact, record the review lens for each pass as well as its parent artifact. Distinguish targeted passes such as security or failure recovery from generic “review again” prompts; they spend additional calls on different inference problems.

For the same starting artifact, compare at least these policies when context management is under study:

| Policy | What the next pass receives |
| --- | --- |
| Continuous context | Authoritative inputs plus the accumulated conversation |
| Fresh session | Authoritative brief plus current artifact, without prior conversation |
| Fresh + durable state | Brief, current artifact, accepted decisions, evidence, tests, and unresolved risks |
| Independent baseline review | The same baseline artifact in isolation, before earlier review changes are integrated |

Measure requirement retention, new material findings, duplicate rediscovery, unsupported new assumptions, repair/regression rates, cost, and time. For continuous sessions, record when a generated suggestion first appears and whether later passes incorrectly treat it as authoritative. For fresh sessions, record validated constraints that are lost and have to be rediscovered. For durable-state sessions, inspect whether the externalized state itself omitted or distorted an important constraint.

A final fresh-context review can be useful as a test condition because it removes the previous reasoning trajectory, but it is not automatically a better evaluator. Compare it against the same held-out evidence used for other policies.
