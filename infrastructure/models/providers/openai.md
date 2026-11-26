# OpenAI

[Official model catalog](https://developers.openai.com/api/docs/models) · [Pricing](https://developers.openai.com/api/docs/pricing) · [Model selection](https://developers.openai.com/api/docs/guides/model-selection)

OpenAI develops general-purpose language models and specialized models for capabilities such as embeddings, images, realtime voice, transcription, and speech generation. As a model provider it supplies inference access, model identifiers, capability documentation, and usage-based pricing. These responsibilities are separate from its coding products and managed agent runtimes.

As of November 17, 2026, the GPT-6.2 family supersedes the earlier general-purpose recommendation, but model tier and API feature support remain workload-specific:

- **GPT-6.2 Astra** (`gpt-6.2-astra`) is the current high-capability choice for demanding reasoning, coding, scientific work, and professional artifacts.
- **GPT-6.2 Sol** (`gpt-6.2-sol`) targets efficient everyday coding and multistep agent workflows.
- **GPT-6 Luna** (`gpt-6-luna`) remains a focused high-volume option.
- **GPT-6.1 Terra** (`gpt-6.1-terra`) remains a fast visual-reasoning and computer-use option. Its [model contract](https://developers.openai.com/api/docs/models/gpt-6.1-terra) lists 1,050,000 context tokens and 128,000 output tokens; it does not accept native audio/video.

Both GPT-6.2 models support the Responses API and Chat Completions, but **tool calling requires Responses**. They do not support Flex processing; consult [the GPT-6.2 migration guide](https://developers.openai.com/api/docs/guides/latest-model) for incompatible sampling/logprob settings, reasoning effort, stable-prefix handling, caching, Zero Data Retention eligibility, and regional service tiers. Starting with GPT-6.2, the Responses API appends top-level `instructions` after `input` for turn-scoped guidance. Put reusable instructions in an initial `developer` input item instead, preserve the prior input/reasoning prefix, and use documented appended configuration updates when changing settings.

The [GPT-6 Astra](openai-models/gpt-6-astra.md), [GPT-5.6 Sol](openai-models/gpt-5.6-sol.md), [GPT-5.6 Terra](openai-models/gpt-5.6-terra.md), and [GPT-5.6 Luna](openai-models/gpt-5.6-luna.md) pages retain earlier family behavior for migration/reference rather than representing the latest catalog. GPT-6 Sol and Luna were released September 22, 2026; GPT-6.1 Sol on September 29; GPT-6.1 Terra on October 26; GPT-6.2 Astra and Sol on November 17. Treat a model-ID change as a compatibility, cost, and evaluation change, not merely a quality upgrade.

OpenAI's audio catalog includes dedicated Live/Realtime voice models (including GPT-Live 1.1, released November 19), transcription models, and text-to-speech models. See [OpenAI GPT-Live and realtime voice](../voice/providers/openai-live.md) and the [voice model overview](../voice/voice-models.md).

The [November 24, 2026 API changelog](https://developers.openai.com/api/docs/changelog) introduces healthcare configurations of GPT-6.2 Astra and Sol (`gpt-6.2-astra-healthcare`, `gpt-6.2-sol-healthcare`) and earlier GPT-6 variants through Responses. They pair a model with a clinical-question harness and use a dedicated medical-source index when web search runs. Clinical validation and deployment-specific compliance remain separate responsibilities. The mutable `chat-latest` alias was also refreshed; do not treat a changing chat snapshot as a reproducible production deployment.

For an integration, first identify the task and required input/output modalities, then choose the exact model and supported endpoint. Keep the selected model in application configuration so an evaluation can compare alternatives without altering business logic.

Model selection does not decide where custom tools execute, who owns conversation history, or how a background job resumes. Those are application and runtime decisions. Likewise, a text model calling an image-generation or speech tool is not the media model itself. Consult the specific model's capability table and bill all components of a request, including tools and generated media where applicable.
