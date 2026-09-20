# Agent User Interaction Protocol

[Official AG-UI overview](https://docs.ag-ui.com/introduction) · [Event reference](https://docs.ag-ui.com/concepts/events) · [Canonical repository](https://github.com/ag-ui-protocol/ag-ui)

AG-UI provides an event vocabulary between agent backends and application frontends. It represents run lifecycle, text messages, tool calls, and state synchronization so an interface can integrate with different execution frameworks.

## A small event sequence

These synthetic events show one message in one run. The surrounding JSON array is a teaching format, not a required transport envelope:

```json
[
  {"type": "RUN_STARTED", "threadId": "thread-1", "runId": "run-1"},
  {"type": "TEXT_MESSAGE_START", "messageId": "message-1", "role": "assistant"},
  {"type": "TEXT_MESSAGE_CONTENT", "messageId": "message-1", "delta": "The report is ready."},
  {"type": "TEXT_MESSAGE_END", "messageId": "message-1"},
  {"type": "RUN_FINISHED", "threadId": "thread-1", "runId": "run-1"}
]
```

The frontend accumulates deltas under `messageId` and tracks the run under its own identity. Additional events carry tool activity and state changes.

## Adapt execution deliberately

A backend adapter maps its runtime's events to AG-UI. It should preserve boundaries between generated arguments, actual tool execution, and returned results. A completed tool-call argument stream is not proof that a business mutation committed.

Use snapshots and deltas according to the state contract. Define reconnection behavior in the application so a client can recover existing messages and reconcile new events.

AG-UI does not define the model's inference request, implement the agent loop, or provide a universal component renderer. It can carry information used by a generative UI system without specifying that system's component language.

Check compatibility for optional and evolving event families, including interruptions and subagent events. Do not assume every frontend adapter understands every event in the latest specification.
