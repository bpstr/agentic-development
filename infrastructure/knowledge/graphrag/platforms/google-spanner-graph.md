# Google Cloud Spanner Graph for GraphRAG

Official documentation: [Spanner Graph overview](https://docs.cloud.google.com/spanner/docs/graph/overview), [Spanner AI overview](https://docs.cloud.google.com/spanner/docs/spanner-ai-overview), [vector search with Spanner Graph](https://docs.cloud.google.com/spanner/docs/graph/perform-vector-similarity-search), [LangChain integration](https://docs.cloud.google.com/spanner/docs/langchain), and [LlamaIndex integration](https://docs.cloud.google.com/spanner/docs/llama-index).

Spanner Graph is Google Cloud's managed property-graph capability inside Spanner. It combines relational data, graph queries, search, and AI-oriented retrieval in the same database. For GraphRAG, the important capability is not a separate "GraphRAG service": Spanner Graph stores and queries the graph while an application or framework performs graph-aware retrieval and generation.

Spanner Graph uses an ISO GQL-based graph interface and can traverse relationships that ordinary vector similarity does not represent directly. Its vector-search support lets a GraphRAG pipeline combine semantic similarity with graph structure instead of maintaining an unrelated vector database.

Google documents GraphRAG integrations with both LangChain and LlamaIndex. These integrations can translate natural-language questions into graph retrieval operations and use the resulting evidence as context for a model. The framework remains responsible for the retrieval/generation workflow; Spanner Graph remains the hosted graph and search substrate.

A typical architecture is:

```text
source / operational data
        ↓
Spanner tables + property graph
        ↓
graph traversal + vector/search retrieval
        ↓
selected evidence and relationships
        ↓
Gemini or another generation model
```

Spanner Graph is useful when the relationships are themselves important evidence: entity resolution, dependency analysis, fraud networks, recommendations, supply chains, and connected enterprise knowledge. For simple document lookup, a managed RAG or search service can be substantially simpler.

Graph algorithms are an additional Spanner Graph capability and some algorithm surfaces are preview features. Edition requirements, preview status, regions, and framework APIs are time-sensitive and should be checked against the current Spanner documentation.

See [graph-based retrieval-augmented generation](../graphrag-definition.md) for the vendor-independent pattern.
