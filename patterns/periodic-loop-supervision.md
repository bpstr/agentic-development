# Periodic loop supervision

Periodic loop supervision reviews evidence across worker sessions and adjusts the execution strategy when work drifts or stops making useful progress. A simple runner keeps launching bounded work; a separate reviewer asks whether continuing in the same way is still useful. The original requirements remain authoritative.

This is a loop-engineering pattern: it closes a feedback loop around repeated execution. Scheduling determines when the reviewer becomes eligible; the supervision contract determines what it observes, may change, and must verify. It does not guarantee convergence or eliminate every stuck operation.

## Separate the control loops

| Layer | Question | Responsibility |
| --- | --- | --- |
| [Model/tool loop](../infrastructure/orchestration/agent-loop.md) | What action comes next? | Request tools, consume observations, and continue within one session. |
| Worker-session runner | Should another session run? | Reconstruct state, launch bounded work, capture outcomes, and enforce lifecycle limits. |
| Periodic supervisor | Is the sequence advancing the approved goal? | Inspect several sessions, diagnose stagnation or drift, and propose a strategy correction. |

A [cross-session harness](../infrastructure/orchestration/agent-harness.md) can contain all three. This differs from a [delegation supervisor](supervisor-pattern.md), which dispatches specialists and integrates their results, and from an [evaluator–optimizer](evaluator-optimizer-pattern.md), which revises an artifact against feedback. Here the review concerns the execution trajectory, not only the latest output.

Microsoft's [Magentic-One architecture](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/magentic-one.html#architecture) is a related implementation: an orchestrator uses task and progress ledgers and revisits its plan after stalled progress. Its multi-agent architecture does not establish that an independent hourly reviewer is optimal. The file-based design below is an application pattern, not a standardized protocol.

## Separate requirements, working state, and history

A small implementation can use ordinary files with explicit ownership:

| Artifact | Authority and purpose |
| --- | --- |
| `GOAL.md` | Operator-owned requirements, stable acceptance IDs, and scope; read-only to worker and supervisor. |
| `WORKFLOW.md` | Current strategy and next batch; supervisor proposes edits, a constrained publisher validates and applies them. |
| `progress.json` | Runner-owned lifecycle state, current work, evidence references, and review cursor; worker claims are recorded separately from verified outcomes. |
| `runs/` and `reviews/` | Versioned run evidence and review decisions, with bounded retention and access controls. |

These names illustrate responsibilities, not required filenames. Avoid multiple unsynchronized writers to the same fields. A worker consumes one validated workflow snapshot for its session and checkpoints before another worker starts. Record goal, workflow, and artifact revisions so a reviewer does not inspect an inconsistent mixture of live edits.

Keep the active handoff small and replace superseded instructions in place. Archive historical snapshots and raw logs separately; retrieve specific older evidence only when needed. Bound active context, per-run output, review duration, and total archive storage independently. An append-only journal should not become the next session's entire prompt. [Context compaction](../infrastructure/context/context-compaction.md) can help select working information, but cannot turn a summary into authoritative evidence.

