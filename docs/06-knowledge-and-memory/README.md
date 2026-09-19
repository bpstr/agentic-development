# Knowledge, retrieval, and memory

[Handbook](../../README.md) · [Chapter](README.md)

An agent needs different kinds of context for different questions. A product manual can explain an installation; a conversation can preserve a decision; a live API can report whether a deployment finished. Combining these sources starts with knowing what each one can establish.

Retrieval means obtaining information at request time. **Retrieval-augmented generation (RAG)** uses that information to help generate an answer. It can use a search index, files, or an existing application API; a vector database is one implementation choice. The [LangChain retrieval guide](https://docs.langchain.com/oss/python/deepagents/retrieval) explains both fixed retrieve-then-answer pipelines and agents that choose retrieval tools during a run.

## Choose the information path

These are engineering starting points, to validate against your own questions and data:

| Question | Start with | Why |
| --- | --- | --- |
| “Rewrite the paragraph I pasted.” | Supplied context | All required material is already present. |
| “What does our deployment guide recommend?” | Document search and cited passages | The answer is documented prose. |
| “Which incidents mention similar migration failures?” | Keyword or hybrid retrieval | Wording varies, while error identifiers remain useful. |
| “Which services connect these incidents to this release?” | Explicit relationships, then graph-assisted retrieval if needed | The question spans entities and their connections. |
| “What themes recur across all support reports?” | Corpus aggregation or graph community summaries | A few nearest passages may not represent the whole collection. |
| “Who owns task APP-42 now?” | Authorized application API or database query | Current structured state should come from its system of record. |
| “What did we agree last week?” | Conversation recall with message references | This is historical conversational evidence. |

## Read this chapter

1. [RAG: from documents to grounded answers](rag.md) introduces parsing, chunks, embeddings, hybrid retrieval, reranking, and citations.
2. [Graphs, GraphRAG, and Cognee](graphs-and-cognee.md) separates graph storage, graph-based retrieval, and a packaged memory pipeline.
3. [Memory, freshness, and incremental indexing](memory-and-indexing.md) covers conversation state, durable memory, source updates, permissions, and deletion.

For repository symbols, call relationships, and semantic code search, continue to [code intelligence](../10-development-workflows/code-intelligence.md). Code has syntax and execution structure that a general document pipeline can lose.

The recurring design rule is to preserve the source of every useful fact. Store stable identifiers and revisions, retain evidence behind derived summaries, and check present permissions when information is used. A search result is evidence to assess; retrieval alone does not establish correctness.

*Sources reviewed: 2026-09-19. External integrations in this chapter were not runtime-tested.*
