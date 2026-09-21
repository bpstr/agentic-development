# Agent harnesses and cross-session continuity

An agent harness is the surrounding system that supplies a model with context, exposes tools, executes permitted actions, records progress, and decides when work continues or stops. It can contain an agent loop, storage, runtime controls, and environment preparation. A model alone is not that executing system.

[Anthropic's long-running-agent case study](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) describes initialization and incremental progress across context windows. Its useful general lesson is that a fresh session needs recoverable task meaning as well as recoverable process state; its particular files and prompts are implementation choices, not a universal contract.

## Distinguish the boundaries

| Component | Question it answers |
| --- | --- |
| [Agent loop](agent-loop.md) | How does an inference lead to an action and another observation? |
| [Durable execution](durable-execution.md) | What survives a crash, and how are unresolved effects recovered? |
| [Context engineering](../context/context-engineering.md) | What evidence and instructions enter this inference? |
| Cross-session handover | What remains to do, what is actually verified, and what must be rechecked? |

A worker can resume its queue position perfectly while a new model session misinterprets a prose summary and repeats completed work. Conversely, a detailed progress note cannot reconcile an external write whose result was never recorded.

## Hand over evidence rather than confidence

For a webhook-deduplication change, an **illustrative handover record** might be:

```json
{
  "task_id": "change-84",
  "goal": "Deduplicate webhook events without changing responses",
  "artifact": {"repository": "example/app", "revision": "rev-17"},
  "verified": [
    {"requirement": "S1", "check": "duplicate delivery", "receipt": "test-run-9", "revision": "rev-17"}
  ],
  "unverified": ["S3 concurrent duplicate handling", "S4 crash recovery"],
  "next_action": "Run concurrency fixture against the test database",
  "constraints": ["no deployment", "no unrelated refactors"],
  "refresh_before_use": ["repository revision", "task instructions", "actor permissions"]
}
```

The names and revision are example identifiers. A production receipt must resolve to actual evidence: test command, environment, exit status, relevant output, and tested artifact revision. A self-reported checked box is not a receipt. Record unresolved side effects separately in the operation ledger, not only in the handover text.

At session start, resolve the current authorized task, inspect the actual artifact, compare it with the handover revision, and check the evidence. If the code changed, invalidate affected verification instead of carrying its green status forward. Reload current permissions after an approval wait. A handover's `constraints` field records intent; it does not grant authority.

## Keep progress bounded and owned

Separate proposed work, in-progress work, verified completion, blocked work, and cancelled work. Persist a small completed unit before moving on. Use a lease or another ownership mechanism when workers may overlap, and reject stale writes rather than merging competing progress notes by last arrival.

Context rollover should not reset the task's total spending, elapsed-time budget, or authority. Keep those controls outside model-written notes. Stop when the next step needs missing evidence or a decision that cannot be derived safely. A new session is not a reason to broaden scope.

Test a clean rollover, a crash during a tool call, a missing test receipt, a changed branch head, a revoked permission, two workers resuming together, and exhausted task-wide budgets. Verify that completed effects are not repeated and that incomplete work does not become “done” merely because a summary says so. Use a direct bounded loop for short tasks where a cross-session harness adds no useful recovery behavior.
