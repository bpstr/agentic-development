# Streaming inference

Streaming delivers output incrementally while a request is still running. It improves responsiveness when an application can use early content, but does not inherently reduce total model computation or tool latency.

Model APIs often stream typed events through Server-Sent Events (SSE). This abbreviated example is an OpenAI Responses text delta, not a captured trace:

```text
event: response.output_text.delta
data: {"type":"response.output_text.delta","item_id":"msg_1","output_index":0,"content_index":0,"delta":"The report"}

```

The complete event schema includes additional fields. A transport parser handles SSE framing; an application adapter interprets semantic events. [OpenAI streaming guide](https://developers.openai.com/api/docs/guides/streaming-responses), [SSE processing rules](https://html.spec.whatwg.org/multipage/server-sent-events.html).

## Assemble by identity

Buffer text by message and content-part identity. Buffer function arguments by tool-call identity. Multiple messages or calls may appear in one stream, so appending every delta to one string loses structure.

Partial tool arguments may be invalid JSON. Wait for a complete call, then validate and authorize it before execution. Showing a tool's name in the interface does not mean the operation has started or succeeded.

Distinguish content completion, response completion, failure, and transport disconnection. A socket closing before the terminal event leaves an uncertain outcome that needs reconciliation.

For a long answer, measure time to first meaningful text and time to full answer. For an action, also measure time to its verified result. A progress event may arrive quickly while the useful work remains slow.

Reconnect and cancellation behavior belong to the specific backend contract. Some streams cannot replay missed events. Retain durable results where needed, and give “stop work” a defined effect beyond hiding the stream.
