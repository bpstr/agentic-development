# Agent state management

Agentic applications maintain several kinds of state with different purposes and lifetimes:

- **Conversation state:** messages, tool observations, and summaries used as model context.
- **Execution state:** current step, checkpoints, pending calls, budgets, leases, and cancellation.
- **Domain state:** authoritative tasks, documents, orders, and permissions.
- **Artifacts:** files or structured outputs that users need after execution ends.

A conversation summary helps the next inference call. It is not an authoritative record of an approval or completed payment. Store business outcomes in application records and associate them with tool receipts.

Use separate identifiers for the application conversation, provider session, run, tool call, and business operation. A provider session can expire without changing the identity of the user's document. Scope all retrieval by the authorized user or tenant; possession of a session ID is insufficient authorization.

Checkpoint at recoverable boundaries. Store pending external operations before execution and their outcomes afterward. If a worker dies between those writes, recovery must reconcile the operation rather than assume failure. Schema versions help long-lived runs resume after code changes.

[LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence) provides a useful example of thread checkpoints and stores. Its in-memory implementations serve local development; durable storage is a separate configuration decision.
