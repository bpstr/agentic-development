# Anthropic, Google, and xAI

[Handbook](../../README.md) · [Chapter](README.md)

**Sources reviewed:** 2026-09-19 · **Evidence:** provider documentation; no cross-provider benchmark runs.

These providers belong in the same model-selection discussion, but their APIs and surrounding products are not interchangeable. Compare a specific model through a specific service, with the features your application actually uses.

## Anthropic: Claude

Claude is a model family; Claude Code is a coding-agent product, and the Claude platform exposes APIs and agent infrastructure. The reviewed [model catalog](https://platform.claude.com/docs/en/models/overview) presents these roles:

| Family example | Documented role |
| --- | --- |
| Claude Fable 5.1 | Demanding reasoning and long-running agent work |
| Claude Opus 5 | Complex coding and professional workloads |
| Claude Sonnet 5 | Balance of speed and capability |
| Claude Haiku 4.5 | Lower-latency tier |

The catalog lists exact IDs, modalities, thinking support, and limits. The role descriptions are vendor positioning, not evidence that one family is best for your application. Access, identifiers, and feature availability can also differ between Anthropic's API and cloud partner platforms.

Start from the [model catalog](https://platform.claude.com/docs/en/models/overview) for API and model-selection links, [model cards](https://platform.claude.com/docs/en/resources/overview) for deeper evidence, and [pricing](https://platform.claude.com/docs/en/about-claude/pricing) for input, output, cache, and tool costs. Preserve structured tool-use and tool-result content rather than flattening every response into a single text string.

## Google: Gemini

Gemini's catalog distinguishes general reasoning models, Flash/Flash-Lite tiers, live audio models, and media generation. The reviewed catalog includes Gemini 3.8 Flash and Gemini 3.5 Flash-Lite, alongside other stable and preview versions. Stability labels matter: a tutorial using a preview endpoint does not establish a durable production dependency. See the [Gemini model catalog](https://ai.google.dev/gemini-api/docs/models).

Choose the specific modality and interaction first. Summarizing documents, generating an image, and maintaining a live voice conversation have different interfaces and cost structures. Google publishes these distinctions in its [pricing tables](https://ai.google.dev/gemini-api/docs/pricing), including feature and processing options.

Example evaluation: a support assistant can compare a Flash-Lite candidate on field extraction and a more capable candidate on unresolved investigations. Keep the task records, tool contracts, expected answers, and retry budgets constant. “Flash” is a product-family label; measure actual completed-turn latency in your deployment.

## xAI: Grok

The reviewed [Grok catalog](https://docs.x.ai/developers/models) presents Grok 4.6 for general and agentic tasks, plus separate voice and media offerings. Its documentation also distinguishes custom function calls from provider tools such as web search and X search. Those tools supply external information; the model's training knowledge alone is not a live search service.

**Grok Bot** is a different layer: a persistent agent product with a cloud computer, retained context, tools, and collaboration. It should be evaluated as a work environment, not listed as another language model. Its [official overview](https://docs.x.ai/grok-bot/overview) describes the shared computer and per-bot continuity model.

## What to compare when switching

| Concern | Check with a representative case |
| --- | --- |
| Output structure | Does the provider return text, tool calls, reasoning metadata, and references separately? |
| Tool behavior | Are argument schemas, parallel calls, and result correlation supported as needed? |
| State | Who stores history, and which items must be returned on continuation? |
| Cost | How are reasoning, caches, hosted tools, and retries counted? |
| Operations | What happens on rate limits, interrupted streams, and expired sessions? |

Use an adapter to normalize the parts your product needs while preserving provider-specific metadata. An endpoint accepting a familiar request format is not proof of equivalent behavior. Keep the acceptance criteria in [Selection and benchmarks](selection-and-benchmarks.md) unchanged while evaluating a provider migration.
