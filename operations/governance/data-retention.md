# Data retention

Data-retention policy defines how long information is kept, why it is needed, and how it is removed. Agent systems apply this policy to prompts, outputs, tool results, files, traces, memories, indexes, and generated artifacts, often across several services.

Classify data by purpose and ownership instead of assigning every copy the conversation's lifetime. A short-lived tool result, a durable published document, and a diagnostic trace can need different retention periods. Record source identifiers and lineage so derived representations can be located when their source is removed.

Deletion must account for secondary copies. Removing a document from the primary database can leave chunks in vector search, facts in a knowledge graph, cached tool responses, or references in conversation summaries. A deletion workflow should invalidate these copies and track completion across stores. Backup expiry and restoration procedures also matter: restoring an old backup should not silently reactivate previously deleted content.

For externally managed services, establish the retention and deletion behavior of the configured product and account. Deleting a local reference does not prove that the provider removed its copy.

Retention should preserve the evidence the application needs while avoiding indefinite accumulation by default. Test both ordinary expiry and explicit deletion, including whether removed information can still be retrieved or regenerated from a derived store.
