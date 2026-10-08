# Agent-to-UI communication

Agent-to-UI communication turns backend execution into understandable, recoverable application state. It carries more than answer text: messages, tool requests, execution results, approvals, artifacts, and terminal outcomes may each need distinct representations.

For example, a document-generation run can produce these application events:

```json
[
  {"event": "run_started", "run_id": "run-42"},
  {"event": "tool_started", "call_id": "call-7", "name": "read_sources"},
  {"event": "tool_succeeded", "call_id": "call-7"},
  {"event": "artifact_ready", "document_id": "doc-19", "version": 1},
  {"event": "run_completed", "run_id": "run-42"}
]
```

This is an illustrative application contract, not an AG-UI schema. Stable identities let the frontend associate progress and results with one operation even after reconnection.

## Separate event meanings

A message delta appends text. A complete function-call payload means arguments are ready. An execution result means the handler finished. A committed document version means the artifact exists. Collapsing these into one “done” state can display success before anything is saved.

The frontend should not need to understand every provider's inference format. An adapter can translate provider and worker events into the product's domain while preserving traceable identities.

Streaming events alone are not durable storage. Define how a disconnected client obtains a snapshot, reconciles later events, and avoids displaying duplicate messages.

[AG-UI](https://docs.ag-ui.com/introduction) provides a shared vocabulary for this boundary. UI-description formats such as A2UI address what components should be rendered; an event protocol addresses how execution and state updates reach the interface.

## Agent Client Protocol for editor integrations

[Agent Client Protocol (ACP)](https://agentclientprotocol.com/get-started/introduction) standardizes the client-to-coding-agent boundary. The editor owns presentation and exposes negotiated resources; an external agent owns execution. This lets an editor replace the agent without implementing each agent's private interactive protocol.

The [v1 protocol overview](https://agentclientprotocol.com/protocol/v1/overview) defines a lifecycle beginning with `initialize`, then `session/new`, followed by `session/prompt`. Agents send `session/update` notifications and can ask for permission through `session/request_permission`; `session/cancel` signals cancellation. Filesystem and terminal access are negotiated client capabilities, not authority granted merely by connecting. A prompt response is not a substitute for inspecting tool results and the resulting diff.

[Zed's external-agent integration](https://zed.dev/docs/ai/external-agents) illustrates the split: native or adapted ACP agents retain their own authentication, model choices, and runtime behavior. Installing an adapter does not transfer an editor subscription to a provider account.

Keep similarly named boundaries distinct: ACP connects a client/editor and agent; [MCP](../mcp/mcp-definition.md) exposes tools and resources; [A2A](../agent-communication/a2a.md) exchanges work with agent services; AG-UI carries application-facing execution events. Model-provider SDK adapters instead translate inference requests. The [Agentic Commerce Protocol](../../commerce/protocols/agentic-commerce-protocol.md) also uses the acronym ACP but addresses commerce, not coding-editor integration.
