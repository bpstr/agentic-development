# Integrating GraphRAG into an application

Graph-aware retrieval should be a derived evidence service, not a replacement for the system that owns business records. Keep ingestion, retrieval, and accepted application mutations separate. The [GraphRAG definition](../graphrag-definition.md) explains workload selection; this guide specifies an application boundary that can accommodate different providers.

## Separate write and read paths

```text
Source application → durable change log/outbox → indexing workers
          │                                  → source/graph/vector artifacts
          │                                  → validated published revision
          ↓
Authorized request → current-record lookup + retrieval adapter
                   → source-backed evidence → suggestions or grounded answer
```

The outbox, revision model, and evidence adapter are proposed application architecture, not features implied by every GraphRAG SDK. The [Microsoft indexing dataflow](https://microsoft.github.io/graphrag/index/default_dataflow/) and [Cognee architecture](https://docs.cognee.ai/core-concepts/architecture) illustrate derived artifacts with different lifecycles. A provider operation does not automatically define an atomic publication transaction across your application and its indices.

Ingest after a source revision is saved. For an actively edited description, coalesce pending changes by source and revision instead of indexing every keystroke. Keep the latest desired revision separate from the last successfully published revision. A source receipt is not proof that graph extraction, embeddings, and source retrieval all completed.

Use bounded worker concurrency and per-tenant budgets. Retry transient provider errors with a limited policy; quarantine repeatedly failing inputs with an inspectable reason. Parser failure and unsupported modality must not look like a successfully indexed empty document.

## Define an evidence-oriented contract

This TypeScript is an application-owned contract, not a native response object from any provider:

```typescript
export type EvidenceStatus = "ready" | "partial" | "unavailable";

export interface SourceEvidence {
  sourceId: string;
  sourceRevision: string;
  locator: string;
  text: string;
  origin: "source" | "derived";
  supportingSources: Array<{
    sourceId: string;
    sourceRevision: string;
    locator: string;
  }>;
  path?: Array<{
    subjectId: string;
    predicate: string;
    objectId: string;
    supportKeys: string[];
  }>;
  ranking?: {
    method: string;
    value: number;
    direction: "higher-is-better" | "lower-is-better";
  };
  validFrom?: string;
  validTo?: string;
}

export interface RetrievalResult {
  requestRevision: string;
  publishedIndexRevision: string;
  authorizationRevision: string;
  status: EvidenceStatus;
  evidence: SourceEvidence[];
  warnings: string[];
}
```

Do not fill required provenance fields with guessed values. An adapter may reject an uncitable result, return it as explicitly derived context, or expose a separate unresolved-result type. An empty evidence array with `ready` can represent no matches; `unavailable` represents a failed service. The UI should not conflate them.

Keep the authorization revision opaque. Do not expose restricted dataset names merely to explain why a result was filtered. Authorization is enforced before evidence enters the caller's response, reranker, model, or externally accessible trace.

## Make updates and deletion ordered

An idempotency key can include workspace, source ID, source revision, and pipeline version. Store event sequence or source revision semantics rather than assuming ingestion timestamps establish order. Before publishing a job, compare its source revision and deletion generation with the current desired state. A slow job for revision 2 must not overwrite revision 3 or resurrect a deleted source.

Track reverse dependencies from source revision to chunks, claims, entity descriptions, reports, and caches. When a source is revoked, quarantine affected artifacts before asynchronous reconstruction if they could disclose restricted data. Delete only unsupported claims when another authorized independent source still supports the relationship. Preserve provenance for that distinction.

For a graph/model migration, build a separate candidate revision, run representative retrieval checks, and switch the published revision deliberately. Do not change the query embedding model while continuing to query vectors created in an incompatible space.

## Integrate task-document suggestions

Begin with the task's explicit identifiers, project, description, and accepted relations. Resolve current dependencies through the owning application. Retrieve authorized document candidates using complementary lexical/vector routes, then expand selected supported graph paths within a budget.

A related task's document is a candidate, not automatically a relevant result. Require a passage explaining something applicable to the current task. Broaden to other readable projects or workspace documents when the evidence warrants it, never to inaccessible scopes. Graph proximity is a retrieval signal, not a permission grant or relevance guarantee.

Return source identity, revision, a precise passage, and a supported reason such as “DOC-7 describes rollback for billing-eu, which APP-42 affects.” Make user acceptance an explicit application write. Record rejection against task and source revisions so unchanged suggestions do not reappear after every refresh. Reconsider when material context or source evidence changes.

Send the saved task revision with the request. The frontend ignores a response for an older description revision and can cancel superseded requests. Client abort does not prove server cancellation; workers and expensive retrieval need their own deadlines and cancellation checks. A quick baseline can appear before a slower graph-enhanced result, but label partial status and avoid overwriting a newer result with an older one.

## Choose the integration surface

An in-process SDK suits a service written in the implementation's language and exposes custom pipelines directly. A private HTTP service separates Python indexing from a TypeScript or Go application and centralizes authentication, budgets, and upgrades. An agent/MCP tool adds model-mediated discovery and invocation, but deterministic task-page suggestions need not pass through an agent loop.

Keep retrieval tools read-only. A separate mutation tool handles confirmed business changes with its own authorization and idempotency. Generated Cypher/GQL requires constrained schemas, read-only credentials, allowed query shapes, timeouts, and result limits. Parameterized templates are easier to bound for recurring product queries. The [Neo4j retriever documentation](https://neo4j.com/docs/neo4j-graphrag-python/current/user_guide_rag.html) illustrates the distinction between retrieval queries and model-generated graph queries.

## Operate and verify the boundary

Cache by normalized query, principal/scope policy revision, source/index revision, as-of time, retrieval configuration, and embedding model. A user ID alone does not capture changed permissions. Keep cache TTL as a fallback freshness bound, not the only revocation mechanism.

Trace source receipt, processing, publication, candidate retrieval, graph expansion, context assembly, and answer generation separately. Measure time to useful suggestion and indexing lag, not just model time to first token. Attribute cost by stage and tenant; enforce a total request budget rather than granting each retry a fresh unlimited allowance.

Use the [graph evaluation guide](../../../../operations/evaluation/graphrag-evaluation.md) to test current lookup, multi-hop evidence, no-answer, permissions, late events, deletion, and degraded retrieval. Keep the provider adapter contract stable while upgrading its implementation, and preserve raw diagnostic payloads only in access-controlled storage with an appropriate retention policy.
