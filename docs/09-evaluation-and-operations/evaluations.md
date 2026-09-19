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

## Make comparisons reproducible

Save dataset revision, model identifier, generation settings, prompt revision, tool schemas, application commit, and retrieval snapshot or freshness policy. Use a held-out set so repeated prompt tuning does not become memorization of examples. Repeat representative live cases when nondeterminism matters, report counts alongside percentages, and examine failures individually.

A change is ready when it meets task-quality requirements without violating security, cost, or latency constraints. Keep these dimensions visible rather than hiding a serious regression inside an averaged score.

The [offline example's behavioral tests](../../examples/tool-loop/agent-loop.test.mjs) exercise several of these boundaries without calling a model provider.

**Source review:** 2026-09-19. The fixture is an original design example. This handbook has not run it against any provider.
