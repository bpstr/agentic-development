# Graphs, GraphRAG, and Cognee

A **graph** represents entities as nodes and relationships as edges. A **graph database** stores and queries that structure. **Graph-based RAG** uses relationships to select evidence for generation. Storing documents in a graph database does not by itself implement a RAG pipeline or make an answer reliable.

Distinguish explicit application relationships from model-extracted ones. A database foreign key can establish which project contains a task. A relationship extracted from a meeting note is a claim derived from that note and may be incomplete, outdated, or wrong. Preserve this distinction in your schema and answer wording.

## Microsoft's GraphRAG

The capitalized **GraphRAG** also names [Microsoft's project](https://microsoft.github.io/graphrag/). Its indexing process extracts entities and relationships from text, organizes the graph into communities, and creates summaries of those communities. These derived structures provide additional ways to assemble context.

| Retrieval approach | Evidence selected | Example question |
| --- | --- | --- |
| Ordinary passage retrieval | Text similar to the query | “What does the rollback guide say?” |
| GraphRAG local search | Relevant entities, connected relationships, and associated source text | “How is service Billing connected to incident INC-17?” |
| GraphRAG global search | Community reports spanning the collection | “What recurring operational problems appear across these incident reports?” |

Microsoft's [local search](https://microsoft.github.io/graphrag/query/local_search/) combines graph information with source text. Its [global search](https://microsoft.github.io/graphrag/query/global_search/) generates and combines responses from community reports. The latter is useful for broad corpus questions, but summaries and extra inference introduce cost and opportunities for information loss. Evaluate it on those questions rather than assuming every lookup improves.

For a release investigation, an explicit chain might be:

| Relationship | Evidence |
| --- | --- |
| Task APP-42 blocks release R7 | Current dependency record |
| Task APP-42 requires a billing migration | Approved task description, revision 12 |
| Incident INC-17 involved that migration | Incident report, revision 3 |

A graph can help find the incident from the release. It cannot establish that R7 remains blocked without checking the current dependency and task records. Ordinary SQL joins may already answer the relationship question; a generated knowledge graph is optional.

## Cognee's role

[Cognee](https://github.com/topoteretes/cognee) packages ingestion, knowledge extraction, storage, and retrieval for agent memory. Its [architecture](https://docs.cognee.ai/core-concepts/architecture) separates relational metadata and provenance, vector representations for similarity, and graph entities and relationships. This is a framework around several stores, rather than a replacement for the application's transactional database.

The current [Python quickstart](https://docs.cognee.ai/getting-started/quickstart) presents `remember` for ingestion and graph enrichment, and `recall` for retrieval. The following original example follows that documented API shape. Configure compatible model providers and an isolated demo environment using the quickstart first; this example was not executed. The Python workflow invokes configured model and embedding services and may incur provider charges:

```python
import asyncio
import cognee


async def main():
    await cognee.remember(
        "Release R7 is blocked by task APP-42. "
        "Task APP-42 requires a billing migration."
    )
    results = await cognee.recall(query_text="What blocks release R7?")
    for result in results:
        print(result.text)


asyncio.run(main())
```

Pin the package version and use matching documentation: older integrations may expose different operations. The snippet demonstrates the data flow; it does not configure a production tenant boundary.

Cognee organizes documents and processed graphs into **datasets**, with permissions at dataset scope in its [permissions system](https://docs.cognee.ai/core-concepts/multi-user-mode/permissions-system/overview). Choose dataset boundaries to match intended sharing. A workspace with private projects may need finer boundaries than one dataset for everything. Verify authenticated identities, selected backend handlers, and effective access control using the [permissions setup](https://docs.cognee.ai/setup-configuration/permissions) and [security documentation](https://docs.cognee.ai/setup-configuration/security); a dataset name alone is not proof of isolation.

Adopt a graph pipeline when relationship or collection-wide questions justify its ingestion, maintenance, and evaluation costs. Retain source passages and extraction versions so a generated connection can be inspected and corrected. For syntax-aware repository graphs, see [code intelligence](../10-development-workflows/code-intelligence.md).
