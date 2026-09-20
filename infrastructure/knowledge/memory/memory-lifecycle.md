# Memory lifecycle

Memory has a lifecycle: propose, validate, store, retrieve, revise, expire, and delete. Treating every extracted fact as permanent creates contradictions and makes correction difficult.

Record each item's source, scope, creation time, validity, and whether it is confirmed or inferred. A new value should supersede an earlier value when both describe the same current fact. Historical facts may remain useful if clearly marked as historical.

For example, “deploy on Fridays” can be a team convention until a later approved policy changes it. Preserve the old policy for questions about past decisions, while current operational advice uses the replacement.

Use explicit deletion semantics. Removing a memory item may also require invalidating its vectors, graph claims, summaries, and cached answers. Original conversations, traces, and backups have separate retention policies; deleting one derived view does not erase all copies.

[Cognee's forget operation](https://docs.cognee.ai/core-concepts/main-operations/forget) provides item and dataset deletion mechanisms. An application must still define which items fall within a user's deletion request and verify downstream removal.

Keep tombstones or revision guards long enough to stop delayed ingestion from resurrecting deleted information. For corrections, retain enough audit data to explain what changed without continuing to expose restricted content.

Measure lifecycle behavior directly: corrected preferences should take effect, expired facts should stop influencing answers, and denied scopes should remain inaccessible after caches warm.
