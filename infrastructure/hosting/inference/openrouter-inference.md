# Accessing inference through OpenRouter

Official documentation: [Quickstart](https://openrouter.ai/docs/quickstart), [Model catalog](https://openrouter.ai/models), [Provider selection](https://openrouter.ai/docs/guides/routing/provider-selection), [Client tool calling](https://openrouter.ai/docs/guides/features/tool-calling).

OpenRouter provides model access through a common API and routes requests to inference providers. From an application's perspective it is an access surface; the serving provider still executes the selected model. Its routing policy is described separately in [OpenRouter gateway behavior](../gateways/openrouter-gateway.md).

## Minimal inference request

Create an OpenRouter API key, choose an eligible model from the current catalog, and configure the key in the process environment. OpenRouter credentials and billing are separate from a coding application's subscription. The base URL below targets OpenRouter even though the example uses the OpenAI client library.

Install `openai`, set `OPENROUTER_API_KEY`, and choose a supported OpenRouter model slug in `OPENROUTER_MODEL`:

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ["OPENROUTER_API_KEY"],
)
result = client.chat.completions.create(
    model=os.environ["OPENROUTER_MODEL"],
    messages=[{"role": "user", "content":
               "Explain a checkpoint in one sentence."}],
)
print(result.choices[0].message.content)
```

Use the model catalog or `GET /api/v1/models` to discover identifiers; do not assume a vendor's native model name is also its OpenRouter slug. Latest aliases deliberately move over time, while fixed identifiers make comparisons easier to reproduce.

The service also documents a Responses API. Select the endpoint and message schema expected by the particular client; changing the base URL alone does not adapt every SDK or coding harness.

## Use it inside a coding agent

Choose the client's OpenRouter provider option, supply the key, and select a supported model. If the client instead uses a generic compatible endpoint, verify the API dialect and required features in that client's documentation. Test a bounded repository-read task before relying on editing or automation.

For [client tool calls](https://openrouter.ai/docs/guides/features/tool-calling), the model requests an operation, the coding runtime validates and executes it, and the runtime returns the tool result for the next inference step. Merely receiving a tool call does not modify a file or run a test. The same boundary applies when the provider is selected through [OpenCode](../../../development/coding-agents/tools/opencode.md) or [Cline](../../../development/coding-agents/tools/cline.md).

Check required parameters and modalities against the chosen model/provider combination. Record the resolved provider and usage when available, particularly when fallback or automatic routing is enabled. Access through one credential does not make upstream retention, feature support, or regional availability uniform.

Keep API failures and unsupported-parameter errors visible, cap retries, and measure total request usage across the whole agent loop. A lower model price does not establish a lower cost per verified coding task.

OpenRouter also documents agent SDKs. Calling its completion endpoint alone does not establish that a remote service owns your application's full agent lifecycle.
