# OpenAI Responses API

[Official Responses guide](https://developers.openai.com/api/docs/guides/migrate-to-responses) · [Python SDK](https://github.com/openai/openai-python) · [Function calling](https://developers.openai.com/api/docs/guides/function-calling)

The Responses API produces typed model output from text and supported multimodal input. It can expose custom function calls and run supported provider tools. This page concerns model requests; the separately configured Agents API provides a managed agent runtime.

## Minimal setup

Install `openai` in a Python environment. Set `OPENAI_API_KEY` on the backend and `OPENAI_MODEL` to a model that supports Responses. This example makes one network request when run:

```python
import os
from openai import OpenAI

client = OpenAI()
response = client.responses.create(
    model=os.environ["OPENAI_MODEL"],
    instructions="Explain technical terms in one sentence.",
    input="What is idempotency?",
)

print(response.status)
print(response.output_text)
```

`output_text` collects text for convenience. Inspect `response.output` for tool requests, annotations, and other typed items. Retain the response identity and terminal status if the application needs continuation or recovery.

## Returning tool results

A custom function call carries a name, JSON-encoded arguments, and a `call_id`. Application code validates, authorizes, and executes it, then supplies a `function_call_output` with the matching `call_id`. Use the documented history or response-chaining mechanism and preserve required intermediate items.

Enabling a provider-hosted tool has a different execution path: the provider may perform that operation during the request. Do not write a dispatcher that attempts to execute every output item locally.

## Responses Multi-agent beta

The [Responses Multi-agent guide](https://developers.openai.com/api/docs/guides/responses-multi-agent) describes request-scoped delegation for supported models, including GPT-6.1 Sol. With `multi_agent.enabled` and the `responses_multi_agent=v1` beta flag, the provider can spawn, message, wait for, and coordinate subagents in parallel. Root and subagents use the same request-level model and tool permissions; the `multi_agent_call` orchestration items are **hosted** and must not be executed by the client. By contrast, any agent can still issue an ordinary application `function_call` that your dispatcher must authorize and resolve by `call_id`. Bound concurrency and monitor aggregate tokens; independent concurrent work can reduce latency while shared mutations can conflict. Multi-agent currently does not support `/responses/compact`, `reasoning.summary`, or `max_tool_calls`. This beta request feature is distinct from a durable Agents API session.

The beta [Decisions API](https://developers.openai.com/api/docs/guides/decisions) is another distinct endpoint for predicate, choice, and rubric-score answers; it does not turn a Responses output schema into a probability estimate or execute a business action.

Use [streaming](https://developers.openai.com/api/docs/guides/streaming-responses) for incremental visibility and [structured output](https://developers.openai.com/api/docs/guides/structured-outputs) for typed answers. Verify feature support for the configured model; endpoint compatibility alone does not establish tool or schema compatibility.
