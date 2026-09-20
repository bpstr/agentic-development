# Short-term memory

Short-term memory is the information an agent keeps for the current interaction or active task. It commonly includes recent messages, selected entity IDs, a compact task summary, pending tool calls, and explicit execution state.

Its useful lifetime is determined by the task, not merely by a fixed number of minutes. A background operation may resume tomorrow while still needing the same approval record and active object. Thread state should therefore be persistable even when model context is short.

```json
{
  "thread_id": "thread-93",
  "active_task_id": "APP-42",
  "goal": "Prepare the rollback procedure",
  "pending": ["Confirm the restoration test"],
  "summary_revision": 4
}
```

This illustrative application state resolves references; it does not establish the task's current status. Read live records before relying on mutable values.

Budget context deliberately: retain recent interaction, active constraints, unresolved questions, and action receipts. Summarize older discussion while retaining links to the original messages. Tool-call requests and results must remain properly correlated when trimming provider conversation formats.

[LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence) shows checkpoints as a mechanism for retaining execution state. A checkpoint enables resumption; it does not guarantee that replaying an external mutation is safe. Keep idempotency and current authorization checks in the execution layer.
