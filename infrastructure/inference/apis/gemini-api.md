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

The [Gemini API release notes](https://ai.google.dev/gemini-api/docs/changelog) identify **`deep-research-pro-preview-12-2025` as shut down on October 23, 2026**. Interactions clients still selecting that agent should migrate immediately: set the **`agent`** parameter of `interactions.create` to `deep-research-preview-04-2026` (lower latency) or `deep-research-max-preview-04-2026` (more comprehensive). This is an **agent identifier**, not a `model` field or a Google Managed Agents API setting. Retest streaming, completion behavior, quotas, citations, cost, and interruption recovery when changing agents.

## Paid-project request storage defaults

On **October 26, 2026**, new paid Gemini API projects changed the `generateContent`, `streamGenerateContent`, and `batchGenerateContent` default to **`store=true`**. Older projects retain their prior Generate Content default, usually `store=false` unless logging was enabled. The Interactions API already defaults to `store=true`. [Logs and datasets](https://ai.google.dev/gemini-api/docs/logs-datasets) explains the per-project setting and override; these behaviors are **not** interchangeable with model context caching.

Set the request-level storage policy explicitly when prompts contain sensitive application data:

```python
# google-genai >= 2.33.0 is required for Generate Content's store option.
response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents="Summarize this non-sensitive example.",
    config={"store": False},
)
```

For JavaScript Generate Content, use `@google/genai>=2.31.0` for the same control. A request-level `store` value overrides the project default. Interactions `store=False` prevents server-side continuation via `previous_interaction_id` and background execution; do not promise those features if you disable interaction storage. Paid-tier log retention is configurable up to 55 days, and optional dataset saves have a different lifecycle. [Zero data retention requirements](https://ai.google.dev/gemini-api/docs/zdr) also cover abuse logs, grounding, file storage and Live session resumption: `store=False` alone does not guarantee zero retention.

## Stateless Gemini API shell client

The [Gemini API CLI](https://ai.google.dev/gemini-api/docs/cli), launched in beta on October 27, 2026, is a separate `gemini-api` executable built on the Interactions API, suitable for scripts or for *other* coding agents to call through a shell. It is not the interactive [Gemini CLI coding agent](../../../development/coding-agents/tools/gemini-cli.md#gemini-api-cli-is-not-gemini-cli). It can return media output as file paths, inspect local files, launch and poll managed agents, and emit machine-readable errors. Pin its release because the beta CLI may change between minor versions.

## Gemini Decision 1 API

On **November 11, 2026**, Google introduced a [separate Decisions API](https://aistudio.google.com/docs/decisions-api) and the `gemini-decision-1` model. Use it for a fixed question set that software can act upon, not for free-form generation. Its input can include supported text, images, audio, video and PDFs; output contains typed probabilities, with **zero generated output text tokens**. Each question is evaluated independently against shared input, so dependent judgments require separate calls.

A minimal **REST request body** for `POST https://generativelanguage.googleapis.com/v1beta/decisions` (authenticate server-side using `x-goog-api-key`) is:

```json
{
  "model": "gemini-decision-1",
  "input": "A customer says their account was charged twice.",
  "questions": {
    "billing_issue": {
      "type": "noul",
      "instructions": "Does the message report a billing problem?"
    },
    "route": {
      "type": "choice",
      "instructions": "Which team should review it?",
      "criteria": {
        "billing": "Invoices, payments or refunds.",
        "technical": "Technical product behavior.",
        "other": "None of these."
      }
    }
  }
}
```

For SDK calls, the official guide requires **`google-genai>=3.2`** or a compatible current `@google/genai` release and `v1beta`; the method is `client.decisions.create(model=..., input=..., questions=...)`. `noul` returns a probability in the 0.01–0.99 range; `choice` returns a chosen key, a distribution and confidence; `score` returns a probability-weighted rubric score. Choice keys are sorted alphabetically by the API before inference. Choose an explicit out-of-scope option and threshold uncertainty rather than assuming every input matches a category. This schema is **not** OpenAI Decisions (`questions` array, `predicate`), nor TypeSafe Jev even though the labels are similar. See [typed decision inference](../../models/model-capabilities.md#typed-decision-inference).

## Gemini 4 Carbon long decode

[Gemini 4 Carbon](https://aistudio.google.com/docs/whats-new-gemini-4-carbon) uses `gemini-4-carbon` and defaults to `thinking_level: medium`. Like Argon it has a unified 1M-token context rather than a separate unlimited output allowance. On the **Interactions API**, synchronous output stops at 65,536 tokens; for longer output, set `background=True` and a higher `max_output_tokens`, poll the interaction until terminal, and join text across the returned `model_output` steps. Carbon may consume more internal thinking tokens and take longer than Argon. Treat continuation, storage and retry costs separately and test both interruption and large-result assembly; do not apply Argon's Generate Content continuation procedure to Interactions without checking its contract.
