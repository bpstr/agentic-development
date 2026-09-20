# Durable execution

Durable execution preserves enough history and state to continue work after process failure, deployment, or a long wait. It includes recovery semantics, not merely storing the last chat message or placing a job in a queue.

A durable agent run needs a stable identity, persisted inputs, checkpoints, outstanding tool calls, recorded results, and terminal or suspended states. The worker should acknowledge a step only after its next recoverable state exists.

The difficult boundary is an external side effect. Suppose a worker creates an invoice and crashes before saving the response. Retrying the same tool without an operation key can create a second invoice. Use downstream idempotency support, transactional writes where available, and reconciliation for unknown outcomes. Durability does not automatically provide exactly-once business effects.

Replay-based engines also distinguish deterministic workflow decisions from activities that perform I/O. A model request is an activity whose returned result must be recorded; replay should not silently ask a nondeterministic model to decide again.

Use durable execution for background research, approval waits, scheduled jobs, and operations that must finish despite client disconnects. Define cancellation and retention alongside retries. [Temporal's execution model](https://docs.temporal.io/workflow-execution) and [LangGraph durable execution](https://docs.langchain.com/oss/python/langgraph/durable-execution) document different ways to supply these guarantees.
