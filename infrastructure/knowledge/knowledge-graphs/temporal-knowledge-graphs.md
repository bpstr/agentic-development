# Temporal knowledge graphs

A temporal knowledge graph represents not only entities and relationships but when claims apply and when the system learned or changed them. This prevents historical facts from being retrieved as current state and allows questions about changing relationships.

Temporal representations differ across databases and frameworks. [Graphiti](https://github.com/getzep/graphiti) is one implementation using temporal information in an agent-memory graph. Application semantics still determine what an event means, which clock matters, and how conflicting sources should be handled.

## Separate two clocks

**Valid time** describes when a claim applies in the modeled world. **Recorded time** describes when the system stored or accepted that claim. A decision effective September 10 might not be ingested until September 12.

Two questions therefore differ: “Who owned APP-42 on September 11, according to the evidence we have now?” and “Who did our system believe owned APP-42 when asked on September 11?” The first uses valid time; the second also needs a historical recorded-time view.

The following is an application-owned illustrative record, not a Graphiti API object:

```json
{
  "claim_id": "ownership-app42-blue",
  "subject_id": "W:A:APP-42",
  "predicate": "OWNED_BY",
  "object_id": "team-blue",
  "valid_from": "2026-09-10T00:00:00Z",
  "valid_to": null,
  "recorded_at": "2026-09-12T09:00:00Z",
  "supersedes_claim_id": "ownership-app42-amber",
  "source_id": "DEC-2",
  "source_revision": "2",
  "source_locator": "ownership"
}
```

Define interval conventions explicitly. A half-open interval `[valid_from, valid_to)` makes the ending instant belong to the next state, avoiding two owners solely because boundaries overlap. A missing boundary can mean unbounded or unknown; represent uncertainty separately when the distinction matters.

## A changed fact is not necessarily a contradiction

Amber owning the task before September 10 and Blue owning it afterward are compatible claims. Two sources assigning different exclusive owners during the same interval conflict. Whether ownership is exclusive is itself a domain constraint; a task might legitimately have several contributors.

Retain source authority and evidence instead of resolving every conflict by recency or model confidence. A recently copied obsolete document should not replace an authoritative current decision. Source revision order, effective dates, and ingestion order are separate signals.

For “What currently blocks R7?”, the owning application's current dependency records remain preferable to an asynchronously maintained historical graph. Use the graph for explanatory or historical evidence, or expose its synchronization lag explicitly.

## Retrieve a temporally coherent path

A multi-hop path is not valid merely because each edge was true at some time. For a point-in-time query, every required edge must be valid at that instant. For an interval query, define whether simultaneous validity or any occurrence is required.

Suppose a task affected Billing until September 8, while an incident involved Billing on September 11. The graph contains both links, but they do not establish that the incident affected that task during the same period. A path assembled without temporal checks can manufacture a relationship that never existed.

Record the query's as-of time and the published graph revision. A cached answer must not ignore those dimensions. Community reports also need temporal scope; a report mixing several months cannot be silently presented as a current-state summary.

## Process late events and retractions

Ingestion should carry source identity, source revision or ordered event sequence, operation, and effective time where known. Deduplicate repeated events. Do not let a delayed older event overwrite a newer published revision. Preserve a gap or uncertain interval when the source does not provide enough information to reconstruct history.

A retraction differs from a change in the world. Correcting a false statement may invalidate its historical support, while ending a true relationship preserves its past validity. Likewise, deletion for retention or privacy is not a factual claim that the relationship never existed. Apply [deletion policy](../indexing/deletion.md) to retained evidence, derived claims, summaries, and caches without inventing history.

The [PROV data model](https://www.w3.org/TR/prov-dm/) provides concepts for derivation, generation, and invalidation. A retrieval application should map those concepts to its own source and publication lifecycle rather than assume timestamps alone implement a complete bitemporal system.

## Verification cases

Use the [R7 synthetic corpus](../graphrag/graphrag-definition.md#a-shared-synthetic-release-example) to check ownership immediately before and at the September 10 boundary. Repeat with the update ingested late. Ask both world-as-of and system-belief-as-of questions and state when the backend cannot supply one of them.

Also test contradictory overlapping intervals, nonexclusive relationships, missing effective times, out-of-order updates, correction of an invalid extraction, permission revocation, and deletion of supporting evidence. A temporal framework's invalidation feature does not by itself prove historical completeness or permission-safe time travel.
