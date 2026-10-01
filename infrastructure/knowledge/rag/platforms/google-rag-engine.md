# Google Agent Platform RAG Engine

Official documentation: [RAG Engine overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/rag-overview), [RAG quickstart](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/rag-quickstart), [Serverless mode](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/serverless-mode), [Agent Search backend](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-vertexai-search), and [Vector Search 2.0 backend](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-rag-managed-vertex-ai-vector-search).

RAG Engine is Google Cloud's managed retrieval-augmented generation data framework in Gemini Enterprise Agent Platform. It handles the lifecycle around private knowledge: ingestion, transformation and chunking, embeddings, indexing into a corpus, retrieval, and supplying retrieved context to generation.

RAG Engine is not GraphRAG by itself. Its standard retrieval path is document/chunk retrieval. For relationship-aware retrieval, use a graph implementation such as [Spanner Graph](../../graphrag/platforms/google-spanner-graph.md) or another graph-aware system.

## Storage and deployment choices

A RAG corpus can use different retrieval/storage backends. The current documentation distinguishes:

- `RagManagedVertexVectorSearch`, backed by Vector Search 2.0 and managed by RAG Engine;
- `VertexVectorSearch`, the earlier user-managed Vector Search 1.0 integration;
- `RagManagedDb`, a Google-managed Spanner backend;
- Agent Search for managed enterprise search behavior.

These choices differ in management, project visibility, encryption support, region availability, and retrieval behavior. They are not interchangeable names for one database.

RAG Engine's **Serverless mode** is currently Preview and available only in `us-central1`. In that mode the default vector database is the managed Vector Search 2.0 backend; `RagManagedDb` is unavailable and CMEK is not supported. The Vector Search 2.0 RAG integration is also currently documented as Preview and `us-central1`-only. Check the backend table rather than assuming a platform-wide security feature applies to every storage choice.

Use RAG Engine when an application needs Google-managed ingestion and retrieval around enterprise documents and wants to call Gemini with corpus-backed context rather than implement every indexing stage itself.

Keep application authorization separate from corpus retrieval. The fact that a document exists in a corpus does not establish that every application user is allowed to see it; source ACLs and product-level access rules still need deliberate design.

The product naming and SDK surface have changed as Vertex AI evolved into Gemini Enterprise Agent Platform. Treat official Agent Platform documentation as the current source of truth and verify region, launch stage, backend support, security controls, quotas, and SDK examples before deployment.
