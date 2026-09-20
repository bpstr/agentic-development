# The RAG pipeline

A RAG pipeline has an indexing path and a query path. Indexing prepares sources for repeated retrieval; the query path selects evidence and generates an answer. Keeping them separate avoids rebuilding knowledge during every user request.

A typical indexing path performs these steps:

1. Read source content and access metadata.
2. Parse its text and structure.
3. Split it into useful retrieval units.
4. Attach source IDs, revisions, and locations.
5. Build lexical, vector, or graph representations.
6. Publish the completed revision for queries.

The query path authenticates the caller, chooses the searchable scope, retrieves candidates, optionally reranks them, assembles bounded evidence, and generates the response. Citations should resolve through application-owned source metadata.

For a runbook, preserve heading hierarchy and ordered steps during parsing. If “pause workers” becomes disconnected from “restore snapshot,” retrieval can return a dangerously incomplete procedure even when each fragment is relevant.

LlamaIndex's [ingestion pipeline](https://developers.llamaindex.ai/python/framework/module_guides/loading/ingestion_pipeline/) illustrates transformation stages and caching. A transformation cache saves repeated computation; it does not replace revision tracking or authorization.

Instrument stage boundaries. Empty answers can originate in failed parsing, missing embeddings, permission filters, poor retrieval, context truncation, or generation. A single overall success flag hides those differences and makes tuning expensive.
