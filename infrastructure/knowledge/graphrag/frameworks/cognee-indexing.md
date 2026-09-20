# Cognee indexing

Official resources: [Remember operation](https://docs.cognee.ai/core-concepts/main-operations/remember), [remember API](https://docs.cognee.ai/python-api/remember), [Dataset permissions](https://docs.cognee.ai/core-concepts/multi-user-mode/permissions-system/overview).

Cognee's `remember` ingests permanent content and runs its processing pipeline when no session ID is supplied. A session ID selects a different memory path. Keep document indexing explicit rather than accidentally mixing source ingestion with conversation caching.

After the [basic setup](cognee-basic-setup.md), create a small UTF-8 text file named `runbook.txt`. Save this as `index_runbook.py` and run it from the same directory:

```python
import asyncio
from pathlib import Path
import cognee

async def main():
    source = Path("runbook.txt").resolve(strict=True)
    result = await cognee.remember(
        str(source),
        dataset_name="demo-runbooks",
        extractor="gliner_demo",
        self_improvement=False,
        incremental_loading=True,
    )
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

The documented API accepts paths and other supported input forms. This example uses a blocking completion of the pipeline and disables the additional improvement stage. If enabling background execution, track completion separately before declaring the source searchable.

Keep source IDs, revisions, and ingestion receipts in the owning application. Incremental loading is useful, but does not by itself define ordering for external change events, a deletion policy, or an atomic multi-source publication boundary.

Choose datasets according to sharing and lifecycle requirements. Node-set tags organize graph content; they are not a replacement for permission boundaries. With backend access control enabled, verify dataset ownership, grants, and the selected graph/vector handlers.

Reindex changed sources deliberately and inspect extracted identities and relationships. Preserve supporting passages and propagate deletion to derived graph claims and summaries. For rapidly changing state such as task status, query the application directly instead of depending on indexing latency.
