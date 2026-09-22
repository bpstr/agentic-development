# GraphRAG with Azure HorizonDB

Official resources: [Graph-augmented RAG patterns](https://learn.microsoft.com/en-us/azure/horizondb/ai/graph-rag), [Apache AGE setup](https://learn.microsoft.com/en-us/azure/horizondb/graph/age-overview), [Knowledge-graph construction tutorial](https://learn.microsoft.com/en-us/azure/horizondb/ai/build-knowledge-graph).

Azure HorizonDB documents a database-centered retrieval path combining vector search, Apache AGE graph queries, optional semantic reranking, and rank fusion. The graph-augmented path and AGE capability are marked **Preview** in the documentation reviewed on September 22, 2026. This is not a managed service that automatically extracts, validates, and continuously synchronizes every application relationship.

## Prepare a disposable database

Use an eligible HorizonDB cluster and a separate demonstration database. Enable AGE through the documented `azure.extensions` and `shared_preload_libraries` parameter-group configuration; applying it restarts the cluster. Do not apply a restart-inducing configuration change to an active production service merely to run this example.

After the configured restart, connect with psql and enable the extension and search path:

```sql
CREATE EXTENSION IF NOT EXISTS age CASCADE;
SET search_path = ag_catalog, "$user", public;
SELECT extname, extversion FROM pg_extension WHERE extname = 'age';
```

The HorizonDB setup guide says the preloaded library does not require `LOAD 'age'`; that command can fail for lack of privilege. Confirm extension availability and the session search path on the actual service rather than assuming upstream PostgreSQL examples apply unchanged.

## Import explicit facts and retrieve source evidence

This synthetic example uses authoritative relationships already known to the application. Run once in the empty demonstration database. It does not call an extraction model, create embeddings, or implement multi-tenant ACLs.

```sql
CREATE TABLE r7_documents (
    id bigint PRIMARY KEY,
    source_id text NOT NULL,
    revision text NOT NULL,
    locator text NOT NULL,
    content text NOT NULL
);

INSERT INTO r7_documents VALUES
    (7, 'DOC-7', '2', 'rollback',
     'Verify the snapshot before rolling back billing-eu.');

SELECT ag_catalog.create_graph('r7_graph');

SELECT * FROM ag_catalog.cypher('r7_graph', $$
    CREATE (t:Task {id: 'APP-42'}),
           (s:Service {id: 'billing-eu'}),
           (d:Document {doc_id: 7}),
           (t)-[:AFFECTS]->(s),
           (d)-[:DOCUMENTS]->(s)
    RETURN t.id
$$) AS result(task_id agtype);

SELECT d.source_id, d.revision, d.locator, d.content
FROM ag_catalog.cypher('r7_graph', $$
    MATCH (:Task {id: 'APP-42'})-[:AFFECTS]->(s:Service)
          <-[:DOCUMENTS]-(d:Document)
    RETURN d.doc_id
$$) AS hit(doc_id agtype)
JOIN r7_documents d ON d.id = hit.doc_id::text::bigint;
```

The result supplies original text and a source revision/locator, not just a graph-node name. Those fields are suitable inputs to the [application evidence adapter](../integrations/graphrag-application-integration.md). A generated answer can explain the returned passage; a task-suggestion endpoint can use it directly without another generation call.

The fixed literals are trusted fixture data. For application values, use a supported parameterized query path or a narrowly validated wrapper. Do not build Cypher by concatenating user text. Add source support for every relationship; this small fixture does not model the full provenance ledger or temporal intervals.

## Add vector and model stages only where useful

The official graph-RAG patterns describe vector candidates, graph expansion, semantic reranking with `azure_ai.rank`, and reciprocal rank fusion. A vector branch can discover a relevant runbook even when the task lacks an explicit service link; a graph branch can discover a differently worded document through a verified relationship. Keep both routes attributable in diagnostics.

Create the compatible pgvector schema and index and populate embeddings using a selected provider before enabling vector queries. Record model and dimensions; do not insert invented vectors and describe the resulting ranking as semantic quality. For small validation corpora, compare exact retrieval before selecting an approximate index and its recall/latency tradeoff.

For unstructured sources, the [construction tutorial](https://learn.microsoft.com/en-us/azure/horizondb/ai/build-knowledge-graph) uses AI Functions to extract and normalize entities before loading AGE. Preserve canonical IDs and source spans during that transformation. A model-based alias merge is a proposal; same-name Billing services across projects must not collapse into one identity.

AI functions can invoke remote model services despite being called through SQL. Account for network, credentials, provider quotas, data egress, and inference cost. Database-local orchestration does not imply every computation occurs inside the database process or that model output is deterministic.

## Production limits to test

The documented implementation supports a subset of openCypher, requires graph and vector data to be planned within the same database for these queries, and leaves source-to-graph synchronization to the application. Do not assume Neo4j-specific clauses or automatic graph change-data capture are present.

Bound edge types, depth, intermediate fan-out, returned rows, and query time. A small hop limit does not control a highly connected hub. Keep query identities read-only and validate access to intermediate nodes and supporting documents, not only final text. A graph-derived relevance score cannot relax a permission filter.

Use a durable change log to amend source rows and corresponding graph support deliberately. A transaction can coordinate supported local writes, but an external extraction call, a cache invalidation, and a model-generated answer are not automatically one database transaction. Test failure between stages and prevent late jobs from resurrecting deleted sources.

Compare exact task lookup, text retrieval, graph-only paths, and the combined pipeline with the [R7 evaluation cases](../../../../operations/evaluation/graphrag-evaluation.md). Do not repeat the provider's domain-specific benchmark percentages as expected application gains. Review current preview terms, regions, extension versions, and resource limits before deployment; use the [Azure integration guide](../integrations/azure-graphrag-deployment.md) to separate provider responsibilities from application operations.
