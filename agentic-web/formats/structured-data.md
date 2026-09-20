# Structured web data

Structured web data expresses entities, properties, relationships, and actions alongside or instead of rendered content. [JSON-LD](https://www.w3.org/TR/json-ld11/) provides a JSON representation of linked data; vocabularies such as [Schema.org](https://schema.org/TechArticle) define shared terms. A vocabulary and an encoding serve different purposes.

This example identifies a technical article independently of its page layout:

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": "https://example.org/docs/task-api#article",
  "url": "https://example.org/docs/task-api",
  "headline": "Task API reference",
  "description": "Creating tasks and updating their status."
}
```

The context maps terms to their vocabulary meanings, the type identifies the kind of entity, and the identifier allows other records to refer to it. An agent can use this information to distinguish an article from the product or organization it describes.

Structured data reduces discovery ambiguity but does not prove that a claim is true. A listed price may be stale, and a described action may lack an executable endpoint. Before changing transactional state, query the authoritative service and apply its authorization rules.

Keep identifiers stable and update structured data with the visible content. Schema validation can detect malformed fields; it cannot establish that the declared entity matches reality or that a linked resource is trustworthy.
