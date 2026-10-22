# Gemini API

[Official getting-started guide](https://ai.google.dev/gemini-api/docs/get-started) · [Google Gen AI Python SDK](https://github.com/googleapis/python-genai) · [Function calling](https://ai.google.dev/gemini-api/docs/function-calling)

The Gemini API provides model inference and supported tools through Google-managed endpoints. Its current getting-started guide uses the Interactions API, with typed steps and optional server-side continuation. Older `generateContent` examples use a different request and response contract.

## Minimal setup

Install `google-genai` in a Python environment. Configure `GEMINI_API_KEY` and set `GEMINI_MODEL` to a model supported by the Interactions endpoint:

```python
import os
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
interaction = client.interactions.create(
    model=os.environ["GEMINI_MODEL"],
    input="Explain idempotency in one sentence.",
)

print(interaction.id)
print(interaction.output_text)
```

This example performs a network request when run. The text helper is useful for presentation; inspect the interaction's typed steps for tools, media, and supporting annotations.

## Continue the interaction

The Interactions guide demonstrates `previous_interaction_id` for server-side conversation state and `store=False` with manually preserved history when the application owns continuation. Choose one coherent approach; keep the application conversation identity separate.

Gemini also distinguishes custom functions from built-in tools such as Google Search. A function declaration describes an operation for a dispatcher; declaring it does not grant access to the application's data. Return results using the correlation fields and input types of the API in use.

Google AI Studio/Gemini API credentials and Vertex AI deployment configuration are different integration choices. Check the selected endpoint's model availability, authentication, and supported features instead of assuming that an SDK method makes every backend interchangeable.

## Gemini 4 Argon and long decode

The [Gemini 4 Argon model contract](https://ai.google.dev/gemini-api/docs/models/gemini-4-argon) and [migration guide](https://ai.google.dev/gemini-api/docs/generate-content/latest-model) identify `gemini-4-argon` as a stable, multimodal-input, text-output reasoning model. This is **not** the Gemini Live session API. The 1,048,576-token context limit is shared among input, thinking, and output: it is not a promise of one uninterrupted 1M-token HTTP response.

For `client.models.generate_content` and `generate_content_stream`, Google's Python `google-genai>=2.30.1` and JavaScript `@google/genai>=2.29.1` can automatically continue long decodes. A single non-streaming request is limited to 32,768 generated tokens; a streaming request is limited to 65,536. For larger outputs, configure a higher `max_output_tokens`, allow continuation, and persist or verify the combined result. Raw REST integrations must explicitly handle continuation tokens, including responses dominated by thinking tokens. Never claim the Interactions API uses the same continuation contract without checking its own documentation.

Use `thinking_level` (`low`, `medium`, `high`) rather than `thinking_budget`. Remove explicit cached-content references—only implicit caching is supported—and remove unsupported sampling controls (`temperature`, `top_p`, `top_k`, `candidate_count`). Preserve thought signatures in multi-turn/tool histories; set appropriate long-call timeouts and evaluate the full cost of repeated continuations. These are endpoint- and model-specific migration steps, not universal Gemini defaults.

For longer recorded videos, [agentic video processing](../../knowledge/multimodal/multimodal-source-understanding.md#adaptive-agentic-video-analysis) is an opt-in `Interactions API` video-input mode distinct from both `generateContent` long decode and the realtime Live API.


## Deep Research preview retirement

The [October 8, 2026 Gemini API release notes](https://ai.google.dev/gemini-api/docs/changelog) schedule **`deep-research-pro-preview-12-2025` to shut down on October 23, 2026**. Interactions clients still selecting that agent should migrate immediately: set the **`agent`** parameter of `interactions.create` to `deep-research-preview-04-2026` (lower latency) or `deep-research-max-preview-04-2026` (more comprehensive). This is an **agent identifier**, not a `model` field or a Google Managed Agents API setting. Retest streaming, completion behavior, quotas, citations, cost, and interruption recovery when changing agents.
