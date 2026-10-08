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

## Decisions API for bounded judgments

The [Decisions guide](https://developers.openai.com/api/docs/guides/decisions) documents a separate `POST /v1/decisions` endpoint, not a Responses parameter or agent runtime. As of October 8, 2026 it is public beta and supports `gpt-6-luna`. Use it for classification, routing, or rubric evaluation; retain Responses for generated explanations, arbitrary structured extraction, and tool calls.

| Question type | Answer |
| --- | --- |
| `predicate` | `probability` that the condition is true. |
| `choice` | A supplied string/boolean value, its option distribution, and `confidence`. |
| `score` | The probability-weighted average of zero-based rubric-level indices, with the distribution and `confidence`; not necessarily an integer. |

This illustrative request body evaluates a fictional ticket. Send it as authenticated JSON to `/v1/decisions` from a trusted backend:

```json
{
  "model": "gpt-6-luna",
  "input": "The document export fails in Safari but succeeds in Chrome.",
  "questions": [
    {
      "type": "predicate",
      "name": "workaround_reported",
      "instructions": "Does the report explicitly describe a working alternative?"
    },
    {
      "type": "choice",
      "name": "triage_route",
      "instructions": "Choose a triage destination, not an authorization to modify anything.",
      "choices": [
        {"value": "technical", "description": "Broken product behavior."},
        {"value": "billing", "description": "Payment or subscription issues."},
        {"value": "review", "description": "Insufficient evidence or neither category."}
      ]
    }
  ]
}
```

The [API reference](https://developers.openai.com/api/reference/resources/decisions/methods/create) returns an `answers` array in question order, echoing question names. Check each answer's `type` before accessing its value: an individual question can return `refusal` while others succeed. A refusal, timeout, or malformed result is not a negative predicate or an approved default route.

Inputs are strings or user messages with `input_text` and inline `input_image` parts. Images must be data URLs, with at most 128 images per request; external image URLs, file IDs, audio, tools, and item references are unsupported. Batch independent questions over shared evidence; issue another request when a question depends on an earlier answer.

Do not reuse Jev's wire format: TypeSafe uses `state`, a question map, and `criteria`; OpenAI uses `input`, a question array, and `choices` or `levels`. Preserve both distributions and provider/model identity in any adapter. Validate thresholds on labeled data, and measure end-to-end latency rather than treating provider speed claims as an application guarantee. Client-delegated [voice workflows](../../models/voice/providers/openai-live.md#decision-backed-voice-control) can use this endpoint without making it a speech API.
