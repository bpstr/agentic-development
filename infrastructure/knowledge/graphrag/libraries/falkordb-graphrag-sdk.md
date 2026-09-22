# FalkorDB GraphRAG SDK

Official resources: [Documentation](https://docs.falkordb.com/graphrag/), [Getting started](https://docs.falkordb.com/graphrag/getting-started), [API reference](https://docs.falkordb.com/graphrag/api-reference), [Repository](https://github.com/FalkorDB/GraphRAG-SDK).

The SDK builds and retrieves a source-backed knowledge graph in FalkorDB through replaceable processing strategies. Its current async facade uses ingestion, finalization, retrieval, and completion as separate operations. The database supplies storage; the SDK supplies processing; the application still owns source permissions and accepted business changes.

## Configure schema and embedding compatibility

Use a dedicated local FalkorDB service bound to loopback or a secured remote deployment, and a virtual environment with the [1.4.0 release](https://github.com/FalkorDB/GraphRAG-SDK/releases/tag/v1.4.0):

```bash
python -m pip install "graphrag-sdk[litellm]==1.4.0"
```

Configure provider credentials in the environment. Set `CHAT_MODEL` and `EMBEDDING_MODEL` to LiteLLM provider-qualified names, and `EMBEDDING_DIMENSIONS` to a supported output dimension. The embedding model must accept the requested dimensions in this example; otherwise use its native output size and omit the provider dimension override. The graph's configured dimension must still match.

```python
import asyncio
import os
from graphrag_sdk import (
    GraphRAG, ConnectionConfig, LiteLLM, LiteLLMEmbedder,
    GraphSchema, EntityType, RelationType,
)

async def main():
    dimensions = int(os.environ["EMBEDDING_DIMENSIONS"])
    if dimensions <= 0:
        raise ValueError("EMBEDDING_DIMENSIONS must be positive")
    schema = GraphSchema(
        entities=[EntityType(label="Task"), EntityType(label="Service"), EntityType(label="Document")],
        relations=[RelationType(label="AFFECTS"), RelationType(label="DOCUMENTS")],
    )
    async with GraphRAG(
        connection=ConnectionConfig(
            host=os.environ.get("FALKORDB_HOST", "127.0.0.1"),
            port=int(os.environ.get("FALKORDB_PORT", "6379")),
            username=os.environ.get("FALKORDB_USERNAME"),
            password=os.environ.get("FALKORDB_PASSWORD"),
            graph_name="r7_demo",
        ),
        llm=LiteLLM(model=os.environ["CHAT_MODEL"]),
        embedder=LiteLLMEmbedder(model=os.environ["EMBEDDING_MODEL"], dimensions=dimensions),
        schema=schema, embedding_dimension=dimensions,
    ) as rag:
        result = await rag.ingest(
            text="APP-42 affects billing-eu. DOC-7 documents snapshot verification before rollback.",
            document_id="DOC-7",
        )
        print(result)
        print(await rag.finalize())
        context = await rag.retrieve("Which runbook helps with APP-42?")
        for item in context.items:
            print(item.content, item.metadata)
        answer = await rag.completion("What must happen before rollback?", return_context=True)
        print(answer.answer)

if __name__ == "__main__":
    asyncio.run(main())
```

This is a synthetic single-graph demonstration and makes real model calls. Load `.env` explicitly when using one; do not assume the SDK loads it. Use a model compatible with the SDK's generation options or configure the provider options documented for it.

## Understand finalization and evidence

Ingestion and cross-document finalization serve different purposes. The [API reference](https://docs.falkordb.com/graphrag/api-reference) describes finalization's entity-resolution and missing-embedding work. Finalization can perform additional inference; do not hide it inside an ingestion-success timestamp or assume it is cost-free.

Schema-guided extraction is not proof that entities with similar names are identical. Inspect cross-document merges using `billing-eu` versus `billing-us`, retain rejected merges where the implementation supports them, and keep application-issued IDs authoritative.

`retrieve` returns context without the final answer-generation step. `completion(..., return_context=True)` also exposes the retrieval result used for an answer. Inspect item content and metadata and resolve original source revisions; do not assume every item is independently citable simply because it has a score.

## Updates, deletion, and ontology changes

The [incremental-update guide](https://docs.falkordb.com/graphrag/incremental-updates) defines `update`, `delete_document`, and `apply_changes`. Stable document IDs make replacement and cleanup addressable. Inside an existing async context, a scoped lifecycle can use:

```python
async def revise_and_remove(rag):
    result = await rag.update(
        text="DOC-7 now requires snapshot verification and an owner check before rollback.",
        document_id="DOC-7",
    )
    print(result)
    await rag.finalize()
    # Explicit destructive cleanup of this demonstration document only.
    print(await rag.delete_document("DOC-7", if_missing="ignore"))
```

The documented cleanup preserves entities and edges still supported by other sources. Update/delete recovery uses persisted progress, but callers still need event ordering, application cache invalidation, and verification after interruption. Batch outcomes require per-item inspection rather than treating return of a batch object as total success. Follow the documented serialization requirements for updates that perform orphan cleanup.

[Ontology evolution](https://docs.falkordb.com/graphrag/ontology-evolution) distinguishes schema changes from re-extraction and data migration. Review the proposed change before applying it to a populated graph. Renaming `MENTIONS` to `AFFECTS` changes meaning and cannot be justified by a label migration alone.

## Production boundaries and checks

Use separate database and provider credentials for controlled ingestion versus application retrieval, restrict network access, and bound query time and connection pools. A graph name is a storage selector, not an authorization decision. Never let a user choose an arbitrary graph name under a privileged service identity.

Test repeated ingestion, a no-op update, a real source revision, interrupted cleanup, a shared entity surviving deletion of one source, an unsupported relationship, and a revoked source after the answer cache is warm. Include strict embedding-dimension checks and a model-change rebuild exercise.

Vendor benchmark claims describe the vendor's experiment. They do not establish accuracy, latency, or cost on this repository's R7 fixture or a production task corpus. Use controlled [GraphRAG evaluations](../../../../operations/evaluation/graphrag-evaluation.md) and record pipeline, model, schema, corpus, and graph revisions with the results.
