# Vercel AI Gateway

Official documentation: [AI Gateway](https://vercel.com/docs/ai-gateway), [SDKs and APIs](https://vercel.com/docs/ai-gateway/sdks-and-apis).

Vercel AI Gateway is a managed access and routing service for models from multiple providers. It supplies shared credentials, provider routing, request visibility, and usage controls. It can be called from applications hosted outside Vercel.

Create a gateway key and choose a supported `provider/model` identifier. With `AI_GATEWAY_API_KEY` and `MODEL_ID` set, install `openai` and run:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["AI_GATEWAY_API_KEY"],
    base_url="https://ai-gateway.vercel.sh/v1",
)
result = client.chat.completions.create(
    model=os.environ["MODEL_ID"],
    messages=[{"role": "user", "content": "Explain a gateway in one sentence."}],
)
print(result.choices[0].message.content)
```

AI SDK can also use the gateway as its model-access layer. The gateway and SDK remain separate choices: one routes requests, while the other supplies application-level model and agent primitives.

Configure provider order, fallback policy, budgets, and data handling according to the workload. Inspect request logs and response metadata to identify the provider and attempts actually used. A fast final route does not erase a slow failed attempt.

Test required tool, schema, streaming, and modality behavior for each eligible route. Keep business authorization and operation receipts in application services. Review current pricing and billing rules directly, including any non-token charges, instead of assuming a shared gateway makes all providers equivalent.
