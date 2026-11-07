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

## Choose the implementation boundary

A RAG system can place indexing and answering inside application code, behind a knowledge service, or inside a complete user-facing application. A visual workflow can coordinate any of those choices. Select the responsibility you need to implement before choosing a product; installing a separate product for every role creates more synchronization and failure boundaries.

| Responsibility | Implementations to examine | Decision to make |
| --- | --- | --- |
| Compose ingestion, retrieval, and generation components | [LlamaIndex](frameworks/llamaindex.md), [Haystack](frameworks/haystack.md) | How much application logic, storage wiring, and deployment will the team own? |
| Retrieve graph-derived or temporal evidence | [Cognee](../graphrag/frameworks/cognee.md), [LightRAG](../graphrag/frameworks/lightrag.md), [Microsoft GraphRAG](../graphrag/frameworks/microsoft-graphrag.md), [Graphiti](../memory/frameworks/graphiti.md) | Does the question require relationships, community summaries, or facts that change over time? These are different mechanisms. |
| Navigate document structure | [PageIndex](../retrieval/frameworks/pageindex.md) | Can section hierarchy and page locations guide retrieval, and what model work is required at indexing and query time? |
| Run an integrated knowledge service | [R2R](platforms/r2r.md), [RAGFlow](platforms/ragflow.md), [Onyx](../retrieval/platforms/onyx.md) | Which ingestion, document-management, connector, search, and serving responsibilities should the service own? |
| Provide a complete chat application | [Open WebUI](../../../interfaces/chat/applications/open-webui.md), [LibreChat](../../../interfaces/chat/applications/librechat.md), [AnythingLLM](../../../interfaces/chat/applications/anythingllm.md), [Verba](../../../interfaces/chat/applications/verba.md) | Does its built-in knowledge workflow meet the requirement, or should it call an external evidence service? Verba is archived. |
| Author and publish visual workflows | [Dify](../../orchestration/platforms/dify.md), [Flowise](../../orchestration/platforms/flowise.md) | How are workflow versions, credentials, runs, and external effects controlled? Flowise is archived. |

Products overlap these roles. The table describes useful evaluation boundaries, not a requirement to deploy every row. The implementation pages explain setup, ingestion/query lifecycles, edition differences, and maintenance status.

## A concrete composition decision

For a support assistant over internal runbooks, first define the contract: a query carries the caller's authorized scope; retrieval returns source passages with stable IDs, revisions, and locations; generation produces an answer using that evidence. A denied document must remain unavailable even if it was indexed successfully.

One implementation can use a pipeline library inside the existing backend and keep the existing chat interface. Another can use a knowledge service behind a ready-made chat application. Both need the same evidence and permission contract. Adding an extra memory engine is justified when selected knowledge must evolve across sessions; ordinary document Q&A does not require that extra service by itself.

Keep one owner for each derived representation. If both a chat application and a separate service ingest the same documents, decide which index is authoritative, how updates and deletion reach both, and whether queries intentionally consult both. Unplanned duplicate indexing spends compute and storage while making stale answers harder to diagnose.

## Evaluate the complete lifecycle

Use a small representative corpus and an explicit expected-evidence set before expanding deployment:

- Verify parsing and source locations before evaluating generated answers.
- Compare lexical, vector, graph, and structure-guided retrieval only where each addresses a real query need.
- Exercise initial ingestion, replacement, deletion, and permission revocation, including derived summaries and caches.
- Measure indexing work separately from query latency, model calls, memory use, and retained storage.
- Check unanswered and contradictory questions, not only questions with an obvious match.

The [retrieval evaluation guide](../../../operations/evaluation/retrieval-evaluation.md) separates evidence selection from answer quality. Haystack's [pipeline documentation](https://docs.haystack.deepset.ai/docs/pipelines) illustrates explicit component connections; a visual editor or API service still needs observable stage boundaries.

An MCP integration must identify whether the product consumes tools, exposes tools, or does both, and which transports and authentication paths are supported. A generic MCP label does not establish that a particular client/server pair can connect. Keep credentials and authorization in the application boundary rather than deriving them from retrieved text.

## Landscape reading

[Production RAG Frameworks Compared](https://karbouch.substack.com/p/production-rag-frameworks-compared) is a secondary discovery survey spanning these products. Use the linked implementation guides and their primary sources for current behavior, licensing, setup, and maintenance status.
