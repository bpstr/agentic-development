# State and recovery

[Handbook](../../../README.md) · [Chapter](../README.md)

A queue does not itself make an agent durable. Durable work needs persisted job state, checkpoints, outstanding calls, cancellation state, and results. Acknowledge work only after the next recoverable state is recorded.

Recovery must account for side effects. If a worker creates a task and crashes before recording the result, a retry can create a duplicate. Use stable operation keys, atomic application transactions where possible, downstream idempotency support, and reconciliation when a remote outcome is unknown.

Keep conversation history, execution checkpoints, and domain records distinct. A model summary can help the next inference call; it is not the authoritative record of an approval or payment.

[LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence) is one framework-specific implementation. [Temporal workflow execution](https://docs.temporal.io/workflow-execution) is a general durable-workflow example outside AI-specific orchestration.
