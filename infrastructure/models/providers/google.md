# Google Gemini

[Official Gemini model catalog](https://ai.google.dev/gemini-api/docs/models) · [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) · [Gemini documentation](https://ai.google.dev/gemini-api/docs)

Google's Gemini family includes general-purpose multimodal models and specialized model surfaces. General inference, live audio, image generation, embeddings, and video generation must be selected by capability, rather than assuming that one Gemini endpoint provides them all.

The catalog identifies stable and preview versions separately. Its general-purpose candidates include Gemini 3.8 Flash, Flash-Lite tiers, and a Pro tier; individual pages determine the exact model ID, lifecycle status, supported modalities, and controls. Use those identifiers in configuration instead of copying a model name from an unrelated tutorial.

For example, an assistant that searches documents and reads screenshots needs language generation, image understanding, and reliable function calling. A separate requirement to create an illustration calls for an image model. Generating an embedding for retrieval is another operation again, even if all three are offered by the same provider.

Google ADK is an orchestration framework; Vertex AI Agent Engine is a managed execution service. Neither name describes a general-purpose inference model. Keep their evaluation and deployment decisions separate from selecting a Gemini model.

When comparing Gemini with another provider, preserve the task, source evidence, permissions, and success criteria. Prompt formats and reasoning controls need not map one-to-one. Preview availability, account access, and a successful sample request also do not establish long-term production availability.
