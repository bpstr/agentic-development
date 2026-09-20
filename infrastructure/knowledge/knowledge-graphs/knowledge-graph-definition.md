# Knowledge graphs

A knowledge graph represents entities and their relationships in a structured form. Nodes identify things such as services, tasks, people, or concepts; edges express relations such as “depends on” or “authored.” Properties can record names, dates, types, and supporting evidence.

RDF expresses statements as subject-predicate-object triples; property graphs commonly attach properties to nodes and edges. These models differ in schema and query conventions. The [RDF concepts specification](https://www.w3.org/TR/rdf11-concepts/) defines RDF's abstract graph model.

Distinguish authoritative relationships from extracted claims. A task's current project ID comes from the application database. A sentence saying that a service caused an incident is a claim from a particular report. Both can appear in a graph, but should have different provenance and validity information.

For example, `APP-42 → blocks → R7` is useful only when the identifiers are resolved correctly and the relationship's source and date are known. A graph with merged identities can create convincing but false paths.

A graph database stores and queries relationships. Graph-based RAG uses relationships to select evidence for generation. Neither follows automatically from the other. Existing SQL joins may already answer structured dependency questions; generated graphs are most useful when they connect information that is scattered through less structured sources.
