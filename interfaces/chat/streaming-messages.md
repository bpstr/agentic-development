# Streaming messages

Streaming messages progressively apply events to conversation state. Transport chunks are arbitrary byte fragments; they need not end at a JSON boundary, a Unicode character boundary, or the end of a model token. Decode and frame the stream before interpreting its events.

For a text part, an application might apply this illustrative sequence:

```json
[
  {"seq": 1, "type": "part.started", "partId": "text_1"},
  {"seq": 2, "type": "text.delta", "partId": "text_1", "delta": "Found "},
  {"seq": 3, "type": "text.delta", "partId": "text_1", "delta": "three issues."},
  {"seq": 4, "type": "part.completed", "partId": "text_1"}
]
```

The client updates the same part rather than appending a new message for every delta. A completed text part does not necessarily finish the run: tool calls or other output may follow. Require an explicit terminal run state.

[SSE](https://html.spec.whatwg.org/multipage/server-sent-events.html) provides event framing over HTTP. Its event IDs support reconnection, but the server must implement retention and replay for recovery to work. An interrupted stream alone does not prove that the underlying task failed. Reconcile against durable state before offering to retry an operation.

Render updates at a manageable cadence. Parse Markdown incrementally or stabilize incomplete constructs; avoid repeatedly rendering the entire history for each token. Preserve scroll position when the user reads earlier messages, and offer a clear jump to new output.

Treat streamed tool arguments and structured UI as incomplete until their required fields are available and validated. Buttons should become actionable only when the server has established a valid operation. Store the final message representation for reloads and exports; keep transient deltas only where replay or diagnostics justify them.
