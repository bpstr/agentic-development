# Streaming and conversation state

[Handbook](../../README.md) · [Chapter](README.md)

**Streaming changes when you can observe output. State management determines what the next step remembers.** Treat them as separate design problems.

## Streaming is a sequence of typed events

In OpenAI Responses, setting `stream: true` exposes semantic events such as text deltas, tool-argument deltas, and response outcomes. A client should handle the event types it needs and preserve their identities. [Streaming Responses](https://developers.openai.com/api/docs/guides/streaming-responses).

An **illustrative, abbreviated SSE event**, not a captured API trace:

```text
event: response.output_text.delta
data: {"type":"response.output_text.delta","item_id":"msg_example_1","output_index":0,"content_index":0,"delta":"The task is in progress."}

```

Buffer deltas by their message/content identity. A partial tool argument string may not yet be valid JSON; execute only when the provider has supplied the complete call and your validation passes. Keep progress, tool requests, and user-visible prose as distinct event types in your adapter.

Streaming can reduce the wait before the user sees useful content. It does not prove that the complete task finishes sooner. A report may still require several dependent searches, tool calls, and model steps. Measure time to first useful event, time to first answer text, and time to verified completion separately. The [latency guide](https://developers.openai.com/api/docs/guides/latency-optimization) discusses streaming alongside other performance techniques.

## Three kinds of state

| State | Example | Recommended owner |
| --- | --- | --- |
| Product state | Task status, permissions, document version | Application database |
| Conversation history | Messages, tool receipts, references, user corrections | Durable conversation storage |
| Model context | Instructions and selected items included in this inference | Context builder or managed runtime |

This separation is an application design recommendation. It lets a task survive a provider migration and lets the next inference receive a bounded context without deleting the full conversation.

OpenAI offers response chaining with `previous_response_id`, conversation objects, and manually supplied context. A response ID saves transmission work; it does not make the preceding context disappear from input-token accounting. [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state).

Synthetic continuation body:

```json
{
  "model": "gpt-6-astra",
  "previous_response_id": "resp_example_1",
  "input": "Which task were we discussing?"
}
```

When maintaining history yourself, preserve required tool relationships and provider-specific continuation material. Anthropic's [Messages reference](https://platform.claude.com/docs/en/api/messages/create) requires returned thinking blocks and signatures to be carried back unmodified where that API contract applies. A transcript reduced to visible prose can lose information needed by the next call.

## Recover a view without inventing success

After a disconnect, restore durable items, reconcile subsequent events, and inspect the terminal run outcome. A closed socket alone is not completion. Managed runtimes differ in replay behavior: OpenAI's Agents API documents retrieving saved session items because its stream does not replay missed events. [Session event recovery](https://developers.openai.com/api/docs/guides/agents-api/sessions/events).

For application-owned state, test one reconnect halfway through an operation and one after the operation commits. The user should see one action with the correct outcome in both cases.

Finally, distinguish cancellation of presentation from cancellation of work. Closing a browser tab might stop rendering while a durable worker continues. Give the product an explicit “stop work” action with an observable outcome. An already committed change needs a separate undo operation if the product supports one.

Continue with [cost and latency](../09-evaluation-and-operations/cost-and-latency.md) to measure the complete path and [tracing](../09-evaluation-and-operations/tracing.md) to correlate its stages.

**Review:** official sources checked **2026-09-19**; examples are illustrative and were not executed.
