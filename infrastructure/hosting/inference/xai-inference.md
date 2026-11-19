# xAI inference hosting

Official documentation: [Grok API quickstart](https://docs.x.ai/developers/quickstart), [API documentation](https://docs.x.ai/), [Models and pricing](https://docs.x.ai/developers/models).

The xAI API hosts Grok inference for application integrations. Its quickstart documents a Responses-style API, its own SDK, and compatible client options. Calling this endpoint is distinct from delegating a task to a persistent Grok Bot environment.

Install `openai` to use the documented compatibility interface. Set `XAI_API_KEY` and `MODEL_ID` to an available Grok model supported by the endpoint:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["XAI_API_KEY"],
    base_url="https://api.x.ai/v1",
)
response = client.responses.create(
    model=os.environ["MODEL_ID"],
    input="Explain retry backoff in one sentence.",
)
print(response.output_text)
```

Compatibility means a supported request and response surface, not identical behavior to another provider. Test the exact tools, structured output, reasoning settings, and streaming events that the application relies on. Server-side search and media features have separate model and endpoint requirements.

Keep API credentials on the server and record model, request ID, usage, and stop conditions. Configure retry and rate-limit handling independently from business-tool retries. Review current availability and pricing from the provider catalog rather than inferring them from model-family names.

For production, measure end-to-end tasks with realistic context and concurrent requests. The model API supplies inference; application identity, workflow durability, and side-effect authorization remain your service's responsibilities.

## Image-model alias migration

xAI's [November 2, 2026 migration notice](https://docs.x.ai/developers/migration/imagine-image-quality-nov-2) retires the `grok-imagine-image-quality` slug but keeps it resolving. Requests to that slug (and the older `grok-imagine-image-pro` alias) now execute as `grok-imagine-image-2.0` with `quality: "low"` for image generation and edits. Existing requests therefore do not necessarily error, but the **effective model, output quality and pricing change**. The older `grok-imagine-image` 1.0 slug is not affected.

Configure `model="grok-imagine-image-2.0"` explicitly and choose `quality` instead of relying on the redirect. The new model's `auto` quality mode can resolve differently for generation versus editing; record effective quality and check usage costs after migration. The xAI SDK's gRPC responses report an effective model such as `grok-imagine-image-2.0-low`. Treat aliases as mutable deployment pointers, not reproducible model versions.
