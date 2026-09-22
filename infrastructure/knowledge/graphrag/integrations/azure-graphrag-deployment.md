# Deploying GraphRAG on Azure

Official resources: [Azure AI Search RAG](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview), [Agentic retrieval](https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview), [HorizonDB graph-augmented RAG](https://learn.microsoft.com/en-us/azure/horizondb/ai/graph-rag), [CosmosAIGraph](https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/cosmos-ai-graph), [Microsoft GraphRAG](https://github.com/microsoft/graphrag).

Azure supplies several components and implementation routes, not one interchangeable GraphRAG service. Choose the graph representation and retrieval mechanism first, then map their requirements to managed services. The service boundary determines which updates, permissions, and operational tasks remain yours.

## Distinguish the deployment routes

| Route | Provider-supplied capabilities | Application-owned work |
| --- | --- | --- |
| Self-managed GraphRAG framework on Azure compute | Compute, storage, networking, identity, and configured model endpoints | Framework lifecycle, extraction, graph/index publication, query routing, permissions, upgrades |
| HorizonDB graph-first retrieval | PostgreSQL-compatible storage with documented AGE/vector/AI-function integration; graph route is Preview | Schema, graph construction, source synchronization, bounded queries, evidence and answer policy |
| CosmosAIGraph solution | A documented solution using Cosmos DB for NoSQL document/vector storage and graph-oriented retrieval | Adopt and operate the solution code, model relationships, partition/scope data, validate synchronization |
| Azure AI Search / Foundry IQ | Managed search and knowledge-source retrieval; feature availability depends on API and capability | Graph construction/traversal when required, application source authority, extra permission rules and mutations |

The [Cosmos DB documentation](https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/cosmos-ai-graph) labels CosmosAIGraph as a NoSQL solution and describes routing among database, vector, and graph retrieval. Do not substitute the Gremlin API or assume every Cosmos DB API has the same vector and graph behavior. A solution repository is also not the same support contract as a managed database service.

The [Microsoft GraphRAG repository](https://github.com/microsoft/graphrag) is largely in maintenance mode and is not an officially supported Microsoft offering. The [Azure-Samples accelerator](https://github.com/Azure-Samples/graphrag-accelerator) was archived on May 27, 2025. Use it to understand historical deployment choices, not as an actively maintained one-click production baseline.

## A self-managed application layout

This is a proposed deployment decomposition, not a claim that every box is provisioned by a GraphRAG package:

```text
Application source + outbox
    → queue / durable job record
    → indexing worker on controlled Azure compute
    → original source storage + metadata + graph/vector artifacts
    → validated published index revision

Authenticated application request
    → authorization + current-record lookup
    → read-only graph/search retrieval
    → source-backed context
    → configured model endpoint or evidence-only suggestions
```

Use separate ingestion and serving workers when extraction load would contend with interactive queries. A long-running corpus build needs resumable state and bounded batches, not a synchronous HTTP request held open indefinitely. Store per-source outcomes and retry only the failed revision. Keep an application-controlled published revision so a partly rebuilt corpus does not masquerade as current.

For a Microsoft implementation, follow the [framework setup](../frameworks/microsoft-graphrag.md) and select Azure-compatible chat and embedding providers in the generated configuration. Verify the endpoint, deployment name, authentication method, and API version for the selected package release. A deployment name is not necessarily the public model identifier. Do not paste obsolete model defaults or an old accelerator's settings into a newer configuration schema.

The framework's smallest configured indexing/query lifecycle remains:

```bash
graphrag index --dry-run
graphrag index --method standard
graphrag query "Which incidents involved services blocking R7?" --method local
```

These commands assume the initialized project, input files, and working model configuration described in the framework guide. They do not create Azure resources. Dry-run configuration validation is not proof of model access, a completed ingestion, or a cost forecast.

For a database-first demonstration, use the [HorizonDB ingestion and query example](../platforms/azure-horizondb-graphrag.md). For a managed passage-retrieval baseline, use the [Azure AI Search REST example](../../retrieval/platforms/azure-ai-search.md). Compare both against the same R7 evidence requirements before adding extra agent planning.

## Identity and networking

Give an indexing identity only the source read and index write permissions it needs; give serving a separate read identity. Use supported managed identity or workload identity integration where available instead of long-lived credentials in application code. Store unavoidable secrets outside the repository and browser, rotate them, and redact them from traces.

[Azure AI Search roles](https://learn.microsoft.com/en-us/azure/search/search-security-rbac) distinguish object administration, content writes, and content reads. A subscription-level Owner role is not by itself the documented role-based content-access path. Conversely, administrators that can retrieve service keys may have a much broader effective boundary than a query-only identity.

Private networking and authenticated ingress reduce exposure but do not implement document-level permissions. Propagate the caller's permitted scope into graph traversal, passage retrieval, reranking, and answer generation. Review source connectors individually: synchronized ACLs, query-time delegated identity, and application security filters have different behavior.

Do not send an inaccessible source to a model and rely on output filtering to hide it. Graph summaries, cached answers, and relationship names are derived sensitive data too. Test a project-A-only principal against the restricted project-B Billing service in the [shared fixture](../graphrag-definition.md#a-shared-synthetic-release-example).

## Availability, cost, and release checks

Record the exact service region, tier/edition, model deployment, package version, and API version. A generally available service can contain preview-only features; a portal-created object can use a preview schema even when a production API also exists. The [Search guide](../../retrieval/platforms/azure-ai-search.md) preserves that distinction for agentic retrieval.

Model costs separately: parsing/extraction, embeddings, graph processing, reports, retrieval/reranking, query planning, answer generation, retries, and rebuilds. Then add database capacity, storage, worker compute, network traffic, and observability. Do not infer a universal monthly cost from a small notebook's token bill.

Before rollout, verify ingestion after restart, partial failure, source update, permission revocation, deletion, restored backups, and index migration. Inspect poison-message queues and enforce a maximum attempt budget. A tombstone must stop an old queued job from reintroducing deleted content. Measure time until a saved source becomes searchable and p95 evidence retrieval separately from answer completion.

Keep cleanup scoped to a disposable demonstration resource group or explicitly named test objects. Do not copy a sample's delete-all initialization into a shared environment. Managed database availability does not remove the need to verify source provenance and application-level recovery.