[Anthropic's long-running harness case study](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) illustrates incremental work and handoffs between context windows. Persistence supplies continuity; supervision adds the separate decision to retain or revise an ineffective strategy.

## Choose review triggers explicitly

| Trigger | Useful property | Limitation |
| --- | --- | --- |
| Independent wall-clock schedule, such as hourly | Can inspect runner state while a worker is still active. | Review generation and safe publication add delay; the tick is not an intervention deadline. |
| Every N finished or timed-out workers | Reviews complete session outcomes at a natural boundary. | Cannot fire merely because an unfinished worker is taking too long. |
| Evidence-triggered review | Can react to repeated failure signatures or invalidated assumptions. | Noisy signals can create excessive or self-triggering reviews. |

A hybrid may combine these, but route them through one review coordinator. Define whether an early review resets the periodic deadline. Use a stable occurrence/review identity and a single-flight lock or lease. Record scheduled time, actual start, evidence cutoff, and applied revision. After sleep or an outage, coalesce missed ticks into one current-state review instead of replaying obsolete corrections.

The [Kubernetes CronJob documentation](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/#job-creation) describes approximate scheduling and possible duplicate or missed job creation. That motivates idempotent review handling; it is not a reason to require Kubernetes. [Scheduled-run recovery](../operations/reliability/scheduled-run-recovery.md) covers occurrence identity, ownership, and reconciliation in more detail.

A tick means inspect, not edit. Prefer no change when the plan is healthy or no new evidence warrants correction. Stop routine paid reviews after a terminal outcome. An optional final acceptance audit is a separate gate, not an assumption that the last worker's status proves completion.

## Diagnose the kind of stuck work

A process can be alive while its strategy is ineffective, and a good strategy can be waiting on a hung tool. Route those failures differently:

| Observation | Appropriate response |
| --- | --- |
| Tool never returns, interactive login wait, or abandoned subprocess | Runtime deadline, authorized cancellation, cleanup, and recovery—not a workflow rewrite. |
| Recognized provider-capacity failure | Bounded retry/backoff; missing credentials or exhausted authority may require escalation. |
| Repeated rediscovery or unchanged failed feature check | Preserve the evidence and target the missing implementation or unresolved question. |
| New child tasks no longer serve an original criterion | Remove the drift from active work without discarding the audit history. |
| A prerequisite is unavailable | Record its unblock condition and choose other authorized ready work when available. |
| Useful dependency work advances without closing a parent checkbox | Continue or refine the batch; do not classify progress only by checkbox count. |

Use explicit diagnoses such as `HEALTHY`, `SLOW`, `STUCK`, and `UNCERTAIN`, supported by run IDs and evidence. Missing or truncated records should produce uncertainty. Separate runner-observed facts, worker assertions, and [verification results](../development/coding-agents/coding-agent-verification.md). A receipt must resolve to an actual check, tested revision, environment, result, and relevant output. A changed artifact may invalidate older passing evidence.

A failed feature check is durable information. Normally repair the relevant implementation before rerunning that unchanged check. Allow explicit diagnostic, baseline, flakiness, or reproduction work, and checks motivated by changed code or environment. This prevents verification churn; it is not a ban on test-driven development or early targeted testing.

Timeouts, cancellation, permissions, and task-wide budgets must remain effective without the reviewer. A workflow edit cannot unhang the active process. Before replacement work starts, the runner must finish or isolate the old worker and reconcile uncertain external effects. [Durable execution](../infrastructure/orchestration/durable-execution.md) explains why a timeout does not prove that a remote write failed.

## Change the strategy without changing success

The supervisor may reorder ready work, split a batch, identify a prerequisite, or improve the verification approach. It must not remove original requirements, weaken acceptance criteria, increase budgets, expand permissions, or rewrite tests to manufacture success. Map every next-batch target back to an original criterion. Operator changes to the goal require a new revision and reconciliation of existing work.

Return either no change, a small proposed workflow patch, or a request to pause/escalate. Record the base goal/workflow revisions, artifact snapshot, evidence cutoff, diagnosis, expected next-batch evidence, and a keep/revert/escalate condition. Review the outcome of the previous intervention before proposing another. Give a correction a bounded opportunity to work rather than reversing it at every tick.

Publish accepted changes at a worker boundary. Stage the complete replacement; validate structure, permitted fields, criterion references, current authorization, and unchanged requirements. Under a publication lock, compare the expected base revision and recheck relevant preconditions against the latest completed work. Reject stale proposals. Replace the file atomically on the same filesystem; atomic replacement alone does not prevent lost updates or guarantee crash durability. Keep publication identity and applied revision recoverable so a crash cannot cause a duplicate intervention.

The current worker finishes against its snapshot; the next worker receives the accepted revision. Do not interrupt healthy execution simply because a review is due. Emergency cancellation belongs to the runner's authorized control path. A supervisor must not become a competing application-code writer.

Preserve the last-known-good workflow if review generation fails, times out, or produces an invalid edit. The operator must choose whether a bounded low-risk continuation is allowed or execution pauses. Keep safety-related uncertainty and exhausted budgets as stop conditions. A broken reviewer is not evidence that every task is globally blocked. Reverting workflow instructions does not undo completed business effects.

Enforce restrictions through scoped tools, permissions, or read-only mounts where required; instructions and hashes are not a sandbox. Treat [logs as untrusted input](../operations/security/prompt-injection.md), redact sensitive output where feasible, and keep authoritative evidence outside unrestricted worker write access. A command printed in a previous log is not permission to execute it.

## Worked intervention

Consider an **illustrative** pagination task: criterion `G3` requires correct cursor-boundary behavior. Three sessions repeat a failing integration check without changing the relevant implementation. Narrow component checks pass, but do not satisfy `G3`.

The supervisor should not drop the boundary case or mark the parent complete. It can retarget the next batch to repair the known failing behavior and then run the affected integration check against the changed revision. A compact review record might be:

```json
{
  "review_id": "review-4",
  "goal_revision": "goal-2",
  "base_workflow_revision": "workflow-7",
  "artifact_revision": "snapshot-12",
  "evidence_through_run": "run-12",
  "evidence": ["run-10", "run-11", "run-12", "receipt-G3-failed"],
  "diagnosis": "STUCK",
  "action": "propose_workflow_edit",
  "criterion_ids": ["G3"],
  "next_batch": "Repair the cursor-boundary behavior before repeating its integration check",
  "expected_evidence": "Relevant implementation diff and integration receipt tied to the new revision",
  "review_after": "Next completed batch",
  "fallback": "If the required service is unavailable, record its unblock condition and select other ready work"
}
```

These identifiers are examples, not recorded results or a provider schema. The publisher validates the proposal; verification decides whether the criterion is satisfied. A green supervisor assessment alone does not establish acceptance.

## Verify the supervisor's effect

Exercise duplicate ticks, concurrent reviewers, stale proposals, interrupted publication, changed goal revisions, injected log instructions, truncated evidence, and reviewer timeout. Confirm that healthy and useful prerequisite work remains stable; rejected corrections leave the active workflow intact; unrelated ready work is not globally blocked; and terminal jobs stop generating routine reviews. Test hung-worker cleanup separately from semantic stagnation. [Schedule testing](../operations/reliability/schedule-testing.md) covers timing and recovery fixtures.

Compare a plain repeater, iteration-based reviews, and independently scheduled reviews on the same task set and total budget, including reviewer cost. Measure verified delivery, correction delay, false stagnation diagnoses, harmful interventions, repeated failures, manual intervention, and false completion—not just review count or running hours. Deterministic fixtures establish control-flow behavior; they do not establish live-model judgment quality or overnight productivity.

For a concrete comparison, [Roadmap Runner's supervision contract at revision 7b2589d](https://github.com/bpstr/roadmap-runner/blob/7b2589d8a5e83756102fc26997c5b4e8c952d9aa/SUPERVISION.md) documents a serialized review after five successful or timed-out workers, not an independent hourly scheduler. Terminal tracking status takes precedence, so that checkpoint is not a final independent acceptance gate. The [AgentGrill hourly-supervisor research brief](https://github.com/bpstr/agentgrill/blob/main/research/loop-engineering-basics/hourly-supervisor.md), dated September 27, 2026, describes the separate file-editing proposal and experiment; its existence is not evidence that the hourly design has been implemented or validated.

Use this pattern when cross-session evidence can reveal mistakes that individual workers repeat. For short, predictable work, a bounded runner and deterministic failure handling may be sufficient. Add supervision only when its corrective value justifies its cost and new failure modes.
