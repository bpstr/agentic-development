# Google Cloud Spanner Graph for GraphRAG

Official resources: [Spanner Graph overview](https://docs.cloud.google.com/spanner/docs/graph/overview), [Graph setup](https://docs.cloud.google.com/spanner/docs/graph/set-up), [Vector search](https://docs.cloud.google.com/spanner/docs/graph/perform-vector-similarity-search), [LangChain integration](https://docs.cloud.google.com/spanner/docs/langchain), [LlamaIndex integration](https://docs.cloud.google.com/spanner/docs/llama-index), [Reference architecture](https://docs.cloud.google.com/architecture/gen-ai-graphrag-spanner).

Spanner Graph is a managed property-graph capability inside Spanner, not a separate turnkey GraphRAG service. It can map relational tables into a graph and query them through a GQL-compatible interface. The application or framework supplies source interpretation, retrieval orchestration, evidence selection, and generation.

The documentation reviewed on September 22, 2026 requires Enterprise or Enterprise Plus for Spanner Graph and uses the GoogleSQL dialect; the PostgreSQL interface does not support Spanner Graph. Both the LangChain and LlamaIndex integration pages separately carry Preview labels. Do not infer their release status from the underlying database's status.

## Choose how the graph is constructed

For explicit task, service, and dependency records, map existing relationships rather than asking a model to rediscover them from text. Native Spanner property-graph definitions can describe existing tables without creating a second application copy of those rows. For document-derived relationships, retain extracted claims and source evidence separately from authoritative operational facts.

The LangChain adapter can construct its own graph schema from `GraphDocument` objects. Its default schema and flexible-schema option make different table-layout choices. Inspect the created schema and types before extending an existing production graph; automatic schema evolution is not a substitute for reviewed ontology changes.

## A LangChain ingestion-to-evidence example

Provision a separate GoogleSQL database on an eligible Spanner instance and enable the Spanner API. Use Application Default Credentials with permissions for the demonstration's schema and data writes. Set `GOOGLE_CLOUD_PROJECT`, `SPANNER_INSTANCE`, and `SPANNER_DATABASE` to existing resources. This does not provision infrastructure automatically.

```bash
python -m pip install langchain-google-spanner langchain-community google-genai
python -m pip freeze > requirements.lock
gcloud auth application-default login
```

The following follows Google's [graph-store notebook](https://github.com/googleapis/langchain-google-spanner-python/blob/main/docs/graph_store.ipynb), whose inspected blob was `a2237711244747a593dcad5b0a1a47d7bf95cfa8`. It imports explicit synthetic facts rather than using the notebook's older model defaults or deleting the graph on startup.

```python
import json
import os
from langchain_core.documents import Document
from langchain_community.graphs.graph_document import GraphDocument, Node, Relationship
from langchain_google_spanner import SpannerGraphStore

text = "Verify the snapshot before rolling back billing-eu."
task = Node(id="APP-42", type="Task")
service = Node(id="billing-eu", type="Service")
runbook = Node(id="DOC-7:r2", type="Document", properties={
    "text": text, "source_id": "DOC-7", "revision": "2", "locator": "rollback",
})
source = GraphDocument(
    nodes=[task, service, runbook],
    relationships=[
        Relationship(source=task, target=service, type="AFFECTS"),
        Relationship(source=runbook, target=service, type="DOCUMENTS"),
    ],
    source=Document(page_content=text, metadata={"source_id": "DOC-7", "revision": "2"}),
)
store = SpannerGraphStore(
    instance_id=os.environ["SPANNER_INSTANCE"],
    database_id=os.environ["SPANNER_DATABASE"],
    graph_name="R7Knowledge", use_flexible_schema=False,
)
store.add_graph_documents([source])
print(store.get_schema)
evidence = store.query("""
    GRAPH R7Knowledge
    MATCH (t:Task)-[:AFFECTS]->(s:Service)<-[:DOCUMENTS]-(d:Document)
    WHERE t.id = 'APP-42'
    RETURN d.source_id AS source_id, d.revision AS revision,
           d.locator AS locator, d.text AS text, s.id AS service_id
    LIMIT 5
""")
print(json.dumps(evidence, indent=2))
```

This writes to real cloud storage. Its fixed identifiers are trusted fixture data, and it does not implement multi-tenant authorization. Use separate ingestion and read identities for production. Keep source ID/revision/locator as explicit retrievable properties; the existence of `GraphDocument.source` alone should not be assumed to provide every application's citation mapping.

For an optional generated answer, append the following after evidence retrieval. Enable the model API, grant the appropriate inference permissions, and set `GOOGLE_CLOUD_LOCATION` and `CHAT_MODEL` to a supported location/model combination. It uses the [Google Gen AI SDK](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/sdks/overview), not an obsolete hard-coded model from an older notebook:

```python
from google import genai

if not evidence:
    print("No supporting evidence was retrieved.")
else:
    client = genai.Client(
        vertexai=True, project=os.environ["GOOGLE_CLOUD_PROJECT"],
        location=os.environ["GOOGLE_CLOUD_LOCATION"],
    )
    try:
        response = client.models.generate_content(
            model=os.environ["CHAT_MODEL"],
            contents="Explain the required rollback check using only this evidence. "
                     "Cite source_id, revision, and locator; do not infer causes.\n"
                     + json.dumps(evidence),
        )
        print(response.text)
    finally:
        client.close()
```

The SDK still uses the `vertexai` configuration name for this cloud endpoint even where current product documentation uses Agent Platform terminology. This is additional inference, not part of the database read. A production application must validate answer support and treat source content as untrusted data, not rely only on this short demonstration prompt.

## Add vector seeding and bounded graph expansion

Generate source and query embeddings with compatible models and task settings and store source vectors with their revision. Add the vector property to the table/graph schema before issuing distance queries. The native graph/vector documentation shows exact KNN and indexed ANN paths; ANN requires a compatible vector index and is not supported for graph edges in the documented surface.

The following is a query fragment for a graph whose Document nodes already have a populated compatible `embedding` property. Bind `@query_embedding` using the database client's parameter API; it is not executable against the minimal graph above until that additional schema and data exist:

```sql
GRAPH R7Knowledge
MATCH (d:Document)-[:DOCUMENTS]->(s:Service)
RETURN d.source_id, d.revision, d.locator, d.text, s.id
ORDER BY COSINE_DISTANCE(d.embedding, @query_embedding)
LIMIT 5;
```

Compare source-only similarity against vector-seeded relationship expansion on the same questions. Match the distance function, index metric, vector dimension, and representation. Do not treat Euclidean distance and cosine distance as interchangeable or interpret either as truth probability. Keep graph hops, fan-out, and the total context budget bounded.

## Framework and managed-service boundaries

`SpannerGraphQAChain` can generate GQL from a question, execute it, and ask a model to answer from the result. That is a different safety boundary from the fixed query above. Use constrained schemas, read-only credentials, allowed query shapes, deadlines, and source authorization; a dangerous-request acknowledgement flag is not an authorization system.

The [LlamaIndex integration](https://docs.cloud.google.com/spanner/docs/llama-index) supplies `SpannerPropertyGraphStore` and graph retrievers through its own package and Preview contract. It is an alternative integration surface, not interchangeable syntax for LangChain. The [property-graph guide](../frameworks/llamaindex-property-graphs.md) explains extraction/retriever composition.

Google's reference architecture separates Cloud Storage and Pub/Sub-triggered ingestion, Cloud Run processing, Gemini-based extraction and embeddings, Spanner storage, and an Agent Runtime serving path. It is infrastructure guidance, not a complete application implementation. A smaller service can use a deterministic retrieval endpoint without adding an agent loop.

[Google RAG Engine](../../rag/platforms/google-rag-engine.md) manages a retrieval data lifecycle; [Agent Search](../../retrieval/platforms/google-agent-search.md) supplies managed enterprise retrieval; [Memory Bank](../../memory/platforms/google-memory-bank.md) addresses durable agent memory. None should be relabeled as the same Spanner Graph capability merely because it can supply model context.

## Production verification

Record database edition, region, model endpoints, schema version, package lock, and source/index revision. Test source changes, schema evolution, missing source locators, duplicate service names, permission revocation, and deletion of derived evidence. Operational row updates do not automatically regenerate extracted descriptions, embeddings, or application caches.

Apply authorization before graph paths or passages enter a model, response, or external trace. Back up both source mappings and derived representations, and test restoration in a separate database. Remove only explicitly disposable demonstration resources; the notebook's `cleanup()` deletes graph data/schema and must not become routine application startup code. Use the [GraphRAG evaluation guide](../../../../operations/evaluation/graphrag-evaluation.md) for baseline comparisons and failure cases rather than claiming improvements from the presence of a managed graph database alone.
