# Entity extraction

Entity extraction identifies references to people, organizations, systems, events, or domain-specific objects in source material. **Named entity recognition** finds mentions and types; **entity linking** resolves those mentions to stable identities. Recognizing “Billing” is not enough to know which team's Billing service it denotes.

A useful extracted mention retains its exact source span, proposed type, canonical ID if resolved, and extraction version. Keep unresolved mentions separate rather than forcing an uncertain match.

```json
{
  "mention": "Billing",
  "entity_type": "service",
  "candidate_id": "service-billing-eu",
  "source_id": "incident-17",
  "source_revision": "3"
}
```

This illustrative record proposes an identity; application validation determines whether to accept it.

Use known application identifiers and controlled vocabularies where available. A model can propose a mapping, while deterministic checks confirm that the entity exists within the correct workspace. Disambiguation needs context such as project, organization, aliases, and time.

Microsoft GraphRAG's [indexing dataflow](https://microsoft.github.io/graphrag/index/default_dataflow/) includes entity and relationship extraction. Extraction quality affects everything downstream: duplicate nodes fragment evidence, while incorrectly merged nodes create false connections.

Evaluate mention detection and identity resolution separately. Include renamed services, duplicate personal names, acronyms, and entities that should remain unresolved. A high-confidence model output is still a prediction, not a source-issued identifier.
