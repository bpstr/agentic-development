# Cognee conversation and durable memory

Official resources: [Sessions and caching](https://docs.cognee.ai/core-concepts/sessions-and-caching), [Remember](https://docs.cognee.ai/core-concepts/main-operations/remember), [Recall](https://docs.cognee.ai/core-concepts/main-operations/recall), [Repository](https://github.com/topoteretes/cognee).

Cognee distinguishes session memory from permanent graph-backed memory. A session can retain interaction context; selected content can later be incorporated into the durable graph. This page covers those lifetimes; [Cognee's GraphRAG guide](../../graphrag/frameworks/cognee.md) covers source indexing and retrieval.

Using the same local storage setup, enable caching before importing Cognee:

```dotenv
CACHING=true
CACHE_BACKEND=sqlite
AUTO_FEEDBACK=false
```

Then use an application-derived session ID:

```python
import asyncio
import cognee

async def main():
    await cognee.remember(
        "For release R7, preserve the existing customer data.",
        session_id="demo-thread-r7",
        self_improvement=False,
    )
    results = await cognee.recall(
        query_text="customer data",
        session_id="demo-thread-r7",
        scope="session",
    )
    for result in results:
        print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

Session-only recall can search stored entries by keyword; do not assume it is identical to graph retrieval. Enabling improvement changes whether and how session material enters permanent memory.

Keep session identity separate from dataset authorization. A client-provided thread string should not grant access to another conversation. Preserve the original transcript and tool receipts outside a lossy memory summary when auditability or exact recall matters.

Define correction, expiration, and deletion across both lifetimes. A forgotten session may already have contributed knowledge to a graph, while a graph deletion does not necessarily remove the originating transcript. Test those transitions with the actual cache and graph backends selected for deployment.
