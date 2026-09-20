# Incremental indexing

Incremental indexing updates only sources or derived artifacts affected by a change. It reduces repeated work while preserving consistency between an external system and its searchable representations.

Use stable source IDs and ordered revisions. A practical update flow reads the authoritative source, compares its revision or hash, rebuilds affected representations, publishes the completed generation, and retires obsolete artifacts.

```text
receive source ID and revision
reject older revisions
read content and access policy
build replacement generation
publish replacement
retire superseded artifacts
```

This is conceptual pseudocode. Publication needs an application-specific transaction, generation pointer, or equivalent consistency mechanism.

Retries should be idempotent. Duplicate events must not create duplicate chunks or graph claims. A delayed event for revision 8 must not overwrite revision 9. Periodic reconciliation detects missed events and drift that event delivery alone cannot prevent.

[LlamaIndex document management](https://developers.llamaindex.ai/python/framework/module_guides/loading/ingestion_pipeline/#document-management) uses document identifiers and hashes to support update decisions. The surrounding application still owns source ordering and deletion propagation.

A graph update can affect more than the changed passage: resolved entities, connected claims, community membership, and generated reports may need recomputation. Track dependencies so invalidation is targeted and complete.

Measure backlog age and failed revisions, not just jobs per second. An efficient worker can still serve stale results if a small number of repeatedly failing sources never catch up.
