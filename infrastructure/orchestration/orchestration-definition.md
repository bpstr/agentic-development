# Agent orchestration

Orchestration coordinates model calls, tool execution, state transitions, and delivery of results. A model proposes useful work; an orchestrator decides how that proposal becomes an authorized, observable operation.

Three independent questions describe an orchestration design:

- **Control flow:** who chooses the next step—application code, a model, or a combination?
- **Execution:** where do model requests, business functions, and generated code run?
- **Persistence:** which decisions, results, and pending operations survive interruption?

An agent loop answers a control-flow question. A background worker answers an execution question. A checkpoint answers a persistence question. A framework may supply all three, but installing the framework does not settle deployment or data ownership.

For example, a support application can classify a request deterministically, let an agent investigate with read tools, then require an application approval before issuing a refund. One workflow contains both fixed and model-directed steps. Its business database remains the authority for the refund.

Choose the smallest coordination mechanism that represents the real work. A direct loop is often sufficient for short tool-assisted requests. Explicit workflows help when ordering and branching are known. Durable execution becomes important when work spans process failures, human input, or long waits. The [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview) illustrates several of these responsibilities in one implementation.
