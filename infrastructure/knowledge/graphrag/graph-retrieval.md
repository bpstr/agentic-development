# Graph retrieval

Graph retrieval selects evidence using entities and relationships. A common pipeline resolves seed identities, retrieves candidate nodes or passages, explores bounded neighborhoods, ranks evidence, and returns original supporting sources. Microsoft's [local search](https://microsoft.github.io/graphrag/query/local_search/) is one implementation combining graph context with source text; it is not the only algorithm for this pattern.

## Resolve before expanding

Use explicit application identifiers before uncertain semantic matches. In the [synthetic R7 corpus](graphrag-definition.md#a-shared-synthetic-release-example), resolve `APP-42` to its canonical task inside the authorized workspace. Resolve the display name Billing with project and source context; `billing-eu` and `billing-us` must not merge merely because their names match.

A useful seed record includes canonical ID, resolution method, source evidence, authorized scope, and any ambiguity. Multiple plausible identities should remain candidates or trigger clarification, not become a forced merge. Query rewriting may help discover synonyms, but preserve the original identifiers and user constraints.

## Retrieve candidates through complementary routes

Exact-ID lookups, lexical search, vector search, and known relationships serve different purposes. Run complementary candidate routes within a common deadline, not an unbounded sequence of model calls. Maintain the route that found each candidate so a graph expansion can be compared with an otherwise identical retrieval baseline.

A candidate route need not generate prose. For a task page, retrieving source records and evidence is sufficient; answer generation is a separate optional operation.

When scores use incompatible meanings, do not add raw cosine distance, keyword scores, and path weights. Reciprocal rank fusion combines ranks instead. A typical form is `sum(1 / (c + rank))` over retrieval lists, with a chosen positive constant `c`; it is a ranking heuristic, not a probability that the candidate is true. The [Azure AI Search RRF explanation](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking) describes a concrete implementation. Tune fusion and reranking on reviewed examples, and preserve score direction and provenance in diagnostics.

## Bound traversal semantically and operationally

Define permitted edge types and directions, maximum hops, neighbors per node, total candidates, query deadline, and evidence-token budget. A hop limit alone does not bound work when a node has millions of neighbors. Avoid traversing broad hubs such as generic topics or whole workspaces unless their contribution is specifically useful.

For “Which incidents involved services blocking R7?”, the application can:

1. Read current blocking tasks for R7 from the owning system.
2. Resolve their affected services from explicit task relationships.
3. Retrieve incident records and passages connected to those services.
4. Verify each path and source before context assembly.

An incident-service association is not a causal edge. The answer can say that INC-17 involved a blocking task's service, but cannot conclude that INC-17 caused the delay.

Use visited-state tracking to bound cyclic graphs. Decide whether the state is only a node ID or a richer combination of node, path pattern, and time: suppressing every repeated node can remove a valid path reached through a different relationship. Preserve several useful evidence paths without paying repeatedly for identical passages.

## Apply scope before evidence escapes

Authorize seeds, intermediate nodes, edges, and source passages before they enter the caller's context. Restrict traversal itself where the backend permits it. An application that traverses inaccessible nodes and merely removes the final document can still leak names, counts, explanations, or topology.

Shared summaries are especially dangerous: access to one member document does not authorize a report containing other members. Query caches, traces, rerankers, and external model calls need the same boundary. A nodeset or namespace parameter is only an authorization boundary when the selected implementation actually enforces it.

Apply temporal validity to the whole path. A currently valid starting task does not make an obsolete ownership edge current. [Temporal knowledge graphs](../knowledge-graphs/temporal-knowledge-graphs.md) distinguish event time from when the system learned a claim.

## Rank evidence, then assemble context

Use graph proximity as a candidate signal, not a verdict. Candidate quality can depend on query relevance, permitted relation type, source authority for the question, current revision, source support, and useful novelty. Prefer a passage that actually explains rollback over a nearby document merely mentioning Billing.

Deduplicate by stable evidence identity such as `(source_id, revision, locator)`. Keep alternate supporting paths as metadata rather than repeating the passage. Group neighboring chunks when needed to restore context, but account for their combined tokens. Reserve space for instructions, the user question, citations, and the answer rather than filling the entire context with graph neighborhoods.

For multi-hop questions, keep the evidence for each necessary edge. Dropping the dependency passage while retaining the incident text makes the final relationship difficult to verify. Generated entity descriptions and community reports should be marked as derived artifacts and traceable to original sources.

For suggestions across projects, broaden candidate scope only to projects the principal may read. Require a strong evidence-based match, not simply adjacency to another linked task. A rejected suggestion should not be reintroduced unchanged after every keystroke; retain rejection against the task/source revisions and reconsider when material context changes.

## Diagnose and degrade explicitly

| Symptom | Inspect first |
| --- | --- |
| Relevant source never becomes a candidate | Parsing, ingestion state, seed identity, candidate routes, or scope |
| Candidate appears but loses ranking | Fusion, score direction, hub expansion, duplicates, or reranker |
| Correct path has no source text | Provenance mapping and context assembly |
| Current question gets old ownership | Valid-time filters and publication revision |
| Whole graph appears relevant | High-degree seeds, permissive edge types, missing total budget |
| Empty response after a backend failure | Failure status conflated with a genuine no-match result |

Record seeds, expansion counts, selected paths, dropped-candidate reasons, source revisions, elapsed time per stage, and the final evidence budget. Do not put unrestricted source text into broadly accessible logs.

On a graph timeout, an application may return authorized lexical/vector evidence with a degraded status. Do not claim that a relationship was verified when only a text match survived. Evaluate graph retrieval independently of final answer quality using the [graph-specific evaluation guide](../../../operations/evaluation/graphrag-evaluation.md).
