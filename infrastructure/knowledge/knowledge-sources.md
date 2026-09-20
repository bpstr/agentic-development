# Knowledge sources

A knowledge source is an identifiable origin of information: a document, repository revision, database record, conversation, or external service. A connector accesses that source; a parser turns its content into usable structure; an index stores derived representations.

Preserve the source's identity before transforming it. A document title can change, a URL can redirect, and the same content can appear in several exports. Prefer the origin system's stable identifier together with a revision or content hash.

```json
{
  "source_system": "project-api",
  "source_id": "runbook-billing",
  "revision": "12",
  "workspace_id": "workspace-7",
  "location": "Rollback procedure",
  "updated_at": "2026-09-19T14:00:00Z"
}
```

This is an application example, not a provider schema. Add an authorization reference and canonical URL in the application that owns the source.

Distinguish authored sources from derived ones. An approved runbook, a meeting transcript, and a generated summary have different evidential roles. Reindexing the summary does not make it more authoritative than its inputs.

LlamaIndex's [Documents and Nodes](https://developers.llamaindex.ai/python/framework/module_guides/loading/documents_and_nodes/) illustrates source containers and derived retrieval units. Regardless of library, retain enough lineage to update permissions, replace revisions, and remove every derived artifact when its source is deleted.
