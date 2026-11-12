# Google Gemini

[Official Gemini model catalog](https://ai.google.dev/gemini-api/docs/models) · [Gemini deprecations](https://ai.google.dev/gemini-api/docs/deprecations) · [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) · [Gemini Enterprise Agent Platform](https://docs.cloud.google.com/gemini-enterprise-agent-platform/overview)

Google's Gemini family includes general-purpose multimodal models and specialized model surfaces. General inference, live audio, speech generation, image generation, embeddings, and video generation must be selected by capability rather than assuming one Gemini endpoint provides them all.

The most capable Google reasoning tier is now **Gemini 4 Carbon** (`gemini-4-carbon`), generally available November 10, 2026, for complex agentic coding, scientific work, and multimodal analysis. **Gemini 4 Argon** (`gemini-4-argon`, released October 13) remains the more efficient reasoning option for interactive work. Both use a unified 1,048,576-token input/thinking/output context and configurable `thinking_level`; Carbon typically spends more thinking tokens and has higher latency on comparable requests. Google lists introductory Carbon pricing through **November 30, 2026** ($2/M input and $10/M output, with $4/M and $20/M listed thereafter); verify live pricing. See [Carbon's migration and long-decode guide](https://aistudio.google.com/docs/whats-new-gemini-4-carbon) and the [Argon guide](https://aistudio.google.com/docs/whats-new-gemini-4-argon). Neither is interchangeable with the Live session API. Gemini 4 does not guarantee one uninterrupted million-token HTTP response: long output uses documented continuation and, on Carbon's Interactions API, background execution.

The current stable general-purpose Flash tier is **Gemini 3.8 Flash** (`gemini-3.8-flash`), released September 2, 2026. It accepts text, image, video, audio, and PDF input and produces text output, with supported capabilities including function calling, structured output, code execution, search grounding, and preview computer use. The catalog continues to list Gemini 3 family models for distinct speed, cost, preview, image, audio, and live workloads. Gemini 4 Argon is a reasoning flagship, not a replacement for the Flash and Live interfaces.

Stable and preview lifecycle status matters. For example, `gemini-3.1-pro-preview` remains a preview model, while Gemini 3.8 Live and the 3.8 TTS models have their own later September release dates. The [October 8, 2026 release notes](https://ai.google.dev/gemini-api/docs/changelog) deprecate `gemini-3.7-flash` (automatically routed to `gemini-3.8-flash`) and `gemini-3.5-flash` (routed to `gemini-3.6-flash`). Update pinned identifiers and re-run evaluations rather than depending on silently redirected aliases. The `deep-research-pro-preview-12-2025` Interactions agent shuts down **October 23, 2026**; see [the Gemini API migration note](../../inference/apis/gemini-api.md#deep-research-preview-retirement). For image generation, Nano Banana 2.1 (`gemini-nano-banana-2.1`) is GA, while `gemini-3.1-flash-image` is deprecated with no announced shutdown date. Use official deprecation/model pages for exact availability, quotas, and controls.

For long-video understanding, the [Gemini API video guide](https://ai.google.dev/gemini-api/docs/video-understanding) documents opt-in `processing: "agentic"` on video input for Gemini 4 Argon and supported Flash models; it is neither realtime camera conversation nor video generation. See [multimodal source understanding](../../knowledge/multimodal/multimodal-source-understanding.md#adaptive-agentic-video-analysis) for evidence-handling boundaries.

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

## Decision inference, media, and alias migrations

Google launched **Gemini Decision 1** (`gemini-decision-1`) and the separate **Decisions API** on **November 11, 2026**, for calibrated `noul` (binary), `choice`, and `score` questions over supported text, images, audio, video, and PDFs. It returns no generated text tokens. This is not the Interactions or Live API; use its [own request contract](../../inference/apis/gemini-api.md#gemini-decision-1-api), and keep tool execution and authorization in application code.

The [November 6 release notes](https://aistudio.google.com/docs/changelog) say `gemini-embedding-2-preview` is deprecated and automatically routes to `gemini-embedding-2` with the **same embedding space**—rename the model ID without rebuilding vectors solely for that alias. Gemini Omni 1.2 Flash (`gemini-omni-1.2-flash`, GA November 5) is a distinct **media-generation** interface with video extension and editing, not a replacement for live audiovisual analysis.

Review upcoming redirects and retirements in the [deprecation calendar](https://aistudio.google.com/docs/deprecations): `gemini-3.1-flash-tts-preview` reaches shutdown **November 17** (move to 3.8 Flash TTS or Flash-Lite TTS); `gemini-2.5-pro` automatically routes to `gemini-3.8-flash` on **December 1**; and `gemini-omni-1.1-flash` routes to 1.2 on **December 3** with the newer rate schedule. A successful redirected request may differ in behavior, output, or billing: pin replacements and re-evaluate before the deadline.
