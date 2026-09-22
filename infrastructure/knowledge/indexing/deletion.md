# Deletion from knowledge systems

Deleting source information requires removing or invalidating its derived representations. A searchable knowledge system may hold raw files, parsed text, chunks, embeddings, graph claims, community summaries, and cached answers.

Maintain source lineage so deletion can identify all affected artifacts. If a graph relationship has several independent supporting sources, removing one source may remove only that support. If no permitted support remains, the relation should not continue to appear as established knowledge.

A practical deletion process revokes retrieval access immediately, records a tombstone, removes dependent artifacts, and verifies that the source no longer appears through any query path. Tombstones or revision guards stop delayed workers from restoring the deleted content.

[Cognee's forget API](https://docs.cognee.ai/core-concepts/main-operations/forget) illustrates item and dataset deletion. Its operations do not define an application's complete retention policy for transcripts, external sources, logs, or backups.

Separate user-visible deletion from physical reclamation and backup expiration. The system should know when content became inaccessible and which background cleanup remains incomplete.

Test direct lookup, semantic search, graph traversal, generated summaries, and warm caches after deletion. A successful delete response from one database proves only that operation. It does not demonstrate that every derivative has disappeared or that a restored backup will preserve the deletion decision.

## A graph-specific deletion check

In the [R7 fixture](../graphrag/graphrag-definition.md#a-shared-synthetic-release-example), delete DOC-7:r2 and ask both for its title directly and for rollback documents connected through APP-42. Inspect graph descriptions and community reports as well as source chunks. A summary can retain the deleted procedure even after its citation disappears.

If another independent permitted source supports the same service relationship, retain only that surviving support. Do not keep a passage copied from DOC-7 merely because its neighboring entity still exists. Track reverse dependencies through extraction and summarization, and quarantine affected reports until safe regeneration finishes.

Repeat the test while an old source-ingestion job is still queued and after restoring a backup. The deletion generation or tombstone must win over the old job. The [GraphRAG evidence test](../../../operations/evaluation/graphrag-evaluation.md#a-deterministic-evidence-gate) provides a small deterministic support check; it does not replace adapter-specific cleanup verification. In particular, [Cognee production integration](../graphrag/integrations/cognee-production-integration.md) explains why untracked custom-pipeline nodes require separate verification.
