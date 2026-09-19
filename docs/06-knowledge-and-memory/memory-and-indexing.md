# Memory, freshness, and incremental indexing

[Handbook](../../README.md) · [Chapter](README.md)

“Memory” can refer to several different mechanisms. Specify which one you need before selecting a product:

| Mechanism | Purpose | Example |
| --- | --- | --- |
| Conversation history | Preserve what was said | Original user messages and tool results |
| Working state or checkpoint | Resume a running workflow | Pending approval, selected task ID, completed step |
| Compacted context | Fit a long interaction into a bounded request | Recent messages plus an earlier summary |
| Durable memory | Recall selected information across sessions | A confirmed project convention with its source |
| Knowledge index | Search an external collection | Indexed runbooks, issues, or repository files |
| Cache | Reuse prior computation | A parsed document or repeated retrieval result |

[LangGraph's memory guide](https://docs.langchain.com/oss/python/langgraph/add-memory) distinguishes thread-level state from information shared across conversations, and describes trimming, summarization, and persistence. These distinctions apply beyond LangGraph.

## Conversation memory needs evidence

Persist the original messages separately from the context assembled for a model call. A summary is a derived, lossy view. Preserve active goals, constraints, unresolved questions, entity identifiers, and successful action receipts explicitly; retrieve original messages when exact wording matters.

For example, “continue with the same task” requires a reliable task reference. A useful compacted state might contain:

```json
{
  "thread_id": "thread-93",
  "active_task_id": "APP-42",
  "goal": "Prepare the migration rollback procedure",
  "constraints": ["Keep existing customer data"],
  "pending": ["Confirm the backup restoration test"],
  "source_message_ids": ["msg-18", "msg-23"],
  "summary_revision": 4
}
```

This is an application schema, not a provider API. It identifies the task but does not prove its present status. Read the task before relying on current values. Similarly, an assistant saying “I updated it” is not equivalent to a successful mutation receipt.

For durable memory, store origin, time, scope, and whether a statement was explicitly confirmed or inferred. Make corrections supersede earlier values. A user preference and a team's shared operating rule need different scopes.

## An index follows its source

Design ingestion around a stable source ID and revision. Record content hashes, parser and embedding versions, source update time, and indexing completion time. Source freshness and processing freshness are different: a document indexed today may still contain last year's procedure.

A practical update flow is:

1. Receive an event identifying the changed source and revision.
2. Read authoritative content and access metadata.
3. Skip unchanged work; regenerate affected chunks and representations.
4. Publish the completed revision, then retire superseded entries.
5. Record success or failure and reconcile missed events periodically.

Make retries idempotent and reject older events that would overwrite newer revisions. Keep the previous revision searchable until its replacement is complete when the access policy permits. [LlamaIndex's ingestion pipeline](https://developers.llamaindex.ai/python/framework/module_guides/loading/ingestion_pipeline/) documents hashes, transformation caching, and document management; it illustrates useful components without supplying your application's complete synchronization policy.

Graph changes may also require rebuilding affected relationships and summaries. Deleting a source chunk while leaving its generated community report searchable can preserve the deleted information.

## Permissions, deletion, and caches

Derive access filters from authenticated server-side identity. Apply authorization before content reaches the answer model or an external reranker, and recheck current permissions when resolving source links. Revocation must take effect even if content reindexing is delayed. Test cross-tenant queries, restricted project documents, and revoked membership with the actual configured adapters.

Track derived artifacts by source so deletion can cover chunks, vectors, graph claims, summaries, and cached answers. Retention for original conversations, traces, and backups is a separate policy. Keep deletion tombstones long enough to prevent a delayed ingestion job from resurrecting content.

A cache does not establish freshness or authorization. Include tenant, permission scope, source revision, and relevant processing versions in keys. Semantic similarity alone is insufficient for reusing an answer: “who owns APP-42?” may have a different answer an hour later. Keep exact current-state reads cheap rather than caching an inferred answer indefinitely.

*Sources reviewed: 2026-09-19. Schema and synchronization flow are original design examples; external integrations were not runtime-tested.*
