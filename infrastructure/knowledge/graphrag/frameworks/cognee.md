# Cognee

Official resources: [Documentation](https://docs.cognee.ai/), [Architecture](https://docs.cognee.ai/core-concepts/architecture), [Python API](https://docs.cognee.ai/python-api/remember), [Repository](https://github.com/topoteretes/cognee).

Cognee constructs searchable knowledge from source content using relational metadata, vectors, and graph relationships. Its GraphRAG role is to retrieve connected evidence. Current task status, permissions, and accepted task/document links should remain authoritative in the application that owns them.

## Choose the lifecycle and deployment boundary

The high-level Python lifecycle uses `remember` for ingestion/processing and `recall` for retrieval. Lower-level `add`, `cognify`, and `search` remain useful for controlled pipelines. A source-ingestion call without a session ID and a conversation-memory call with a session ID are not interchangeable.

[Cognee Cloud](https://docs.cognee.ai/cognee-cloud/overview) supplies a hosted delivery option. A self-hosted HTTP server, an in-process Python integration, and a Cloud tenant have different configuration and credential boundaries. An HTTP or TypeScript client does not automatically expose Python custom-pipeline extensibility. MCP exposes tools; it does not replace dataset authorization.

## Quick start

Complete the [basic local setup](cognee-basic-setup.md). This example targets the pinned 1.6.0 environment and retrieves chunks without a final answer-generation call:

```python
import asyncio
import cognee
from cognee import SearchType

async def main():
    await cognee.remember(
        "Release R7 is blocked by task APP-42. "
        "APP-42 affects billing-eu. DOC-7 explains snapshot verification "
        "and rollback for billing-eu.",
        dataset_name="demo-release-r7",
        extractor="gliner_demo",
        self_improvement=False,
    )
    results = await cognee.recall(
        query_text="Where is the rollback procedure for APP-42's service?",
        datasets=["demo-release-r7"],
        query_type=SearchType.CHUNKS,
        top_k=5,
    )
    for result in results:
        print(result.text)

if __name__ == "__main__":
    asyncio.run(main())
```

This small text demonstrates connectivity language; it is not a full execution of the [multi-source R7 fixture](../graphrag-definition.md#a-shared-synthetic-release-example). Use separate source items and identities when testing provenance, updates, and deletion.

## What to inspect next

[Cognee indexing](cognee-indexing.md) covers source management, extraction choices, and completion state. [Cognee retrieval](cognee-retrieval.md) distinguishes chunks, graph context, and generated answers. The [production integration guide](../integrations/cognee-production-integration.md) covers authenticated HTTP, compatible storage handlers, and application-owned guarantees.

The [1.6.0 release](https://github.com/topoteretes/cognee/releases/tag/v1.6.0) includes keyless-workflow and pipeline-recovery changes, records embedding models per dataset, and removes GLiNER from the default Docker image. Installing the Python extras below is therefore not equivalent to launching an arbitrary default image.

Judge the integration by evidence quality and lifecycle behavior, not graph size. Extracted relationships are claims rather than verified business facts. A graph containing many nodes can still lack the implementation bodies or source locators needed for a task. Keep the existing [conversation-memory](../../memory/frameworks/cognee-memory.md) and [input-transformer](../../multimodal/tools/cognee-input-transformers.md) boundaries explicit.
