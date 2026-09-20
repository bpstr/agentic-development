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
