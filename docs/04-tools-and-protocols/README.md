# 04 · Tools, discovery, and interoperability

[Handbook](../../README.md) · [Chapter](README.md)

**Question:** How does an agent find capabilities, invoke them, and exchange work with other systems?

Start with a useful operation, such as `get_task`, and a clear result. Then choose the interface that makes the operation available to the intended callers. A protocol can standardize the connection while your application still defines the operation's meaning, permissions, and reliability.

## The important categories

| Category | Job | Example |
| --- | --- | --- |
| Function/tool contract | Name an operation and define its arguments/result | `get_task(key)` returns a task |
| Context resource | Identify content that can be read | A document URI or schema file |
| Prompt template | Supply a reusable interaction starting point | A code-review prompt with parameters |
| MCP | Connect a host application to tool/context servers | One task server used by several agent clients |
| Discovery service | Find server metadata or relevant tool definitions | Registry lookup or deferred tool search |
| Agent communication | Delegate work across independent agent services | Ask a research agent to produce an artifact |
| UI event protocol | Keep a user interface synchronized with agent work | Text deltas, tool progress, state changes |

MCP exposes [resources](https://modelcontextprotocol.io/specification/2026-07-28/server/resources), tools, and prompts through a [host/client/server architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture). It does not make each connected service an agent. A server that returns a database row can remain ordinary deterministic application code.

## Read this chapter

1. [MCP and a current wire exchange](mcp.md): current protocol version, transport, tool discovery, calls, and errors.
2. [Legacy MCP initialization](mcp-legacy.md): how older clients negotiate `initialize`, and why examples need a version label.
3. [Discovery and authentication](discovery-and-authentication.md): distinguish finding a server, finding a tool, and obtaining permission.
4. [Agent and UI communication](agent-communication.md): locate MCP, A2A, AG-UI, and provider APIs in one architecture.

For a provider's custom function format, start with [tool calling](../03-calling-models/tool-calling.md).

## Design a capability before publishing it

Here is a recommended review exercise for a task tool:

| Question | Useful answer |
| --- | --- |
| What does the operation do? | Read one task by exact key |
| What does it return? | Stable key, title, current status, version, source link |
| How is access checked? | Current principal and workspace are enforced server-side |
| What does a missing task mean? | A documented error with no invented replacement |
| How large can the result be? | Bounded fields; long content retrieved separately |
| How does a write recover? | Stored receipt keyed by an application operation ID |

This exercise prevents a generic `execute_anything` interface from becoming the only route into a product. It also gives evaluation fixtures a concrete target: the right tool, the right object, the right result, and a verifiable outcome.

Keep capability descriptions compact but precise. Explain whether a function reads or writes, how identifiers are supplied, and what uncertainty should cause it to stop. Use the same business service beneath REST, CLI, and MCP adapters where practical so authorization rules do not drift across surfaces.

**Review:** official sources checked **2026-09-19**. Protocol summaries are source-reviewed; interoperability with specific clients has not been executed. A listed standard or project is a reference implementation category, not a claim that every deployment is production-ready.
