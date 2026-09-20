# Citations and provenance

A citation points the reader to supporting evidence. Provenance records where information came from and how it was transformed. A clickable link provides navigation; it is not, by itself, proof that the linked source supports the associated claim.

Track a chain from answer claim to retrieved chunk, source revision, and original location. For generated graph relationships or summaries, retain the intermediate extraction or summarization step as well. The [W3C PROV data model](https://www.w3.org/TR/prov-dm/) describes entities, activities, and agents as components of provenance.

```json
{
  "citation_id": "evidence-3",
  "source_id": "runbook-billing",
  "revision": "12",
  "location": "Rollback procedure",
  "derived_from": ["runbook-billing:r12:section-4"]
}
```

This is an illustrative application record. The answer model can emit `evidence-3`; the application resolves its display title and permitted URL.

Preserve the cited revision when an answer must remain auditable. A link to a live document may later display different text. Recheck current access when a user opens it, and decide how to display removed or unavailable sources.

Evaluate support at claim level. A paragraph can contain one supported sentence and another unsupported inference while carrying a single citation. Generated summaries should expose their underlying sources so users can inspect the evidence beyond the summary itself.
