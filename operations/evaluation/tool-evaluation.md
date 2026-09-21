# Tool evaluation

Tool evaluation checks both the operation selected by an agent and the executor's actual behavior. Valid JSON is only an input-shape check. Correctness also requires the intended target, supported arguments, current authorization, and the expected persistent effect.

For “Assign T-42 to Mila,” inspect entity resolution, the assignment operation, permission enforcement, the saved assignee, and the final claim. A test that accepts any tool named `update_task` misses most meaningful failures.

Use separate layers:

- Inject known tool requests to exercise validation and authorization even when the model would normally avoid them.
- Execute real tool implementations against isolated dependencies to verify persistence and errors.
- Run representative model-driven cases to evaluate selection, arguments, and recovery.

An illustrative deterministic postcondition is:

```python
before = {"T-42": "unassigned", "T-43": "user-b"}
after = {"T-42": "mila", "T-43": "user-b"}
assert after["T-42"] == "mila"
assert after["T-43"] == before["T-43"]
```

In an integration test, read `after` from the real test store. The literal dictionaries here demonstrate the invariant, not a completed tool test.

Include duplicate delivery, stale versions, cancelled requests, partial responses, and unknown commit outcomes. An agent's refusal is insufficient if the mutation already happened. Preserve operation receipts and verify that retries recover completed work rather than perform it twice.

## Compare tool usability

Use the generic and task-shaped interfaces from [tool design](../../infrastructure/tools/tool-definition.md#compare-interfaces-for-the-same-task) against the same isolated task snapshots. Hold model, runtime budgets, and task intent constant; changing both the model and the tool contract prevents attributing the effect to either. Repeat trials and record invalid calls instead of repairing them invisibly in the harness. [Anthropic's tool-writing article](https://www.anthropic.com/engineering/writing-tools-for-agents) describes task-based evaluation of interfaces.

The following is an **experiment plan, not a claim of measured improvement**:

| Case | Required outcome | Useful diagnostic |
| --- | --- | --- |
| One task, one eligible Mila | Exactly the intended assignment | Selection errors and unnecessary lookups |
| Two eligible people named Mila | Clarification; no write | Whether ambiguity survives the tool response |
| Mila cannot be assigned to this task | No assignment | Whether invalid candidates were exposed or accepted |
| Task revision changed after lookup | Conflict; no blind overwrite | Stale revision rejected; fresh state requested |
| Timeout after a committed assignment | One assignment, reconciled receipt | Repeated writes and truthful final status |
| Same task key in another workspace | No unauthorized read or write | Scope enforcement, including warmed caches |

For each variant, report completed tasks over all attempts, harmful effects, incorrect tool selections, argument-repair attempts, calls, returned bytes or tokens, elapsed time, and cost. A longer but correct clarification can be preferable to a fast incorrect mutation. Do not collapse these into a score that rewards fewer calls despite unsafe effects.

Capture a sanitized trace for each failure and classify its first cause: unclear user intent, ambiguous tool description, missing result information, wrong model selection, or executor defect. Change one interface property at a time, then rerun the existing regression cases. Keep fixture-based authorization testing even when live model runs never attempt a forbidden call; model restraint is not the security boundary.
