# Vector databases

A vector database stores numerical representations and retrieves nearby vectors efficiently. In a retrieval system, each vector usually points to source text and metadata. The database does not inherently understand whether that source is authoritative, current, or accessible to a user.

**Exact nearest-neighbor search** compares against the full eligible set. **Approximate nearest-neighbor search** uses an index to trade some recall for speed or memory efficiency. HNSW and IVF are common indexing families. The [pgvector documentation](https://github.com/pgvector/pgvector) describes exact search and approximate indexing within PostgreSQL.

Choose a store using the whole query shape: vector dimension, corpus size, update rate, metadata filters, concurrency, and operational requirements. A fast unfiltered benchmark may say little about a query restricted to one small project.

For example, retrieve the five nearest runbook chunks only within the authenticated workspace and permitted projects. Store stable chunk IDs so the application can fetch original text and resolve citations.

Keep embedding generations compatible. Changing the model may require new collections or indexes and a coordinated query migration. Equal dimensions do not make vectors interchangeable.

Consider backups, deletion, and restore behavior alongside search latency. A dedicated vector service adds another stateful dependency; an existing database with vector support may satisfy the workload. Conversely, specialized filtering, scaling, or hybrid retrieval requirements may justify a separate service.
