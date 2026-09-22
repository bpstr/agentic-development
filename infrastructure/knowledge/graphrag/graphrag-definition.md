# Graph-based retrieval-augmented generation

Graph-based RAG uses relationships to find or organize evidence for a generated answer. It can combine a knowledge graph, passage search, graph traversal, and summaries. A graph alone is not a RAG system: retrieval must supply relevant evidence and generation must remain grounded in that evidence.

**GraphRAG** also names [Microsoft's implementation](https://microsoft.github.io/graphrag/). Its [original paper](https://arxiv.org/abs/2404.16130) studies a graph-and-community-summary approach to query-focused summarization over a corpus. That is a particular contribution, not a guarantee that adding any graph improves every search workload.

## Choose the mechanism from the question

Use the following as an architectural decision aid, not a ranking of products:

| Question | Starting mechanism | What would justify graph retrieval? |
| --- | --- | --- |
| What is the current status of APP-42? | Authorized application/API lookup | Usually nothing; the owning system already has the answer |
| Where is the migration rollback procedure? | Lexical/vector/hybrid passage retrieval | A useful procedure is connected through a known service or dependency but poorly matched by query wording |
| Which incidents involved services blocking R7? | Current dependency lookup, then evidence retrieval | The answer requires joining release, task, service, and incident identities |
| What operational themes recur across this collection? | Collection analysis or hierarchical summaries | Graph communities provide useful coverage and grouping beyond a few similar chunks |
| What did we believe blocked R7 on September 5? | Versioned records and temporal retrieval | Relationships must be evaluated at a particular time, not merely followed as they exist now |
| Summarize these three supplied documents | Direct context or passage selection | A separate graph may add maintenance without useful new evidence |

Long-context generation is another baseline when the authorized corpus fits the model's usable context and cost budget. Compare evidence coverage and answer support, not only whether the request fits a nominal token limit.

## Decide what the graph means

The graph's construction determines what its edges can establish:

| Construction | Example edge | Interpretation |
| --- | --- | --- |
| Application/database relationships | APP-42 `BLOCKS` R7 | An explicit record from an owning system, subject to its revision and permissions |
| Curated knowledge | A reviewed alias resolves to service-billing-eu | A human or controlled mapping approved an identity |
| Model extraction | INC-17 `INVOLVES` service-billing-eu | A proposed claim that needs a source span and extraction/version information |
| Co-occurrence | Billing appears near migration | Association in a text window, not proof of a dependency or cause |

Microsoft's [standard and FastGraphRAG indexing methods](https://microsoft.github.io/graphrag/index/methods/) illustrate the last two approaches: standard extraction uses model-generated entities and relationships, whereas FastGraphRAG derives noun phrases and co-occurrence edges. Do not relabel a co-occurrence edge as an application dependency.

A graph database is optional for a small fixed relationship lookup; SQL joins or an in-memory adjacency structure may suffice. A graph database becomes useful when graph query/storage needs justify it. Likewise, a workflow represented as a graph is [graph orchestration](../../orchestration/graph-orchestration.md), not automatically a knowledge graph.

## A shared synthetic release example

These invented records provide a small corpus for the companion guides. They are not observations about a real application or a provider benchmark.

| Record | Scope | Content or authoritative relationship |
| --- | --- | --- |
| `APP-42:r3` | workspace W, project A | APP-42 blocks R7 and affects service `billing-eu` |
| `DOC-7:r2#rollback` | W, project A | DOC-7 documents snapshot verification and rollback for `billing-eu` |
| `INC-17:r1#impact` | W, project A | INC-17 involved `billing-eu`; it does not say the incident caused R7's delay |
| `DEC-2:r1` | W, project A | Valid before September 10: APP-42 is assigned to team Amber |
| `DEC-2:r2` | W, project A | Valid from September 10: APP-42 is assigned to team Blue |
| `DOC-8:r1` | W, project B, restricted | A separate service `billing-us` has the display name Billing |
| `DOC-9:r1` | workspace X | Another unrelated Billing migration |

A reader allowed only project A can retrieve `DOC-7` through APP-42's explicit affected-service relationship. They must not see DOC-8's title, inferred relationships, or a summary derived from it. Workspace membership alone is not evidence that every project is visible.

For suggestions, “DOC-7 explains rollback for a service this task affects” is an evidence-backed reason to propose a link. It is not permission to write that link automatically. User acceptance and rejection are application events, separate from extraction confidence.

The example intentionally has insufficient evidence for “Who approved R7?” and for “Did INC-17 cause the delay?” Abstaining or explaining the missing evidence is the correct result.

## Separate the stages

Ingestion preserves source identities and locators, extracts or imports relationships, resolves identities, and builds searchable artifacts. Retrieval selects authorized evidence using the question and graph. Context assembly decides which passages and paths fit the budget. Generation uses those passages to answer and cite sources.

Failures differ by stage. A missing document may be a parser failure; a false connection may be an identity merge; a correct path can lose its supporting passage during context truncation. A better final model cannot retrieve an undocumented implementation that was never represented in the index. For code links, distinguish [parser-derived code graphs](../../../development/code-intelligence/code-graphs.md) from descriptions inferred by a model; preserve repository, commit, path, and symbol identity.

[Graph retrieval](graph-retrieval.md) explains bounded traversal and ranking. [Community summaries](community-summaries.md) explain collection-level evidence compression. [GraphRAG evaluation](../../../operations/evaluation/graphrag-evaluation.md) measures whether either improves the application over simpler baselines.
