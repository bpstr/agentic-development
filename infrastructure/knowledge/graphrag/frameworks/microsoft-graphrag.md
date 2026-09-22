# Microsoft GraphRAG

Official resources: [Documentation](https://microsoft.github.io/graphrag/), [Getting started](https://microsoft.github.io/graphrag/get_started/), [CLI reference](https://microsoft.github.io/graphrag/cli/), [Repository](https://github.com/microsoft/graphrag).

Microsoft GraphRAG constructs retrieval artifacts from a corpus, including entities, relationships, source text units, and community reports. It is a particular graph-based RAG implementation, not the generic name for every graph retrieval system.

The repository reviewed on September 22, 2026 describes the project as largely in maintenance mode, with bug/dependency fixes as appropriate rather than new feature development, and says it is not an officially supported Microsoft offering. Evaluate that maintenance boundary separately from its research value. The [Azure accelerator](https://github.com/Azure-Samples/graphrag-accelerator) is also archived; it is not a maintained turnkey service.

## Initialize, index, and query

Use a supported Python environment, install `graphrag`, and record the resolved package version in a lockfile. The following uses the current documented positional-query CLI, not older examples that pass `--query`:

```bash
mkdir graphrag-demo
cd graphrag-demo
python -m venv .venv
source .venv/bin/activate
python -m pip install graphrag
python -c 'from importlib.metadata import version; print(version("graphrag"))'
graphrag init
```

Select available chat and embedding models in the generated configuration, supply credentials through the referenced environment variables, and place a few authorized UTF-8 source files in `input/`. Start with the [synthetic R7 documents](../graphrag-definition.md#a-shared-synthetic-release-example), not a production-wide corpus.

```bash
graphrag index --dry-run
graphrag index --method standard
graphrag query "Which incidents involved services blocking R7?" --method local
graphrag query "Which operational themes recur in the reports?" --method global
graphrag query "What does the rollback runbook say?" --method basic
```

The dry run checks configuration without running the indexing steps; it is not a complete cost estimate or integration test. Actual indexing and queries can invoke paid providers. Keep source files, configuration, prompts, cache policy, and output revision together.

## Select indexing by graph semantics

[Standard and FastGraphRAG](https://microsoft.github.io/graphrag/index/methods/) differ in how they construct the graph. Standard indexing uses LLM extraction for entities and relationships. FastGraphRAG uses noun phrases and co-occurrence for the graph while retaining other processing, including generated reports. Fast does not mean model-free, nor does co-occurrence establish a causal or application dependency.

Inspect entity identity, source mapping, and predicate meaning before tuning the final answer prompt. The [custom-graph input guide](https://microsoft.github.io/graphrag/index/byog/) shows how an existing graph can enter downstream workflows. Supplying tables that match an expected schema is not enough: descriptions, support mappings, IDs, and embedding inputs must have the intended meaning.

For operational facts already present in a database, importing explicit relationships can avoid re-extracting them from prose. Keep current-state application reads separate from corpus processing; an index of last week's documents cannot guarantee today's blocker list.

## Select retrieval by evidence needs

| Mode | Main mechanism | Important tradeoff |
| --- | --- | --- |
| `basic` | Vector retrieval over text | A useful baseline without graph expansion |
| `local` | Entity-centered graph context plus source text | Seed identity and neighborhood relevance determine usefulness |
| `global` | Community-report processing and aggregation | Broader coverage, but extra report/query work and compressed evidence |
| `drift` | Community-informed local exploration and follow-up questions | More adaptive exploration with a less predictable call/latency budget |

The [query overview](https://microsoft.github.io/graphrag/query/overview/) and [DRIFT explanation](https://microsoft.github.io/graphrag/query/drift_search/) describe these algorithms. Do not map them onto another framework solely because it also has a mode named global or hybrid.

For report queries, choose community granularity and selection policy deliberately. A coarser report can hide a small important incident; retrieving every detailed report can increase inference cost. Inspect the original sources for counts, exact wording, or current operational facts. Enable dynamic selection only after measuring missed-community cases.

## Tune and update without losing provenance

[Prompt tuning](https://microsoft.github.io/graphrag/prompt_tuning/auto_prompt_tuning/) adapts extraction to domain language and examples. Use representative documents, including ambiguous service names and negative relations. Hold out evaluation cases so tuning does not merely memorize the examples used to judge it.

The CLI includes update methods, but an update command is not a substitute for an external source revision/deletion policy. Validate changed entities, reports, and source references before publishing the new output directory. Test permission revocation and source removal against cached reports as well as original chunks.

Configuration formats can change across releases. The repository's migration guidance warns that forced initialization overwrites configuration and prompts. Back them up, compare generated defaults in a separate directory, and apply supported migrations deliberately. Never run a force-initialization command against the only copy of a tuned configuration.

For Azure model configuration, managed identity, resource separation, and the archived accelerator boundary, see [Azure deployment](../integrations/azure-graphrag-deployment.md). For quality claims, compare basic, local, and report-assisted retrieval on the same authorized corpus and evidence budgets using [GraphRAG evaluation](../../../../operations/evaluation/graphrag-evaluation.md).
