# Google Agent Platform RAG Engine

Official documentation: [RAG Engine overview](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/rag-overview), [RAG quickstart](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/rag-quickstart), [Agent Search backend](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-vertexai-search), and [Vector Search backend](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-vertexai-vector-search).

RAG Engine is Google Cloud's managed retrieval-augmented generation data framework in Gemini Enterprise Agent Platform. It handles the lifecycle around private knowledge: ingestion, transformation and chunking, embeddings, indexing into a corpus, retrieval, and supplying retrieved context to generation.

RAG Engine is not GraphRAG by itself. Its standard retrieval path is document/chunk retrieval. For relationship-aware retrieval, use a graph implementation such as [Spanner Graph](../../graphrag/platforms/google-spanner-graph.md) or another graph-aware system.

A RAG corpus can use different retrieval/storage backends. Google currently documents managed storage, Agent Search, and Vector Search options. The backend choice changes management, scale, search behavior, visibility, and security capabilities without changing the basic RAG concept.

Use RAG Engine when an application needs Google-managed ingestion and retrieval around enterprise documents and wants to call Gemini with corpus-backed context rather than implement every indexing stage itself.

Keep application authorization separate from corpus retrieval. The fact that a document exists in a corpus does not establish that every application user is allowed to see it; source ACLs and product-level access rules still need deliberate design.

The product naming and SDK surface have changed as Vertex AI evolved into Gemini Enterprise Agent Platform. Treat official Agent Platform documentation as the current source of truth and verify region, preview status, backend support, and SDK examples before deployment.
