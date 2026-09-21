# Evaluator–optimizer pattern

The evaluator–optimizer pattern generates a candidate, evaluates it against an explicit rubric, and revises it using concrete findings. It stops when the result meets the criteria or a limit is reached. [Anthropic's workflow guidance](https://www.anthropic.com/engineering/building-effective-agents) identifies it as useful when criteria are clear and iterative feedback can improve the result.

This is a bounded workflow for one artifact, not autonomous model training. It differs from [prompt optimization](../infrastructure/optimization/prompt-optimization.md), which changes instructions or demonstrations for future requests, and from [planner–executor orchestration](planner-executor-pattern.md), which separates planning work from carrying it out.

## Evaluate something observable

For a release-summary draft, hold the source packet and rubric fixed while testing revisions:

| Criterion | Evidence or check | Revision feedback |
| --- | --- | --- |
| Every confirmed blocker is included | Required issue IDs and reviewed source claims | Identify the missing blocker |
| Citations resolve to supplied evidence | Document IDs, revisions, and spans | Identify the absent or invalid reference |
| No invented commitment appears | Claim compared with source facts | Identify the unsupported statement |
| Output follows the requested structure | Deterministic section validation | Name the missing section |

A second model may assist semantic checks, but its agreement is not independent proof. Prefer deterministic validation for exact identifiers and structure; calibrate subjective grading against reviewed examples. See [model output evaluation](../operations/evaluation/model-output-evaluation.md).

## Bound the revision loop

This is **application pseudocode**, not an SDK example. A maximum of three candidates means an initial draft and at most two revisions.

```text
sources = load_authorized_source_snapshot()
rubric = load_fixed_task_criteria()
feedback = none
for attempt in 1..3:
    require_remaining_time_and_cost_budget()
    candidate = generate_draft(sources, rubric, feedback)
    require_remaining_time_and_cost_budget()
    verdict = evaluate(candidate, sources, rubric)
    persist(candidate_revision, source_revision, verdict)
    if verdict.status == "pass":
        return validated_draft(candidate)
    if verdict.status in ["insufficient_evidence", "evaluation_error"]:
        return blocked_draft(candidate, verdict)
    feedback = verdict.actionable_findings
return incomplete_draft(candidate, verdict)
```

A missing source is not fixed by repeatedly rewriting a claim. A failed evaluator is not a failed artifact, and neither is a pass. Record timeout, cancellation, insufficient evidence, and exhausted revision budgets distinctly. Each call needs its own timeout and bounded output; loop count alone does not cap total elapsed time or spending.

If additional evidence is required, resolve it through a separately bounded retrieval step and record a new source snapshot. Re-evaluate the affected claims against that revision. Never silently relax the rubric because the current artifact cannot pass.

## Keep validation separate from publication

A passing draft remains a draft when that is what the user requested. Publication, external messaging, or applying a code patch is a separate authorized effect with its own approval and idempotency rules. Do not put an irreversible write inside the revision loop.

Retain the last inspectable candidate with its unresolved findings when work stops, but do not label it accepted. When revisions oscillate or repeat the same failure, stop rather than rewarding increasing verbosity.

Test a first-pass success, one successful correction, exhausted attempts, an evaluator timeout, an unsupported date rewritten more persuasively, a source changed during review, and cancellation before publication. Include a candidate that tells the evaluator to ignore its rubric; candidate text is evaluation data, not an instruction source.
