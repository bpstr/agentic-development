# Deletion from knowledge systems

Deleting source information requires removing or invalidating its derived representations. A searchable knowledge system may hold raw files, parsed text, chunks, embeddings, graph claims, community summaries, and cached answers.

Maintain source lineage so deletion can identify all affected artifacts. If a graph relationship has several independent supporting sources, removing one source may remove only that support. If no permitted support remains, the relation should not continue to appear as established knowledge.

A practical deletion process revokes retrieval access immediately, records a tombstone, removes dependent artifacts, and verifies that the source no longer appears through any query path. Tombstones or revision guards stop delayed workers from restoring the deleted content.

[Cognee's forget API](https://docs.cognee.ai/core-concepts/main-operations/forget) illustrates item and dataset deletion. Its operations do not define an application's complete retention policy for transcripts, external sources, logs, or backups.

Separate user-visible deletion from physical reclamation and backup expiration. The system should know when content became inaccessible and which background cleanup remains incomplete.

Test direct lookup, semantic search, graph traversal, generated summaries, and warm caches after deletion. A successful delete response from one database proves only that operation. It does not demonstrate that every derivative has disappeared or that a restored backup will preserve the deletion decision.
