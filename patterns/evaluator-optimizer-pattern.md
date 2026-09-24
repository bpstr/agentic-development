# Evaluator–optimizer pattern

The evaluator–optimizer pattern generates a candidate, evaluates it against an explicit rubric, and revises it using concrete findings. It stops when the result meets the criteria or a limit is reached. [Anthropic's workflow guidance](https://www.anthropic.com/engineering/building-effective-agents) identifies it as useful when criteria are clear and iterative feedback can improve the result.

This is a bounded workflow for one artifact, not autonomous model training. It differs from [prompt optimization](../infrastructure/optimization/prompt-optimization.md), which changes instructions or demonstrations for future requests, and from [planner–executor orchestration](planner-executor-pattern.md), which separates planning work from carrying it out. Additional [reasoning effort](../infrastructure/inference/reasoning-controls.md) inside one inference, sequential revision, and generating independent candidates spend compute in different ways.

## Improvement is conditional

Repeating a request is not an acceptance policy. [Self-Refine](https://arxiv.org/abs/2303.17651) reports gains from feedback and revision on selected tasks, while [Huang et al.](https://arxiv.org/abs/2310.01798) find that intrinsic self-correction can degrade reasoning answers. The [TACL critical survey](https://aclanthology.org/2024.tacl-1.78/) distinguishes narrow favorable tasks, reliable external feedback, and training explicitly for correction. These results do not establish a universally safe model size or iteration count.

A useful diagnostic separates repairs from regressions. In a simplified binary task population, let `a` be the fraction currently correct, `c` the conditional probability of correcting a wrong answer, and `r` the conditional probability of breaking a correct answer:

```text
next_accuracy = a * (1 - r) + (1 - a) * c
expected_change = (1 - a) * c - a * r
```

This is an elementary illustrative model, not a forecast for a repository. With hypothetical `a=0.90`, `c=0.20`, and `r=0.05`, the next accuracy is `0.875`: correcting 20% of remaining failures does not compensate for breaking 5% of existing successes. Real artifacts have correlated requirements, unequal failure severity, and changing transition rates. The practical lesson is to measure both directions, especially as an artifact improves.

A model can miss the same assumption when generating and criticizing. A fresh context or another model changes the evidence exposure or error profile, but does not supply independent ground truth. Instructions such as “find five improvements” also prevent a legitimate no-change outcome. Ask for substantiated defects, not a quota of edits.

## Evaluate something observable

For a release-summary draft, hold the source packet and rubric fixed while testing revisions:

| Criterion | Evidence or check | Revision feedback |
| --- | --- | --- |
| Every confirmed blocker is included | Required issue IDs and reviewed source claims | Identify the missing blocker |
| Citations resolve to supplied evidence | Document IDs, revisions, and spans | Identify the absent or invalid reference |
| No invented commitment appears | Claim compared with source facts | Identify the unsupported statement |
| Output follows the requested structure | Deterministic section validation | Name the missing section |

A second model may assist semantic checks, but its agreement is not independent proof. Prefer deterministic validation for exact identifiers and structure; calibrate subjective grading against reviewed examples. See [model output evaluation](../operations/evaluation/model-output-evaluation.md).

Separate three things in the contract: hard preservation constraints, the target improvement, and optional preferences. A style gain cannot compensate for an invented fact or a broken API. A candidate that meets all hard constraints may still leave the requested goal incomplete. Conversely, an initial draft with known violations is working material, not an accepted baseline.

## Diagnose before mutating

Give a read-only critic the authoritative brief, source revision, candidate, and explicit review scope. Require each finding to identify the violated requirement, artifact location, supporting evidence or counterexample, severity, smallest proposed change, and verification method. Allow `no_actionable_finding` and `insufficient_evidence`.

Confirm the finding before editing where possible. A failing executable test, contradictory requirement, incorrect source citation, or concrete failure scenario is stronger feedback than “this could be cleaner.” The proposal stage should not simultaneously rewrite the artifact it is judging.

Apply only the supported change to an isolated candidate. Keep alternatives separate when the real issue is an architectural assumption: repeatedly editing the same answer can hide which decision produced the gain. A genuinely changed requirement needs a versioned contract and renewed evaluation, not an unrecorded exception.

## Preserve the best verified candidate

Store the latest experiment and the best verified candidate separately. Selection is relative to the inspected evidence, not proof of absolute correctness. An imperfect evaluator can accept a regression; checkpoints make recovery possible but do not eliminate that risk.

This is **application pseudocode**, not an SDK example. The candidate limit includes the initial candidate. Every model, tool, and evaluator call is also bounded by time, output, and cost limits.

```text
contract, sources = load_authorized_versioned_inputs()
working = initial_candidate()
best_verified = none
previous_findings = none

for attempt in 1..candidate_limit:
    require_remaining_time_and_cost_budget()
    verdict = evaluate(working, contract, sources)
    persist(working, verdict, contract.revision, sources.revision)

    if verdict.status in ["evaluation_error", "insufficient_evidence"]:
        return blocked(best_verified, working, verdict)

    if verdict.hard_constraints_pass:
        comparison = compare_to_incumbent(working, best_verified, contract)
        if comparison == "better_or_first_verified":
            best_verified = checkpoint(working, verdict)
        elif comparison == "incomparable":
            return needs_tradeoff_decision(best_verified, working, verdict)

    if best_verified is not none and goal_satisfied(best_verified, contract):
        return validated_draft(best_verified)

    findings = actionable_findings(best_verified or working, contract, sources)
    if no_new_supported_finding(findings, previous_findings):
        break
    if attempt < candidate_limit:
        working = isolated_minimal_revision(best_verified or working, findings)
    previous_findings = findings

return incomplete(best_verified, working, unresolved_findings())
```

`compare_to_incumbent` must evaluate the defined objective and previously satisfied requirements, not simply ask which answer sounds better. No verified incumbent means none is returned as accepted. A verified incumbent whose target goal is unfinished remains explicitly incomplete. Preserve rejected candidates and evaluation receipts separately for diagnosis.

A missing source is not fixed by repeatedly rewriting a claim. A failed evaluator is not a failed artifact, and neither is a pass. Record timeout, cancellation, insufficient evidence, and exhausted budgets distinctly. Loop count alone does not cap elapsed time or spending.

When additional evidence is required, resolve it through a separately bounded retrieval step and record a new source snapshot. Re-evaluate the incumbent and candidate against that snapshot. Never silently relax the rubric because the current artifact cannot pass.

## Stop, reset, or change the search strategy

Stop when the goal passes, no new substantiated defect is found, a budget is exhausted, or revisions repeatedly oscillate. A fixed limit is a safety boundary, not an empirically universal optimum. Calibrate stopping rules on development tasks, then evaluate on separate held-out tasks.

If context contains obsolete alternatives or repeated unsupported claims, reconstruct a fresh review packet from the authoritative brief, accepted decisions, best verified artifact, exact evidence, and unresolved findings. Do not replace that packet with a lossy summary that silently drops constraints. [Context engineering](../infrastructure/context/context-engineering.md) and [working memory](../infrastructure/context/working-memory.md) determine what the next pass actually sees.

When an assumption is uncertain, an independent candidate from the same brief can be more informative than another local rewrite. Compare alternatives under the same criteria before integrating them. Whether this beats sequential revision must be measured under comparable budgets.

## Keep validation separate from publication

A passing draft remains a draft when that is what the user requested. Publication, external messaging, deployment, or merging a code patch is a separate authorized effect with its own approval and idempotency rules. Candidate edits may occur in a sandbox or isolated branch; do not place irreversible production effects inside the revision loop.

For [mass refactoring](../development/coding-agents/coding-agent-verification.md#mass-refactoring-without-semantic-drift), verify behavior preservation and cumulative integration, not just cleaner files. For [architecture specifications](../development/coding-agents/spec-driven-development.md#iterating-on-blueprints-and-architecture-specifications), retain architectural drivers and test failure scenarios rather than rewarding additional components.

Test a first-pass success, one successful correction, correct-to-incorrect revision, rejected regression, exhausted attempts, evaluator timeout, an unsupported date rewritten more persuasively, changed evidence, conflicting architecture tradeoffs, and cancellation before publication. Include candidate text that tells the evaluator to ignore its rubric: the artifact is evaluation data, not an instruction source.
