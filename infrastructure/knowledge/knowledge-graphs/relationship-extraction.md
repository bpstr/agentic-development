# Relationship extraction

Relationship extraction identifies connections asserted between entities in a source. Examples include a service depending on a database, a decision superseding an earlier decision, or an incident affecting a release.

Specify relation direction, allowed entity types, time, and evidential status. “A depends on B” is not interchangeable with “B depends on A.” “A may affect B” must not become an unconditional `affects` edge. Negation and attribution also matter: a report can state that someone rejected a proposed cause.

An application-owned relation record might contain subject ID, predicate, object ID, source revision, supporting span, validity period, and extraction version. Keep multiple supporting sources without treating repeated copies as independent confirmation.

The [GraphRAG indexing dataflow](https://microsoft.github.io/graphrag/index/default_dataflow/) shows how extracted relationships contribute to graph construction. They remain derived claims unless checked against an authoritative system.

For a release investigation, an extracted connection between a migration and an incident can suggest evidence to inspect. It cannot establish that the migration is currently blocking the release. Read the present dependency record for that conclusion.

Measure direction errors, unsupported edges, missed relations, and entity-linking failures. On source updates, invalidate or recompute affected claims. Deleting a passage while retaining its extracted edges can preserve both stale conclusions and information the source owner intended to remove.
