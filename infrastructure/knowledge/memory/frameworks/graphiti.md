# Graphiti temporal memory

Official resources: [Repository](https://github.com/getzep/graphiti), [Overview](https://help.getzep.com/graphiti/getting-started/overview), [Quick start](https://help.getzep.com/graphiti/getting-started/quick-start), [Search](https://help.getzep.com/graphiti/working-with-data/searching).

Graphiti builds a temporal knowledge graph from episodes such as messages, events, and structured records. It is useful when entities and relationships change over time and retrieval should retain their history. It belongs to durable memory, even though its graph-aware retrieval can supply evidence to a RAG application. It is not Microsoft's corpus-community summarization algorithm.

Open-source Graphiti and hosted Zep are different delivery surfaces. Do not infer hosted-service endpoints, operations, or guarantees solely from the open-source package, and do not describe a self-hosted database as a fully managed memory service.

## Add episodes and retrieve facts

Use the [0.30.2 release](https://github.com/getzep/graphiti/releases/tag/v0.30.2), a dedicated Neo4j database, and a configured provider environment:

```bash
python -m pip install "graphiti-core==0.30.2"
```

Set `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`, and the provider credentials required by the selected Graphiti client. The constructor below uses the documented default provider configuration, which requires `OPENAI_API_KEY`. Model selection, embedding compatibility, and provider calls are real configuration/cost decisions.

```python
import asyncio
import os
from datetime import datetime, timezone
from graphiti_core import Graphiti
from graphiti_core.nodes import EpisodeType

async def main():
    graph = Graphiti(
        os.environ["NEO4J_URI"], os.environ["NEO4J_USER"],
        os.environ["NEO4J_PASSWORD"],
    )
    try:
        await graph.build_indices_and_constraints()
        await graph.add_episode(
            name="DEC-2:r1",
            episode_body="Team Amber owns APP-42 from September 1, 2026.",
            source=EpisodeType.text,
            source_description="Synthetic project-A ownership decision",
            reference_time=datetime(2026, 9, 1, tzinfo=timezone.utc),
        )
        await graph.add_episode(
            name="DEC-2:r2",
            episode_body="From September 10, 2026, team Blue replaces team Amber as owner of APP-42.",
            source=EpisodeType.text,
            source_description="Synthetic replacement ownership decision",
            reference_time=datetime(2026, 9, 10, tzinfo=timezone.utc),
        )
        for edge in await graph.search("Who owns APP-42?"):
            print(edge.uuid, edge.fact, edge.valid_at, edge.invalid_at)
    finally:
        await graph.close()

if __name__ == "__main__":
    asyncio.run(main())
```

Run this in an isolated graph: the example deliberately does not implement a multi-user authorization service. Episode names are useful source labels but not a promise of idempotent insertion. Persist episode IDs and source revisions in the application and verify duplicate/retry behavior before scheduling repeated ingestion.

The returned facts are extracted graph evidence, not a generated final answer. Inspect valid/invalid times and supporting episodes before choosing a current claim. The example asks the extractor to interpret a replacement; it does not guarantee the extractor always recognizes that relation correctly.

## Preserve temporal meaning

[Temporal knowledge graphs](../../knowledge-graphs/temporal-knowledge-graphs.md) distinguish when a claim applies from when the system learned it. An episode's reference time is context for interpreting the event, not proof that all facts in the episode became true at ingestion time.

A new owner can supersede an old owner without either historical claim being false. An overlapping exclusive ownership claim is a different case. Model-assisted invalidation should be checked against the domain's cardinality and source authority. Preserve uncertainty rather than allowing a recent low-authority message to overwrite a formal decision automatically.

For a historical query, explicitly evaluate temporal filters and the selected search API's semantics. A natural-language date in the query alone is not a verified as-of filter. Test both world-as-of and system-belief-as-of questions, and state when the stored data cannot reconstruct one of them.

## Retrieval and isolation

The documented search combines lexical and semantic signals, with richer recipes for reranking and graph-distance-sensitive results. Graph proximity can help personalize a context around a known entity, but it does not establish permission or causal relevance.

Use namespacing and authorized group selection consistently across ingestion, search, and deletion, backed by an application authorization decision. Never accept arbitrary group IDs from an untrusted client under a privileged driver. The 0.30.2 release includes fixes related to concurrent group isolation and cleanup; this is a reason to retain regression tests, not to assume every custom service wrapper is isolated.

For multi-tenant code, avoid mutable shared driver state that changes the active group between concurrent requests. Verify the selected database adapter's routing behavior. Keep source content and extracted facts out of unrestricted telemetry and traces; review the repository's documented telemetry configuration when deploying.

## Operate memory as a source-backed system

Control episode ingestion concurrency and model request budgets. Faster concurrent extraction can exceed provider quotas or worsen identity conflicts. Keep foreground application writes responsive while the memory service processes durable work.

Distinguish source deletion, claim invalidation, and historical retention. Removing an episode must not leave private information retrievable from derived descriptions, shared edges, summaries, or application caches. Conversely, deletion of one support should not erase a relationship still supported by another authorized episode unless policy requires it. Verify cleanup for every node/edge type used by the selected release.

Use the [R7 fixture](../../graphrag/graphrag-definition.md#a-shared-synthetic-release-example) to test late-arriving decisions, duplicate names, conflicting owners, group isolation under concurrency, current versus historical queries, missing evidence, and interrupted deletion. Add the graph facts to an answer only after source and permission checks. Memory retrieval should enrich current application state, not silently replace its system of record.
