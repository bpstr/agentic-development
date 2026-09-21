# OpenAI

[Official model catalog](https://developers.openai.com/api/docs/models) · [Pricing](https://developers.openai.com/api/docs/pricing) · [Model selection](https://developers.openai.com/api/docs/guides/model-selection)

OpenAI develops general-purpose language models and specialized models for capabilities such as embeddings, images, realtime voice, transcription, and speech generation. As a model provider it supplies inference access, model identifiers, capability documentation, and usage-based pricing. These responsibilities are separate from its coding products and managed agent runtimes.

The general-purpose model profiles are deliberately separate:

- [GPT-6 Astra](openai-models/gpt-6-astra.md) covers demanding reasoning and complex work.
- [GPT-5.6 Sol](openai-models/gpt-5.6-sol.md) covers the flagship GPT-5.6 tier.
- [GPT-5.6 Terra](openai-models/gpt-5.6-terra.md) covers the balance between capability and cost.
- [GPT-5.6 Luna](openai-models/gpt-5.6-luna.md) covers cost-sensitive, high-volume workloads.

OpenAI's audio catalog includes dedicated Live/Realtime voice models, transcription models, and text-to-speech models. See [OpenAI GPT-Live and realtime voice](../voice/providers/openai-live.md) and the [voice model overview](../voice/voice-models.md).

For an integration, first identify the task and required input/output modalities, then choose the exact model and supported endpoint. Keep the selected model in application configuration so an evaluation can compare alternatives without altering business logic.

Model selection does not decide where custom tools execute, who owns conversation history, or how a background job resumes. Those are application and runtime decisions. Likewise, a text model calling an image-generation or speech tool is not the media model itself. Consult the specific model's capability table and bill all components of a request, including tools and generated media where applicable.
