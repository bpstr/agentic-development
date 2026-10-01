# OpenAI

[Official model catalog](https://developers.openai.com/api/docs/models) · [Pricing](https://developers.openai.com/api/docs/pricing) · [Model selection](https://developers.openai.com/api/docs/guides/model-selection)

OpenAI develops general-purpose language models and specialized models for capabilities such as embeddings, images, realtime voice, transcription, and speech generation. As a model provider it supplies inference access, model identifiers, capability documentation, and usage-based pricing. These responsibilities are separate from its coding products and managed agent runtimes.

The current GPT-6 general-purpose family is split by workload rather than one universal default:

- [GPT-6 Astra](openai-models/gpt-6-astra.md) is the highest-capability tier for demanding reasoning and complex work.
- [GPT-6.1 Sol](openai-models/gpt-6.1-sol.md) (`gpt-6.1-sol`) is the lower-cost complex-work tier. OpenAI released it on September 29, 2026 as an upgrade to GPT-6 Sol, with emphasis on coding, computer use, and professional work.
- [GPT-6 Luna](openai-models/gpt-6-luna.md) (`gpt-6-luna`) is the efficient tier for focused, high-volume tasks.

GPT-6 Sol and Luna first appeared on September 22, 2026; GPT-6.1 Sol superseded the original Sol model one week later. The retained [GPT-5.6 Terra](openai-models/gpt-5.6-terra.md) profile documents the preceding family and should not be used as a current catalog substitute. Verify exact identifiers, endpoints, reasoning controls, tool support, regions, rate limits, and pricing against the model catalog before deployment.

OpenAI's audio catalog includes dedicated Live/Realtime voice models, transcription models, and text-to-speech models. See [OpenAI GPT-Live and realtime voice](../voice/providers/openai-live.md) and the [voice model overview](../voice/voice-models.md).

For an integration, first identify the task and required input/output modalities, then choose the exact model and supported endpoint. Keep the selected model in application configuration so an evaluation can compare alternatives without altering business logic.

Model selection does not decide where custom tools execute, who owns conversation history, or how a background job resumes. Those are application and runtime decisions. Likewise, a text model calling an image-generation or speech tool is not the media model itself. Consult the specific model's capability table and bill all components of a request, including tools and generated media where applicable.
