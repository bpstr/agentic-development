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
