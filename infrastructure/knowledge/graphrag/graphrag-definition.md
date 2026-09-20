# Graph-based retrieval-augmented generation

Graph-based RAG uses relationships to find or organize evidence for a generated answer. It can combine a knowledge graph, passage search, graph traversal, and summaries. A graph alone is not a RAG system: the answer still needs relevant evidence and a generation step.

**GraphRAG** also names [Microsoft's implementation](https://microsoft.github.io/graphrag/), which builds extracted entities, relationships, and community reports. Use the product name precisely; not every graph-based retrieval pipeline implements Microsoft's indexing or search methods.

A release question can begin at `R7`, follow blocking tasks, identify affected services, and retrieve incident passages concerning those services. The graph supplies connections that ordinary passage similarity may miss. Each path should retain evidence for its edges.

Graph retrieval is useful for relationship questions and some broad questions about a collection. Its costs include entity resolution, extraction, graph maintenance, and additional generated artifacts. For a known task ID or an exact current-state query, a direct application read may be simpler and more reliable.

Evaluate graph retrieval against passage and structured-query baselines. Include false links, missing edges, conflicting sources, and permission boundaries. A longer path increases opportunities for unsupported inference; connected nodes do not automatically establish causation or a currently valid business relationship.
