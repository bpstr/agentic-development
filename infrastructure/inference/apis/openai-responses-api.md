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

Use [streaming](https://developers.openai.com/api/docs/guides/streaming-responses) for incremental visibility and [structured output](https://developers.openai.com/api/docs/guides/structured-outputs) for typed answers. Verify feature support for the configured model; endpoint compatibility alone does not establish tool or schema compatibility.
