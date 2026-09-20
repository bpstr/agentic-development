# Cognee

Official documentation: https://docs.cognee.ai/
API reference: https://docs.cognee.ai/api-reference/introduction
Canonical repository: https://github.com/topoteretes/cognee

Cognee is a knowledge and memory framework that ingests data, builds graph- and vector-backed representations, and retrieves context for AI applications. Its core workflow is intentionally small: **add data → cognify → search**.

## Quick start

Install Cognee using the installation method documented for the current release, configure the required model/embedding credentials, then run the three-stage pipeline:

```python
import asyncio
import cognee

async def main():
    await cognee.add("Alice works on the payments service. The service depends on PostgreSQL.")
    await cognee.cognify()

    results = await cognee.search(
        query_text="What does the payments service depend on?",
    )

    print(results)

asyncio.run(main())
```

The exact available search modes and configuration options are version-dependent; use the current Search documentation when selecting retrieval behavior.

## Indexing

`cognee.add(...)` prepares source data for processing. Data can be grouped into datasets so applications can separate corpora, permissions, projects, or tenants.

`cognee.cognify()` processes added data into Cognee's memory representation. The pipeline chunks source material, derives entities and relationships, creates embeddings, and constructs a queryable graph.

A useful production ingestion flow is:

```python
await cognee.add(source, dataset_name="product_docs")
await cognee.cognify(datasets=["product_docs"])
```

Keep the original source identity and dataset boundary stable. Re-indexing should not silently merge unrelated tenants or environments.

## Retrieval

Cognee search can combine semantic/vector retrieval with graph-aware retrieval. Search types determine whether the caller wants chunks, graph information, summaries, or generated answers.

A conceptual retrieval call is:

```python
results = await cognee.search(
    query_text="Which services depend on the authentication service?",
)
```

For HTTP deployments, Cognee exposes an API. The official API reference demonstrates the same lifecycle through `/api/v1/add`, `/api/v1/cognify`, and `/api/v1/search`.

## Basic service setup

For a persistent application:

1. Choose and configure the supported relational/vector and graph storage required by the deployment.
2. Configure LLM and embedding providers explicitly.
3. Define datasets around real authorization and lifecycle boundaries.
4. Ingest sources with stable identifiers.
5. Cognify asynchronously rather than blocking interactive requests on large indexing jobs.
6. Expose retrieval through your application service or Cognee's HTTP API.
7. Record source revisions so stale graph facts can be traced back to their inputs.
8. Test deletion and re-indexing before treating the knowledge layer as production-ready.

## Best practices

- **Separate ingestion from retrieval.** Indexing is background data processing; interactive agent requests should normally query an already prepared store.
- **Use datasets deliberately.** Dataset boundaries should correspond to ownership, project, tenant, or access boundaries rather than becoming one global bucket.
- **Preserve provenance.** A graph edge inferred from source text is derived knowledge, not an authoritative business record.
- **Re-check permissions at retrieval time.** Index-time access alone is insufficient when memberships or document permissions can change.
- **Evaluate retrieval separately from generation.** Confirm that the right entities, relationships, and source passages are retrieved before judging the final LLM answer.
- **Plan deletion.** Cognee exposes dataset/data deletion APIs; test removal from every backing representation your deployment uses.
- **Pin configuration.** Record Cognee version, graph/vector backends, embedding model, LLM, chunking behavior, and search mode when comparing results.
- **Use application APIs for live state.** A knowledge graph is appropriate for relationships and accumulated context; rapidly changing transactional truth should usually come from its system of record.

Cognee overlaps GraphRAG, RAG, and agent memory. Its presence in this directory describes its GraphRAG role; the underlying lexical concepts remain independent of Cognee.
