# Realtime agents

A realtime agent participates in an ongoing interaction while new input and execution events continue to arrive. A token-streaming answer alone is not enough: a realtime system must define how new information changes active work, how interruptions are handled, and when results should be presented.

Keep interaction and task lifecycles separate. A voice session may be listening while a search runs; a collaborative document may receive edits while an agent drafts a summary. New input can be commentary, a constraint update, a replacement request, or an explicit cancellation. Those meanings require application policy and context.

An illustrative event can correlate the two lifecycles:

```json
{
  "type": "work.completed",
  "sessionId": "session_3",
  "conversationId": "conv_12",
  "runId": "run_8",
  "messageId": "msg_43"
}
```

A completed run can persist a result even if the session has disconnected. On reconnect, load the saved result and active jobs before deciding whether to resume presentation or start new work.

Choose latency targets by interaction. A microphone indicator must respond quickly; a release analysis can take longer if progress is clear and conversation remains available. Measure acknowledgement, useful output, and task completion separately. Fast acknowledgements cannot compensate for incorrect or missing results.

Use bounded queues and explicit backpressure. Old partial input can become less useful than newer state, but completed action receipts must not be dropped as though they were disposable audio frames. Define which events can be coalesced, replayed, or superseded, and deduplicate events before applying them to application state.

A realtime transport supplies connectivity. Durability, authorization, and conflict handling remain application responsibilities.
