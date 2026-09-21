# Google Agent Search

Official documentation: [Agent Search overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/vertex-ai-search), [Agent Search product page](https://cloud.google.com/products/gemini-enterprise-agent-platform/agent-search), and [grounding with Agent Search](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/grounding/grounding-with-vertex-ai-search).

Agent Search is Google Cloud's managed search and retrieval service for websites, unstructured documents, structured data, and specialized search applications. It was previously named Vertex AI Search.

The service combines conventional information-retrieval features with semantic and generative capabilities, including natural-language understanding, ranking, conversational search, summarization, and grounding. It can be used directly as a search application or as the retrieval layer behind a RAG workflow.

Gemini Enterprise Agent Platform RAG Engine can use Agent Search as a retrieval backend. Gemini generation can also be grounded directly against configured Agent Search data sources. These are related integration paths, not different names for the same service.

Use Agent Search when managed ingestion, ranking, search quality, and ready-made enterprise search behavior are more important than controlling a custom vector index. Use a lower-level vector database or search engine when the application needs custom indexing/retrieval behavior that Agent Search does not expose.

Keep search access aligned with source permissions. Generative summaries should retain enough source identity for the application to explain where retrieved evidence came from.

The service name, supported data types, grounding-compatible models, and specialized product variants are time-sensitive; verify them against the current Agent Search documentation.
