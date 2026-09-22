# Knowledge freshness

Freshness describes how well a retrieved representation reflects the information needed now. Source freshness and processing freshness are different: a document indexed today can still describe last year's procedure.

Track source update time, source revision, indexing completion time, and any validity period stated by the content. Choose freshness requirements by query type. A historical decision can remain useful indefinitely; a task's current owner may require a direct API read.

For “What is blocking today's release?”, use current task and dependency records. For “Why did the team choose this deployment strategy?”, historical documents may be the correct evidence even when newer notes exist.

An index can expose its last successfully published revision and synchronization lag. Failed updates should not silently reset that timestamp. If stale evidence is still useful, make its observation time available to the answer generator.

[Microsoft GraphRAG's indexing dataflow](https://microsoft.github.io/graphrag/index/default_dataflow/) illustrates how several derived artifacts depend on source processing. Updating source text alone does not necessarily refresh every summary or extracted relationship.

Permission revocation has stricter timing than ordinary content refresh. Apply current authorization before retrieval results reach a model, even when reindexing is delayed.

Cache keys should include relevant source or index generations and access scope. A semantically similar question can require a different answer after a source change; similarity alone is insufficient for cache reuse.

## Coherent graph and application revisions

A graph path can combine edges from incompatible periods. For a historical question, verify the validity of every required edge at the requested time. For a current question, use the owning application's current records when indexing lag would change the answer. [Temporal knowledge graphs](../knowledge-graphs/temporal-knowledge-graphs.md) distinguish valid time from recorded time and explain late-arriving changes.

Keep desired source revision, processing revision, and published retrieval revision separate. A new chunk with an old community report is not necessarily a coherent new index. Publish only after the affected artifacts and source mappings pass the required checks, or expose partial status explicitly.

For task-page suggestions, attach the saved task revision to each request and response. Ignore a response for an older description after a newer edit has been saved. The [application integration guide](../graphrag/integrations/graphrag-application-integration.md) connects debouncing, worker ordering, publication, and cache validity without treating a client-side abort as guaranteed server cancellation.
