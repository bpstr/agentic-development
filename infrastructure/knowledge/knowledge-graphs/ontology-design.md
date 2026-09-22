# Ontology design for knowledge retrieval

An ontology defines the kinds of things and relationships a knowledge system represents and the meaning attached to them. In a retrieval application, the practical starting point is a small set of questions and the distinctions needed to answer them correctly, not an attempt to model the entire organization.

An RDF ontology and a property-graph schema are different implementation surfaces. The [W3C OWL overview](https://www.w3.org/TR/owl2-overview/) describes a formal ontology language; [SHACL](https://www.w3.org/TR/shacl/) defines constraints for validating RDF graphs. A property-graph application can adopt the same discipline of explicit types and validation without claiming it implements OWL inference or SHACL.

## Design from competency questions

Use the [synthetic R7 corpus](../graphrag/graphrag-definition.md#a-shared-synthetic-release-example). To answer “Which runbook helps with a service affected by this blocking task?”, the schema needs a task identity, a release identity, a service identity, documents with revisions, and precise relationships:

```text
Task --BLOCKS--> Release
Task --AFFECTS--> Service
DocumentRevision --DOCUMENTS--> Service
Incident --INVOLVES--> Service
Claim --SUPPORTED_BY--> SourceSpan
```

This is an illustrative schema, not a library-specific DSL. Direction carries meaning: APP-42 blocks R7, not the reverse. An inverse edge can aid queries, but it must be mechanically consistent with the original fact. `RELATED_TO` can support discovery, but usually cannot answer a specific dependency question.

Decide whether each relation comes from an application record, curated mapping, extracted text, or co-occurrence. Preserve that distinction in the data. Do not let a model overwrite an authoritative dependency with a plausible but unsupported edge.

## Identity is not a display name

Use stable source-issued IDs where available. Namespace identities by the domain in which they are unique: workspace plus task ID, or repository plus symbol identity. Store labels and aliases separately. Billing in project A and Billing in project B may be different services; a renamed service may retain the same identity.

[Entity extraction](entity-extraction.md) identifies mentions; entity linking resolves them. Keep unresolved mentions and candidate mappings when disambiguation is uncertain. A mistaken merge creates false paths across many downstream queries, while duplicate identities fragment evidence. Both need dedicated fixtures.

For code, paths alone are mutable. Preserve repository and revision, qualified symbol identity where available, and the parser or extractor version. A comment mentioning a function does not prove a call edge; [code graphs](../../../development/code-intelligence/code-graphs.md) distinguish structural observations from inferred descriptions.

## Model claims and their support

A bare triple cannot capture every qualification. A claim may need source revision, exact span, valid time, extraction method, confidence, and review state. Represent these as edge properties or as a claim object linked to subject, predicate, object, and supporting spans. Choose a representation that supports deletion and conflicting evidence without losing provenance.

The [W3C PROV primer](https://www.w3.org/TR/prov-primer/) distinguishes data entities, the activities producing them, and responsible agents. That is useful for tracing a graph claim through parsing and extraction to a particular source revision. Provenance identifies origin; it does not prove the claim is correct.

For example, two documents independently supporting the same dependency should produce one queryable relationship with two support records, not two indistinguishable duplicates. Removing one document should remove that support without erasing the still-supported relationship. Conversely, repeated copies of one document should not be counted as independent corroboration.

## Validate at the write boundary

Validate endpoint types, required identities, allowed predicates, direction, source existence, and scope. Treat schema violations as inspectable rejected records, not silently discarded material. Count rejected and unresolved records so a successful ingestion does not conceal missing knowledge.

A closed extraction schema trades coverage for predictable types; an open schema discovers new concepts but can produce synonymous or noisy predicates. A useful design starts with a controlled core and a reviewable extension path. LlamaIndex's [schema-constrained and dynamic property-graph extractors](https://developers.llamaindex.ai/python/framework/module_guides/indexing/lpg_index_guide/) illustrate these alternatives.

Distinguish schema validity from business truth. A well-typed `Task BLOCKS Release` edge may still be false, unauthorized, or stale. Validate source support, permissions, and [temporal validity](temporal-knowledge-graphs.md) separately.

## Evolve without silently changing meaning

Version extraction prompts, schema, normalization rules, and identity-resolution policies. A renamed predicate can be migrated mechanically; changing `MENTIONS` into `AFFECTS` changes semantics and usually requires re-extraction or review. Do not migrate only the label.

Before publishing a new graph revision, compare rejected records, entity merges/splits, orphaned support links, and answers to the competency questions. Keep migrations reversible through retained source data and explicit old-to-new identities. The graph is a derived retrieval representation; it must not become the only surviving copy of the evidence it interprets.
