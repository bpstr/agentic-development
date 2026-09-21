# Evaluations: answers, actions, and recovery

An **evaluation** applies explicit success criteria to representative tasks. It asks whether the system achieved the intended outcome under specified conditions. A benchmark score for a model cannot establish whether your application resolves tenant permissions, chooses the right record, and saves the correct change. Define task-specific criteria before comparing models or prompts. [Anthropic's evaluation guide](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests).

## Grade the complete outcome

For “Move the login issue to In Progress,” inspect more than the final sentence:

| Dimension | Example assertion |
| --- | --- |
| Entity resolution | The selected issue is the intended login issue |
| Tool correctness | The mutation uses the allowed tool and valid status ID |
| Authorization | The authenticated actor can update that issue |
| Side effects | Exactly one intended record changed; unrelated fields did not |
| Truthfulness | A success claim agrees with the recorded tool outcome |
| Recovery | Retrying after interruption does not duplicate the mutation |
| User experience | Ambiguity produces a useful clarification; completion meets the budget |

Some checks need no model: inspect database rows, operation receipts, typed arguments, or forbidden calls. Reserve human review and model graders for semantic quality that deterministic checks cannot capture reliably. Calibrate a model grader against human examples; its score is another model output, not ground truth.

## Use test layers with different costs

| Layer | What runs | What it proves |
| --- | --- | --- |
| Deterministic fixtures | Recorded or synthetic model events through real application control flow | Parsing, dispatch, permissions, retry handling, persistence |
| Tool contract tests | Actual tool implementation against isolated dependencies | Argument validation and real side-effect behavior |
| Live provider cases | Selected tasks sent to an actual model API | Current model behavior and API compatibility |
| Production sampling | Consented/redacted real runs with outcome checks | Failures and drift in the deployed workload |

**Offline evaluation does not necessarily mean no API calls.** In evaluation platforms it often means running a fixed dataset outside production; the model may still be called and billed. LangSmith distinguishes dataset experiments from evaluation of production traffic. [Evaluation documentation](https://docs.langchain.com/langsmith/evaluation).

Run inexpensive fixtures on ordinary code changes. Run a small live suite when prompts, models, schemas, or adapters change, and broader paid evaluations under an explicit budget. Replaying a successful recorded response verifies your handling of that response; it cannot show that today's model will produce it.

## A useful fixture

This is an **illustrative application fixture**, not a vendor schema:

```yaml
id: reject-cross-workspace-task-update
actor: user-a
workspace: workspace-a
request: "Set TASK-42 to In Progress"
fixture_state:
  TASK-42:
    workspace: workspace-b
    status: todo
injected_model_call:
  tool: update_task
  arguments:
    task_id: TASK-42
    status: in_progress
assertions:
  - tool_denies_access_without_disclosing_existence
  - no_task_changed
  - no_private_task_content_returned
  - final_response_does_not_claim_success
```

Injecting the forbidden call deliberately tests the boundary even if the current model normally avoids it. Add separate cases for valid actions, duplicate delivery, stale permissions, missing records, ambiguous names, tool timeouts, and cancellation after a write has already completed.

## Capability and regression suites

A capability suite explores difficult work the system does not yet perform reliably; a regression suite protects accepted behavior. Keep their results separate. A difficult new research task must not hide a regression in a routine update. Conversely, a perfect score on easy cases says little about newly required capabilities. [Anthropic's agent-evaluation guidance](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) distinguishes these purposes and emphasizes isolated trials.

For example, add a multi-document dependency investigation to capability evaluation while keeping exact-key lookup, ambiguous-name clarification, and cross-workspace denial in regression evaluation. Once the investigation meets the agreed acceptance criteria, retain representative cases as regression protection. Do not change the grader merely to make a candidate pass.

## Measure repeated trials without hiding inconsistency

This **illustrative dataset is not a measured model result**. Each trial starts from an isolated copy of the same task state; P means all required outcome checks pass and F means at least one fails.

| Task | Baseline trials | Candidate trials |
| --- | --- | --- |
| Exact-key lookup | P P P | P P P |
| Resolve an ambiguous title | P F F | P P F |
| Recover a duplicated update | P P F | P P P |
| Reject a forbidden update | P P P | P P P |

The baseline passes 9/12 trials; the candidate passes 11/12. Both succeed at least once on 4/4 tasks, but they succeed in all three trials on 2/4 and 3/4 tasks respectively. Reporting only “every task solved” hides the remaining ambiguity failure. Twelve trials do not establish a population-level improvement; inspect paired failures and repeat a representative suite.

`pass@k` concerns at least one success in k attempts; `pass^k` concerns success in all k attempts. For one hypothetical task with independent attempts and fixed success probability p = 0.8, at k = 3 these probabilities are `1 - (1 - p)^3 = 0.992` and `p^3 = 0.512`. Do not substitute a pooled success rate into these formulas when tasks have different difficulty or failures are correlated. The table above reports observed task-group counts, not a general unbiased benchmark estimator.

Extra attempts are also not free retries in production. A write with an unknown outcome needs reconciliation, not repeated execution until one response looks successful. Count infrastructure failures, grading failures, and application failures separately under a declared policy; never silently discard failed trials.

## Make comparisons reproducible

Save dataset revision, model identifier, generation settings, prompt revision, tool schemas, application commit, and retrieval snapshot or freshness policy. Use a held-out set so repeated prompt tuning does not become memorization of examples. Repeat representative live cases when nondeterminism matters, report counts alongside percentages, and examine failures individually.

A change is ready when it meets task-quality requirements without violating security, cost, or latency constraints. Keep these dimensions visible rather than hiding a serious regression inside an averaged score.
