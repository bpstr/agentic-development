# Fireworks AI

Official documentation: [Serverless quickstart](https://docs.fireworks.ai/getting-started/quickstart), [Documentation](https://docs.fireworks.ai/).

Fireworks AI provides managed model inference through serverless and dedicated deployment surfaces. Its compatible APIs help applications integrate supported models while the provider operates inference infrastructure. Compatibility must be checked for the model and features used by the application.

Install `openai`, set `FIREWORKS_API_KEY`, and set `MODEL_ID` to a model identifier from Fireworks' catalog:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["FIREWORKS_API_KEY"],
    base_url="https://api.fireworks.ai/inference/v1",
)
result = client.chat.completions.create(
    model=os.environ["MODEL_ID"],
    messages=[{"role": "user", "content":
               "Explain a vector index in one sentence."}],
)
print(result.choices[0].message.content)
```

The quickstart documents chat, tool-calling, structured-output, and compatible client examples. Their availability depends on the chosen model and API surface; an OpenAI client library does not turn the target into an OpenAI-hosted model.

Use provider model identifiers exactly, and distinguish a shared catalog model from a dedicated deployment reference. Record latency, token usage, stop reasons, and deployment identity in the application's tracing system. Test streaming and schema constraints with representative prompts before enabling a fallback route.

A dedicated endpoint changes capacity ownership and economics. Include deployment startup, scale behavior, and idle cost in the decision. Business authorization, tool receipts, cancellation policy, and persistence remain application concerns outside inference serving.
