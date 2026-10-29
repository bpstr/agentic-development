# OpenAI

[Official model catalog](https://developers.openai.com/api/docs/models) · [Pricing](https://developers.openai.com/api/docs/pricing) · [Model selection](https://developers.openai.com/api/docs/guides/model-selection)

OpenAI develops general-purpose language models and specialized models for capabilities such as embeddings, images, realtime voice, transcription, and speech generation. As a model provider it supplies inference access, model identifiers, capability documentation, and usage-based pricing. These responsibilities are separate from its coding products and managed agent runtimes.

The current GPT-6 general-purpose family is split by workload rather than one universal default:

- [GPT-6 Astra](openai-models/gpt-6-astra.md) is the highest-capability tier for demanding reasoning and complex work.
- **GPT-6.1 Sol** (`gpt-6.1-sol`) is the current near-Astra balance of intelligence and cost for complex coding and agentic workflows; it succeeds `gpt-6-sol`.
- **GPT-6 Luna** (`gpt-6-luna`) is the efficient tier for focused, high-volume tasks.
- **GPT-6.1 Terra** (`gpt-6.1-terra`) is the fast tier for visual reasoning, precise computer use, and writing; released October 26, 2026. It accepts text and image input and generates text. Tool calling requires the Responses API.

OpenAI released GPT-6 Sol and Luna on September 22, 2026, GPT-6.1 Sol on September 29, and GPT-6.1 Terra on October 26. The retained [GPT-5.6 Sol](openai-models/gpt-5.6-sol.md), [GPT-5.6 Terra](openai-models/gpt-5.6-terra.md), and [GPT-5.6 Luna](openai-models/gpt-5.6-luna.md) profiles document the preceding family and should not be used as a current catalog substitute. Verify exact model identifiers, endpoints, tool support, rate limits, and pricing against the model catalog before deployment.

For Terra, the [GPT-6.1 Terra model contract](https://developers.openai.com/api/docs/models/gpt-6.1-terra) documents a 1,050,000-token context, 128,000 maximum output tokens, and `reasoning.effort` choices from `none` through `max`. Long-context pricing changes beyond 272K input tokens, so budget and evaluate realistic requests instead of extrapolating from the standard rate. It does not accept native audio or video input.

For Sol migration, [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol) supports `reasoning.effort` values `low`, `medium`, `high`, `xhigh`, and `max`; unlike GPT-6 Sol, `none` is not supported. Use the Responses API when function calling or hosted tools are required. The Chat Completions endpoint does not provide the same tool contract for this model. Treat a model-ID change as an API-compatibility and evaluation change, not just a quality upgrade.

OpenAI's audio catalog includes dedicated Live/Realtime voice models, transcription models, and text-to-speech models. See [OpenAI GPT-Live and realtime voice](../voice/providers/openai-live.md) and the [voice model overview](../voice/voice-models.md).

For an integration, first identify the task and required input/output modalities, then choose the exact model and supported endpoint. Keep the selected model in application configuration so an evaluation can compare alternatives without altering business logic.

Model selection does not decide where custom tools execute, who owns conversation history, or how a background job resumes. Those are application and runtime decisions. Likewise, a text model calling an image-generation or speech tool is not the media model itself. Consult the specific model's capability table and bill all components of a request, including tools and generated media where applicable.
