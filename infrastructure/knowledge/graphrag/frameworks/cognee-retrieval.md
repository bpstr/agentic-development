# Cognee retrieval

Official resources: [Recall operation](https://docs.cognee.ai/core-concepts/main-operations/recall), [recall API](https://docs.cognee.ai/python-api/recall), [Search strategies](https://docs.cognee.ai/python-api/search), [Search basics](https://docs.cognee.ai/guides/search-basics).

Retrieval is not necessarily answer generation. Choose a mode according to the evidence needed, inspect the actual payload, and account for every model call that the selected strategy performs.

## Start with source chunks

After [indexing the runbook](cognee-indexing.md), execute:

```python
import asyncio
import cognee
from cognee import SearchType

async def main():
    results = await cognee.recall(
        query_text="What must happen before restoring the snapshot?",
        datasets=["demo-runbooks"],
        query_type=SearchType.CHUNKS,
        top_k=5,
    )
    for result in results:
        print(result.text)
        print(result.metadata)

if __name__ == "__main__":
    asyncio.run(main())
```

Initialize through ingestion before using a fresh local store. For the shared service, use authorized dataset UUIDs rather than guessing another user's dataset name.

## Select a strategy by output and mechanism

| Strategy family | Useful question | Integration boundary |
| --- | --- | --- |
| Source chunks or lexical chunks | Which passage describes rollback? | Candidate evidence; no generated answer required |
| Graph completion with context only | What connected evidence explains this task? | Assembled graph-aware prompt/context, not necessarily one source per result |
| Completion with generation | Explain the retrieved evidence | Additional inference, answer-support and citation checks |
| Temporal, summary, or multi-step strategies | Historical or broader reasoning question | Explicit configuration and potentially additional retrieval/model work |

The current auto-router has a limited set of rules; it does not select every advanced strategy merely because the question sounds temporal or graph-related. Use explicit strategies for reproducible latency and relevance comparisons, and recheck defaults when upgrading.

Inside an async function with a configured graph dataset:

```python
context = await cognee.recall(
    query_text="Which dependencies block release R7?",
    datasets=["demo-release-r7"],
    query_type=SearchType.GRAPH_COMPLETION,
    only_context=True,
)
```

`only_context=True` skips final answer generation, not necessarily all inference or query embedding. Completion modes can return a templated user prompt with a separate system prompt rather than independently citable source chunks. Do not wrap that whole prompt in a document card and treat it as original evidence.

## Normalize evidence without inventing fields

Preserve result kind, selected strategy, raw payload, source mappings actually present, and the score's backend meaning. In current chunk results a score may be a distance where lower is better. Do not convert every score into a percentage confidence, compare it directly with graph scores, or silently reverse its ordering.

Source mappings can include data/chunk IDs, chunk position, and document name, but optional fields depend on the payload and pipeline. Require the application adapter to resolve stable source revision and locator before calling a result citable. Keep a missing locator explicit rather than manufacturing a URL.

The documented reference option can attach evidence metadata for completion results, subject to the selected strategy and required migrations. Test that each reference resolves to an authorized original source. A reference sidecar and an assembled graph prompt serve different purposes.

For a task page, return normalized evidence and a short supported relevance reason first. The application can avoid a second full answer-generation call when it only needs suggestions. Do not assume this optimization eliminates extraction, query embedding, or graph-search work.

## Scope every query and inspect failures

[Dataset permissions](https://docs.cognee.ai/core-concepts/multi-user-mode/permissions-system/overview) are distinct from application project permissions. Dataset names resolve owned datasets; `dataset_ids` addresses authorized shared datasets. Derive this scope server-side. Never retry an unresolved or forbidden dataset request by dropping its scope.

The [production guide](../integrations/cognee-production-integration.md) describes compatible handlers and HTTP field names. The Python `query_text`, `query_type`, and `dataset_ids` parameters are not the HTTP JSON field names.

Measure seed/candidate retrieval, context construction, and generation separately. Track dataset/index revision, mode, candidate counts, source coverage, and elapsed time while keeping sensitive text out of unrestricted logs. Compare CHUNKS against graph-derived evidence for the same reviewed cases. A graph mode that returns more text is not necessarily a better task-document retriever.

Treat unauthorized evidence as a hard failure, and distinguish backend error, incomplete index, no match, and insufficient evidence. Test warm-cache revocation, source updates, and ambiguous names using the [GraphRAG evaluation cases](../../../../operations/evaluation/graphrag-evaluation.md).
