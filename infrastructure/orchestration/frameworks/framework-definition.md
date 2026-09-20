# Agent frameworks

An agent framework provides reusable abstractions for model calls, tools, execution loops, state, and integrations. Frameworks differ in which responsibilities they own: some wrap a short loop, some describe explicit graphs, and some include deployment services.

Evaluate the abstraction against a concrete lifecycle: define one tool, run an agent, inspect the result, resume after interruption, cancel pending work, and record a failed side effect. A large integration catalog is useful only if the required integration preserves your application's semantics.

Keep four boundaries explicit:

- Model access can use a provider SDK or a framework adapter.
- Tool execution still needs argument validation and resource authorization.
- State persistence requires a configured durable store and recovery policy.
- Hosting determines where the framework process runs and who operates it.

A framework can supply hooks for all four without enforcing the product's policy automatically. Store business operations outside transient framework objects, and use adapters where replacement is a realistic requirement.

Prefer a direct SDK when the loop is simple and custom control matters. Prefer a framework when its state, composition, or integration model removes substantial code. The [LangChain overview](https://docs.langchain.com/oss/python/langchain/overview) and [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview) demonstrate two related packages serving different abstraction levels.
