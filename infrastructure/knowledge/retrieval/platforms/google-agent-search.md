# Google Agent Search

Official documentation: [Agent Search overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/vertex-ai-search), [Agent Search product page](https://cloud.google.com/products/gemini-enterprise-agent-platform/agent-search), [release notes](https://docs.cloud.google.com/generative-ai-app-builder/docs/release-notes), [ranking API](https://docs.cloud.google.com/generative-ai-app-builder/docs/ranking), and [grounding with Agent Search](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/grounding/grounding-with-vertex-ai-search).

Agent Search is Google Cloud's managed search and retrieval service for websites, unstructured documents, structured data, and specialized search applications. It was previously named Vertex AI Search. Legacy Discovery Engine API names and some older resource terminology can remain in client libraries and request paths even when current product documentation says Agent Search; product rename does not imply that those API resource names changed at the same time.

The service combines conventional information-retrieval features with semantic and generative capabilities, including natural-language understanding, ranking, conversational search, summarization, and grounding. It can be used directly as a search application or as the retrieval layer behind a RAG workflow.

Gemini Enterprise Agent Platform RAG Engine can use Agent Search as a retrieval backend. Gemini generation can also be grounded directly against configured Agent Search data sources. These are related integration paths, not different names for the same service.

Use Agent Search when managed ingestion, ranking, search quality, and ready-made enterprise search behavior are more important than controlling a custom vector index. Use a lower-level vector database or search engine when the application needs custom indexing/retrieval behavior that Agent Search does not expose.

## Operational versioning

Search query add-on specifications (`searchAddonSpec`) became generally available in the v1 API on September 14, 2026. They let programmatic requests turn eligible search add-ons on or off individually, so cost behavior can depend on the request rather than only the data store configuration.

The separate ranking API has moving aliases. Google states that on or before October 1, 2026, `semantic-ranker-default@latest` and `semantic-ranker-fast@latest` will begin pointing to the preview 005 rankers. Pin an explicit ranker version when a retrieval evaluation, truncation limit, language behavior, or production rollout must remain reproducible, and evaluate 005 before allowing an alias migration to change ranking behavior automatically.

Keep search access aligned with source permissions. Generative summaries should retain enough source identity for the application to explain where retrieved evidence came from. A relevance score is not a probability that the source is true, and changing a ranker version should trigger retrieval evaluation against the same labeled questions.

The service name, supported data types, grounding-compatible models, ranker aliases, and specialized product variants are time-sensitive; verify them against current Agent Search documentation and release notes.
