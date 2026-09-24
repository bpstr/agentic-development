# Google Gemini

[Official Gemini model catalog](https://ai.google.dev/gemini-api/docs/models) · [Gemini deprecations](https://ai.google.dev/gemini-api/docs/deprecations) · [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) · [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview)

Google's Gemini family includes general-purpose multimodal models and specialized model surfaces. General inference, live audio, speech generation, image generation, embeddings, and video generation must be selected by capability rather than assuming one Gemini endpoint provides them all.

The current stable general-purpose Flash tier is **Gemini 3.8 Flash** (`gemini-3.8-flash`), released September 2, 2026. It accepts text, image, video, audio, and PDF input and produces text output, with supported capabilities including function calling, structured output, code execution, search grounding, and preview computer use. The catalog continues to list other Gemini 3 family models for different speed, cost, preview, image, audio, and live workloads rather than one universal replacement chain.

Stable and preview lifecycle status matters. For example, `gemini-3.1-pro-preview` remains a preview model, while Gemini 3.8 Live and the 3.8 TTS models have their own later September release dates. Use the deprecations page and individual model page as the authority for exact shutdown dates, replacements, identifiers, supported modalities, and controls.

For realtime speech, see [Gemini Live API](../voice/providers/gemini-live.md) and the [voice model overview](../voice/voice-models.md). Speech-generation models are separate from the Live conversational models.

## Google-hosted agent and knowledge services

Gemini model inference is only one layer of Google's current agent platform. Keep these services distinct when evaluating an architecture:

- [Gemini API](../../inference/apis/gemini-api.md) provides model inference and supported built-in tools.
- [Google Agent Development Kit](../../orchestration/frameworks/google-adk.md) is an application framework, not a hosted model or runtime.
- [Agent Runtime](../../orchestration/managed-runtimes/vertex-ai-agent-engine.md), formerly associated with Vertex AI Agent Engine naming, hosts agent applications on Gemini Enterprise Agent Platform.
- [Managed Agents API](../../orchestration/managed-runtimes/google-managed-agents-api.md) is a separate preview service for autonomous agents running in managed sandboxes.
- [RAG Engine](../../knowledge/rag/platforms/google-rag-engine.md) manages ingestion and retrieval pipelines for private knowledge.
- [Agent Search](../../knowledge/retrieval/platforms/google-agent-search.md), formerly Vertex AI Search, provides managed enterprise search and grounding.
- [Agent Platform Memory Bank](../../knowledge/memory/platforms/google-memory-bank.md) provides managed long-term agent memory across sessions.
- [Spanner Graph](../../knowledge/graphrag/platforms/google-spanner-graph.md) is Google's hosted graph database surface for relationship-aware retrieval and GraphRAG.
- [Gemini Notebook Enterprise](../../knowledge/document-intelligence/platforms/gemini-notebook-enterprise.md), formerly NotebookLM Enterprise, provides grounded research notebooks and a preview management/source API.

Agent Studio is Google's low-code workspace for designing and testing prompts and agents. Vector Search provides managed vector retrieval and can back RAG Engine. Gemini in BigQuery adds AI-assisted analytics and conversational data workflows. These are adjacent hosted surfaces; add separate repository pages only when their agentic role needs more than the provider-level summary.

For example, an assistant that searches documents and reads screenshots needs language generation, image understanding, and reliable function calling. A separate requirement to create an illustration calls for an image model. A requirement to manage an enterprise corpus or persistent agent memory calls for a hosted knowledge service rather than a different Gemini model.

When comparing Gemini or Google-hosted services with another provider, preserve the task, source evidence, permissions, and success criteria. Prompt formats, tool contracts, storage boundaries, regional availability, and preview status need not map one-to-one.
