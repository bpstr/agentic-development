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

## Embeddings and reranking through OpenRouter

The [OpenRouter retrieval API](https://openrouter.ai/docs/guides/evaluate-and-optimize/rag) exposes **distinct endpoints** for embeddings (`POST /api/v1/embeddings`) and reranking (`POST /api/v1/rerank`). Do not send these models to the chat-completions endpoint used in the introductory example. Build an application-owned retrieval pipeline: index vectors, embed the query, retrieve permitted candidates, rerank if useful, then pass sourced evidence to a generation model.

As of [November 4, 2026](https://docs.cohere.com/v2/changelog), Cohere Embed 5 Pro/Fast (`cohere/embed-5-pro`, `cohere/embed-5-fast`) and Rerank 5 Pro/Fast (`cohere/rerank-5-pro`, `cohere/rerank-5-fast`) are available through OpenRouter. **These are OpenRouter model slugs, not Cohere-native IDs.** The Embed 5 variants share a vector space, supporting Pro-indexed documents and Fast-embedded queries with matching preprocessing, dimensions, and task configuration.

An API-compatible model name does not guarantee identical capabilities across hosts. In particular, [Cohere Context Focus](https://docs.cohere.com/docs/rerank) is documented on the direct Cohere API; do not assume OpenRouter's rerank route supports `relevant_spans` without checking and testing its own API contract. Preserve model, resolved provider, embedding version, original-document offsets, regional routing, and cost metadata for reproducibility.
