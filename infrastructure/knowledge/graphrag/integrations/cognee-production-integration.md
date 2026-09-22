# Cognee production integration

Official resources: [Permissions setup](https://docs.cognee.ai/setup-configuration/permissions), [HTTP API](https://docs.cognee.ai/api-reference/introduction), [Relational storage](https://docs.cognee.ai/setup-configuration/relational-databases), [Vector storage](https://docs.cognee.ai/setup-configuration/vector-stores), [Graph storage](https://docs.cognee.ai/setup-configuration/graph-stores), [Repository](https://github.com/topoteretes/cognee).

This guide connects a shared application to Cognee without treating the private [local demonstration](../frameworks/cognee-basic-setup.md) as a production configuration. The Python quick start is pinned to 1.6.0; the HTTP examples below follow the documented v1 routes reviewed on September 22, 2026. Match those routes to the OpenAPI schema of the server you actually deploy.

## Select compatible storage and isolation

Relational metadata, vectors, and graph state are distinct configuration layers. PostgreSQL metadata plus pgvector does not imply a production-grade PostgreSQL graph adapter or a single atomic transaction across all operations.

| Choice | Boundary to verify |
| --- | --- |
| PostgreSQL metadata and pgvector | Install the supported PostgreSQL extra, enable the vector extension, configure credentials and TLS, and preserve embedding compatibility |
| Embedded Ladybug/Kuzu graph | File locking, process ownership, memory sizing, persistent volumes, and dataset-handler compatibility |
| Neo4j graph | A configured shared server is not automatically a per-dataset isolation strategy; select a compatible handler and deployment model |
| Open PostgreSQL graph adapter | Current documentation calls `postgres_demo` a demo; `postgres` is an alias. Raw Cypher modes are unsupported. A separately licensed adapter is a different offering |
| Cognee Cloud | Use the tenant's documented API URL and authentication, and verify hosted limits rather than assuming self-hosted configuration parity |

For the documented Neo4j handlers, per-dataset isolation can mean provisioning a dedicated Aura instance or a Community Docker container. That has operational, credential, and cost consequences; it is not merely tagging nodes. Do not enable a handler that provisions infrastructure until its lifecycle and privileges are understood.

Set both access controls explicitly for an authenticated service:

```dotenv
ENABLE_BACKEND_ACCESS_CONTROL=true
REQUIRE_AUTHENTICATION=true
```

These two settings alone are not a complete deployment. Configure compatible graph and vector dataset handlers, create principals and grants, and test the active tenant and dataset routing. Node sets are organizational tags, not project ACLs. When private projects share a dataset, enforce the additional application permission boundary or choose a different dataset partitioning.

[Dataset permissions](https://docs.cognee.ai/core-concepts/multi-user-mode/permissions-system/overview) distinguish read, write, delete, and share capabilities. Grant only what each worker or query principal needs. Do not pass a browser-selected dataset UUID directly into a privileged backend call without authorizing it.

## Ingest and retrieve over HTTP

Prerequisites are an authenticated, configured server with working extraction/embedding providers, a real access token, and a UTF-8 `runbook.txt`. Set `COGNEE_BASE_URL` to the deployed server's origin without a trailing slash and `COGNEE_TOKEN` to a valid bearer token for this self-hosted API example. Do not copy Cloud API-key authentication blindly into this bearer-token flow.

The documented [remember route](https://docs.cognee.ai/api-reference/remember/remember:-ingest-data-and-build-the-knowledge-graph-add-%2B-cognify-%2B-improve) accepts multipart file uploads. Let curl create the multipart boundary:

```bash
: "${COGNEE_BASE_URL:?Set the authenticated server origin}"
: "${COGNEE_TOKEN:?Set a valid bearer token}"
test -f runbook.txt || exit 1

curl --fail-with-body --request POST \
  "$COGNEE_BASE_URL/api/v1/remember" \
  --header "Authorization: Bearer $COGNEE_TOKEN" \
  --form "data.items=@runbook.txt;type=text/plain" \
  --form-string "datasetName=demo-runbooks-http" \
  --form-string "run_in_background=false" \
  --form-string "self_improvement=false"
```

Inspect the returned processing status before querying. This executes real ingestion on the configured server and may incur provider costs. In application code, persist provider data IDs and source revisions rather than relying only on the uploaded filename.

The [recall route](https://docs.cognee.ai/api-reference/recall/recall:-query-memory-with-auto-routed-search-type-and-session-first-lookup) uses HTTP field names, not Python keyword names:

```bash
curl --fail-with-body --request POST \
  "$COGNEE_BASE_URL/api/v1/recall" \
  --header "Authorization: Bearer $COGNEE_TOKEN" \
  --header "Content-Type: application/json" \
  --header "Accept: application/json" \
  --data '{
    "query": "What must happen before restoring the snapshot?",
    "searchType": "CHUNKS",
    "datasets": ["demo-runbooks-http"],
    "topK": 5
  }'
```

For shared datasets, use `datasetIds` resolved and authorized server-side. Python instead uses `query_text`, `query_type`, `dataset_ids`, and `top_k`. Treat HTTP/Python field-name mismatches as integration errors, not reasons to fall back to an unscoped search.

The application adapter should inspect the result kind and available references, resolve source revisions, and return the [evidence contract](graphrag-application-integration.md#define-an-evidence-oriented-contract). Do not assume a completion result is a source document or a backend distance is confidence.

## Separate documented behavior from application guarantees

| Concern | Implementation behavior or limit | Application responsibility |
| --- | --- | --- |
| Processing | Foreground and background paths exist | Distinguish accepted, processed, searchable, and published; recover durable jobs |
| Source changes | Incremental processing is configurable | Order external events, retain source revisions, and avoid stale publication |
| Multi-store writes | Multiple storage layers and processing stages | Do not assume a cross-store atomic publish; validate and expose a coherent revision |
| Deletion | Scoped deletion uses tracked source provenance | Verify every custom pipeline and clear derived application caches/reports |
| Provenance ledger | Optional processing can fail without failing the main pipeline | Check coverage and warnings; a partial ledger is not a complete audit |
| Contradictions | Optional processing identifies conflicts | Decide authority and review policy; do not silently overwrite business truth |
| Dataset access | Depends on principal, grants, EBAC, and handlers | Add project-level rules where needed and never broaden scope on failure |

The [forget documentation](https://docs.cognee.ai/python-api/forget) explicitly notes that memory-only deletion can leave untracked custom-pipeline nodes, including code-graph material. A maintenance prune may be appropriate for an isolated rebuild, but is not a safe automatic substitute for scoped deletion in a shared request. Check source-to-derived-object coverage and test indirect retrieval after deletion.

The [cognify documentation](https://docs.cognee.ai/python-api/cognify) describes optional provenance and contradiction stages. Treat these as processing capabilities, not proof of truth, complete source coverage, or a transactional compliance ledger.

## Deployment and recovery checks

Pin package versions and container digests. The [1.6.0 release notes](https://github.com/topoteretes/cognee/releases/tag/v1.6.0) call out adapter changes and the removal of GLiNER from the default Docker image. Test optional dependencies inside the actual image; a working local virtual environment is not sufficient.

Put the HTTP server behind authenticated TLS ingress, keep database credentials server-side, and isolate administrative/provisioning credentials from query workers. Readiness should test required stores without triggering expensive ingestion. A separate smoke test should ingest a distinctive authorized source, retrieve it after restart, and remove it.

Apply backpressure before resource exhaustion. Coalesce source changes, bound concurrent dataset work, and account for internal retries when choosing the external request deadline. A client timeout can leave server work running; correlate operation IDs before retrying.

Back up metadata, sources, vectors, graph state, and configuration as a compatible set. Restore to a separate environment, reapply migrations intentionally, and verify source locators and ACLs. Model changes with equal vector dimensions can still require rebuilding embeddings. Keep old and new index generations separate until the new one passes representative queries.

Before sharing, test an owner, a read-only collaborator, a principal with a different active tenant, a project-A-only principal, and a user with no dataset access. Repeat after a cache warm-up, permission revocation, source deletion, worker crash, and an out-of-order update. Assert absence of restricted titles, relationships, and evidence in responses and traces—not only in the generated answer.

[Cognee memory](../../memory/frameworks/cognee-memory.md) and [input transformers](../../multimodal/tools/cognee-input-transformers.md) cover distinct session and modality boundaries. Their limitations carry into the graph: missing frame analysis, page locations, or code-body representation cannot be repaired by a stronger final answer model.
