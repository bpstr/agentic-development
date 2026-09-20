# OpenAI Agents API

Official documentation: [Overview](https://developers.openai.com/api/docs/guides/agents-api/overview), [Architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture), [Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events).

The Agents API operates an OpenAI-managed Codex harness with sessions, orchestration, context handling, and recovery. It is a separate API from Responses inference and from the Agents SDK running in your application process.

A harness coordinates work; an environment supplies compute and files. The API supports no environment, an OpenAI-hosted sandbox, or a self-hosted environment connected through an executor. Hosting the environment yourself does not move the managed harness onto that machine.

With an API key in `OPENAI_API_KEY`, this documented beta endpoint starts a streamed session. Running it provisions provider work and may incur charges:

```bash
curl --no-buffer https://api.openai.com/v1/agents/sessions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Content-Type: application/json" \
  --data @- <<'JSON'
{
  "agent": {
    "model": "gpt-6-astra",
    "instructions": "Create the requested file and verify its contents."
  },
  "environment": { "type": "openai_hosted" },
  "input": "Create hello.txt containing Hello from this example.",
  "stream": true
}
JSON
```

Save the returned session identity with the application conversation. Use the [session operations](https://developers.openai.com/api/docs/guides/agents-api/sessions) to continue or control that session instead of creating unrelated work for every message.

Consume output as events. For example, an abbreviated text event can contain:

```json
{
  "type": "agent.session.turn.output_text.done",
  "item_id": "msg_example",
  "output_index": 0,
  "content_index": 0,
  "text": "Created hello.txt and checked its contents."
}
```

Text completion finishes a content part. Determine the outcome from turn completion, failure, or cancellation events. Correlate root and subagent work correctly, and use artifacts or execution receipts to substantiate file or mutation claims.

Remote MCP tools can be called by the harness; application function tools require your handler to receive calls, execute them, and return results. Keep application conversation, provider session, turn, item, and business-operation IDs distinct. Review current retention, residency, environment lifecycle, and event-delivery limits before deployment. Beta API behavior and available model/environment combinations require version-aware integration.
