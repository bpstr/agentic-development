# Cognee

Official resources: [Documentation](https://docs.cognee.ai/), [Architecture](https://docs.cognee.ai/core-concepts/architecture), [Python API](https://docs.cognee.ai/python-api/remember), [Repository](https://github.com/topoteretes/cognee).

Cognee turns source content into searchable memory using relational metadata, vectors, and graph relationships. Its GraphRAG role is to construct and retrieve connected evidence; current business records should remain in the application that owns them.

The current high-level Python lifecycle uses `remember` for ingestion and processing, and `recall` for retrieval. Lower-level `add`, `cognify`, and `search` operations still appear in advanced examples. Match the API and documentation to the installed release rather than mixing signatures from different generations.

## Quick start

Complete the [basic local setup](cognee-basic-setup.md), then save and run this example as `quickstart.py`:

```python
import asyncio
import cognee
from cognee import SearchType

async def main():
    await cognee.remember(
        "Release R7 is blocked by task APP-42. "
        "APP-42 requires a billing migration.",
        dataset_name="demo-release-r7",
        extractor="gliner_demo",
        self_improvement=False,
    )
    results = await cognee.recall(
        query_text="What blocks release R7?",
        datasets=["demo-release-r7"],
        query_type=SearchType.CHUNKS,
    )
    for result in results:
        print(result.text)

if __name__ == "__main__":
    asyncio.run(main())
```

This retrieves source chunks using the local setup; it does not generate an answer. The [v1.6.0 release](https://github.com/topoteretes/cognee/releases/tag/v1.6.0) documents local extraction and keyless workflows.

Use [Cognee indexing](cognee-indexing.md) to manage sources and [Cognee retrieval](cognee-retrieval.md) to select chunks, graph context, or generated answers. Keep dataset authorization, source revisions, deletion, and result evaluation explicit. Graph extraction proposes claims; it does not verify that every relation is correct or still current.
