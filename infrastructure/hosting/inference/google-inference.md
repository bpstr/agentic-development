# Google inference hosting

Official documentation: [Gemini API getting started](https://ai.google.dev/gemini-api/docs/get-started), [Google Gen AI SDK](https://googleapis.github.io/python-genai/), [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing).

Google exposes Gemini through developer-facing APIs and Google Cloud services. The relevant choice is the endpoint and its authentication, quota, regional, and data-handling contract. Google ADK and managed Agent Runtime add application orchestration and hosting capabilities above model inference.

For the Gemini Developer API, install `google-genai`, set `GEMINI_API_KEY`, and choose an available `MODEL_ID`:

```python
import os
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
response = client.models.generate_content(
    model=os.environ["MODEL_ID"],
    contents="Explain a queue worker in one sentence.",
)
print(response.text)
```

The same SDK family can target supported Google Cloud surfaces with different initialization and credentials. Do not reuse an API-key setup as if it were a complete cloud IAM or deployment configuration.

Validate the chosen model's tool calling, response schemas, streaming, and multimodal support. Grounding, caching, batch processing, and live interaction are separate request modes with their own constraints. Keep requested model IDs and actual endpoint configuration in traces.

A hosted Gemini call does not automatically deploy your tools or persist a business workflow. Run application-owned tools under the user's verified authorization, and store durable results independently of a transient SDK response. Evaluate full task latency under expected concurrency, including quota-induced queueing.
