# Calling a managed agent runtime

[Handbook](../../README.md) · [Chapter](README.md)

**A managed runtime call starts or continues work performed by an agent harness.** It operates above an individual inference request. OpenAI's Agents API manages orchestration, session state, context compaction, and recovery; the application configures tools and execution environments. [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview).

This page uses OpenAI to make the distinction concrete. The wire format is provider-specific, and the documented API uses a beta header. The example is **synthetic and unexecuted**, reviewed **2026-09-19**.

## Start a session

Send this body to `POST https://api.openai.com/v1/agents/sessions` with bearer authentication, `Content-Type: application/json`, and `OpenAI-Beta: agents=v1`:

```json
{
  "agent": {
    "model": "gpt-6-astra",
    "instructions": "Create the requested file, check its contents, and report the result."
  },
  "environment": { "type": "openai_hosted" },
  "input": "Create hello.txt containing Hello from the example.",
  "stream": true
}
```

The runtime can provision an environment and carry out multiple steps. Save the returned session identity with the application's conversation record. Subsequent input belongs to that session rather than to an unrelated fresh inference. The [session guide](https://developers.openai.com/api/docs/guides/agents-api/sessions) documents creation, continuation, steering, cancellation, and required actions.

## Read output as work events

An **abbreviated synthetic output event** might look like this:

```json
{
  "type": "agent.session.turn.output_text.done",
  "item_id": "msg_example_2",
  "output_index": 0,
  "content_index": 0,
  "text": "Created hello.txt and checked its contents."
}
```

A text event finishes a content part. It is not itself the session's complete outcome. The event reference distinguishes turn completion, failure, cancellation, and required action. It also distinguishes root-agent work from subagent events. [Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events).

When your product promises a file, treat the resulting artifact or verified execution result as evidence. The prose above is an example of what an agent might say, not evidence that this repository ran a hosted agent.

## Keep the boundaries explicit

| Identity | Meaning in the integration |
| --- | --- |
| Application conversation ID | The user's continuing discussion in your product |
| Provider session ID | The managed runtime instance used for that discussion |
| Turn ID | One period of agent work within a session |
| Item ID | A persisted message or tool-related item |
| Business operation key | Your deduplication/receipt identity for a product mutation |

Use an explicit mapping rather than making provider IDs the primary keys of product entities. This is a recommended application design: a provider session can expire or be replaced without changing the identity of a project or document.

Managed orchestration also does not imply that all tool code runs at the provider. A session can require your application to supply a function result. A self-hosted execution environment and a self-hosted orchestration service are different deployment choices. Consult the [runtime architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture) before deciding where code, credentials, and files live.

A practical adoption test is one full workflow: start work, receive a tool request if configured, finish, disconnect, recover the saved result, and continue the same session. Evaluate the whole workflow's latency and operational behavior. The number of application API calls alone cannot establish how much work happened behind them. Compare deployment responsibilities in [managed agent hosting](../08-hosting-and-delivery/managed-agents.md).
