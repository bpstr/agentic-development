# Together AI

Official documentation: [Quickstart](https://docs.together.ai/docs/quickstart), [Documentation](https://docs.together.ai/). Source: [togethercomputer/together-python](https://github.com/togethercomputer/together-python).

Together AI provides hosted inference for supported models, with serverless access and dedicated deployment options. It is useful when an application wants model inference without operating the serving hardware itself. Fine-tuning and other platform features are separate capabilities from the request-serving role covered here.

Install `together`, set `TOGETHER_API_KEY`, and select a supported model identifier in `MODEL_ID`:

```python
import os
from together import Together

client = Together()
result = client.chat.completions.create(
    model=os.environ["MODEL_ID"],
    messages=[{"role": "user", "content":
               "Explain tokenization in one sentence."}],
)
print(result.choices[0].message.content)
```

Choose a serverless model from the provider's current catalog. A dedicated deployment requires a separate capacity and lifecycle decision; do not assume that every downloadable model is available as an on-demand endpoint.

Verify tool calling, structured output, context limits, and image support for the exact selected model. Pin a deliberate model version where available, and retain usage and request metadata for cost and failure analysis. Test latency at realistic concurrency rather than extrapolating from a single short prompt.

Application tools, authorization, and durable workflow state still run under the application's ownership unless a separate service explicitly supplies them. Scope credentials narrowly, bound retries, and account for both inference charges and any reserved or idle deployment capacity when comparing hosting options.
