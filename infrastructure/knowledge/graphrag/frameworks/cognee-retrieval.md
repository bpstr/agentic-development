# Cognee retrieval

Official resources: [Recall operation](https://docs.cognee.ai/core-concepts/main-operations/recall), [recall API](https://docs.cognee.ai/python-api/recall), [Search strategies](https://docs.cognee.ai/python-api/search).

Cognee's `recall` retrieves from memory and can select a search strategy automatically. Explicitly choosing a mode makes evidence inspection and latency comparisons easier. Raw chunks, graph context, and generated answers are different outputs.

After [indexing `demo-runbooks`](cognee-indexing.md), save and run this from the configured project directory:

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

if __name__ == "__main__":
    asyncio.run(main())
```

This retrieves embedded passages. For graph-derived context, a configured application can use the following alternative inside an async function:

```python
context = await cognee.recall(
    query_text="Which dependencies block release R7?",
    datasets=["demo-release-r7"],
    query_type=SearchType.GRAPH_COMPLETION,
    only_context=True,
)
```

`only_context=True` skips final answer generation. Completion strategies can return an assembled prompt artifact rather than one independently citable passage per result; inspect the selected mode's payload before presenting it as evidence. Retrieval may still compute query embeddings or perform other mode-specific processing.

With a configured LLM, omitting `only_context` on a completion mode generates an answer. Keep that additional inference visible in cost and latency measurements.

Scope every query. Dataset names resolve owned datasets; use authorized dataset UUIDs through `dataset_ids` for shared datasets created by another user. Derive scope server-side and recheck permissions. An omitted scope can search more accessible data than the request intended, and a retrieval score does not prove a claim's truth.
