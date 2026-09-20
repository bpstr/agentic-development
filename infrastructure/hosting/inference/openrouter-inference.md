# Accessing inference through OpenRouter

Official documentation: [Quickstart](https://openrouter.ai/docs/quickstart), [Model catalog](https://openrouter.ai/models), [Provider selection](https://openrouter.ai/docs/guides/routing/provider-selection).

OpenRouter provides model access through a common API and routes requests to inference providers. From an application's perspective it is an access surface; the serving provider still executes the selected model. Its routing policy is described separately in [OpenRouter gateway behavior](../gateways/openrouter-gateway.md).

Install `openai`, set `OPENROUTER_API_KEY`, and choose a supported OpenRouter model slug in `MODEL_ID`:

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ["OPENROUTER_API_KEY"],
)
result = client.chat.completions.create(
    model=os.environ["MODEL_ID"],
    messages=[{"role": "user", "content":
               "Explain a checkpoint in one sentence."}],
)
print(result.choices[0].message.content)
```

Use the model catalog or `GET /api/v1/models` to discover identifiers; do not assume a vendor's native model name is also its OpenRouter slug. Latest aliases deliberately move over time, while fixed identifiers make comparisons easier to reproduce.

Check required parameters and modalities against the chosen model/provider combination. Record the resolved provider and usage when available, particularly when fallback or automatic routing is enabled. Access through one credential does not make upstream retention, feature support, or regional availability uniform.

OpenRouter also documents agent SDKs. Calling its completion endpoint alone does not establish that a remote service owns your application's full agent lifecycle.
