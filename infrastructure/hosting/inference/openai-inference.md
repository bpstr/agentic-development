# OpenAI inference hosting

Official documentation: [API quickstart](https://developers.openai.com/api/docs/quickstart), [Model catalog](https://developers.openai.com/api/docs/models), [Pricing](https://developers.openai.com/api/docs/pricing).

OpenAI's direct model APIs host inference on provider infrastructure. The application selects a compatible model and endpoint, sends input, and receives output or streamed events. This hosting role is separate from the managed Agents API harness.

For a basic server-side call, install `openai`, set `OPENAI_API_KEY`, and set `MODEL_ID` to an available model supporting the Responses API:

```python
import os
from openai import OpenAI

client = OpenAI()
response = client.responses.create(
    model=os.environ["MODEL_ID"],
    input="Explain a database transaction in one sentence.",
)
print(response.output_text)
```

A tool-capable model can request application functions, while configured hosted tools execute according to their own API contract. Identify which side runs each tool before designing timeouts, credentials, and callbacks.

Use project-scoped credentials in server infrastructure, record request IDs and usage, and handle rate limits with bounded retries. Select an explicit model or deliberate alias policy so evaluation results remain interpretable after model updates.

Hosted inference avoids operating model hardware, but the application still owns its queue, domain authorization, and business state. Review endpoint-specific retention and storage controls, supported regions, and capacity requirements before deployment. A completion request's latency should be measured separately from queue time, tool execution, and user-interface delivery.
