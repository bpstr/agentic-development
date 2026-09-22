# Neo4j GraphRAG Python

Official resources: [Library documentation](https://neo4j.com/docs/neo4j-graphrag-python/current/), [Retrieval guide](https://neo4j.com/docs/neo4j-graphrag-python/current/user_guide_rag.html), [Graph construction](https://neo4j.com/docs/neo4j-graphrag-python/current/user_guide_kg_builder.html), [API reference](https://neo4j.com/docs/neo4j-graphrag-python/current/api.html), [Repository](https://github.com/neo4j/neo4j-graphrag-python).

This first-party Python library supplies retrieval, generation, and graph-construction components around Neo4j. It can use an existing graph or build one from documents. A managed Neo4j database hosts storage; the library and application still determine extraction, retrieval, source permissions, and generation.

## A deterministic graph-to-answer example

The example uses the [1.19.0 release](https://github.com/neo4j/neo4j-graphrag-python/releases/tag/1.19.0). Create a dedicated disposable Neo4j database with vector-index support and credentials allowed to create its demonstration data and index. Install in a virtual environment:

```bash
python -m pip install "neo4j-graphrag[openai]==1.19.0"
```

Set `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`, `OPENAI_API_KEY`, `CHAT_MODEL`, and `EMBEDDING_MODEL` to usable values. This code makes embedding and generation calls. It creates explicit relationships instead of asking an extractor to infer facts that the application already knows:

```python
import os
from neo4j import GraphDatabase
from neo4j_graphrag.embeddings import OpenAIEmbeddings
from neo4j_graphrag.generation import GraphRAG
from neo4j_graphrag.indexes import create_vector_index
from neo4j_graphrag.llm import OpenAILLM
from neo4j_graphrag.retrievers import VectorCypherRetriever

text = "DOC-7: Verify the snapshot before rolling back billing-eu."
embedder = OpenAIEmbeddings(model=os.environ["EMBEDDING_MODEL"])
vector = embedder.embed_query(text)

with GraphDatabase.driver(
    os.environ["NEO4J_URI"],
    auth=(os.environ["NEO4J_USER"], os.environ["NEO4J_PASSWORD"]),
) as driver:
    driver.verify_connectivity()
    driver.execute_query(
        """
        MERGE (s:Service {id: $service})
        MERGE (t:Task {id: $task})
        MERGE (t)-[:AFFECTS]->(s)
        MERGE (c:Chunk {id: $chunk})
        SET c.text=$text, c.embedding=$vector,
            c.source_id=$source, c.revision=$revision, c.locator=$locator
        MERGE (c)-[:DOCUMENTS]->(s)
        """,
        service="billing-eu", task="APP-42", chunk="DOC-7:r2:rollback",
        text=text, vector=vector, source="DOC-7", revision="2", locator="rollback",
    )
    create_vector_index(
        driver, "r7_chunks", label="Chunk", embedding_property="embedding",
        dimensions=len(vector), similarity_fn="cosine",
    )
    driver.execute_query("CALL db.awaitIndexes(60)")
    retriever = VectorCypherRetriever(
        driver, index_name="r7_chunks", embedder=embedder,
        retrieval_query="""
        MATCH (node)-[:DOCUMENTS]->(s:Service)<-[:AFFECTS]-(t:Task)
        RETURN node.text AS text, node.source_id AS source_id,
               node.revision AS revision, node.locator AS locator,
               s.id AS service_id, collect(DISTINCT t.id) AS task_ids, score
        """,
    )
    evidence = retriever.search(query_text="How can APP-42's service roll back?", top_k=5)
    print(evidence)
    rag = GraphRAG(retriever=retriever, llm=OpenAILLM(model_name=os.environ["CHAT_MODEL"]))
    answer = rag.search(
        query_text="What must happen before rollback?",
        retriever_config={"top_k": 5}, return_context=True,
    )
    print(answer.answer)
```

The custom schema and synthetic content are application design. `VectorCypherRetriever` exposes the matched `node` and its `score` to the retrieval query. Here the query adds task/service relationships and explicit source properties. In a real multi-tenant graph, add validated authorization predicates and bounded expansion; this isolated-database example is not an ACL implementation.

The demonstration does not automatically remove old chunk revisions. Retain source lineage and explicitly retire obsolete revisions before making the production query treat them as current. Use uniqueness constraints and a dedicated read-only identity for retrieval; the write-capable demonstration identity is only for setup.

## Build a graph from documents when necessary

The documented `SimpleKGPipeline` remains an experimental construction surface. With configured `llm`, `driver`, and `embedder`, its core lifecycle is:

```python
from neo4j_graphrag.experimental.pipeline.kg_builder import SimpleKGPipeline

async def ingest_text(llm, driver, embedder, text: str):
    pipeline = SimpleKGPipeline(
        llm=llm, driver=driver, embedder=embedder,
        from_file=False, on_error="RAISE", perform_entity_resolution=False,
    )
    return await pipeline.run_async(text=text)
```

This is a callable integration fragment; the first example supplies the component configuration pattern. Supply a reviewed schema for domain-specific node/relationship types, preserve document metadata, and inspect extracted support. The default resolver can merge nodes with the same label and name. Disabling it in this example avoids treating equal display names as proof of identity; production still needs a deliberate resolution policy.

## Choose a retriever deliberately

`VectorRetriever` retrieves vector matches; `HybridRetriever` also uses a full-text index. Their Cypher variants expand or reshape context through an application-supplied query. `Text2CypherRetriever` asks a model to generate a database query and therefore has a different safety and inference boundary.

For stable task-document questions, prefer constrained templates over unrestricted generated queries. Parameterize values, allow only the required read patterns, enforce backend timeouts, and authorize intermediate nodes and returned sources. A prompt asking the model not to write is not equivalent to read-only database credentials.

Format properties and source references rather than passing opaque database node objects into a prompt. Evaluate source support and connectedness before judging the answer. The library's experimental/beta surfaces and database-specific vector syntax need review during upgrades; a passing driver connection check does not validate every retriever.

Test the R7 baseline, ambiguous Billing entities, a chunk with a missing source, duplicated evidence, a stale revision, and permission revocation. Compare the same vector candidate set with and without the Cypher expansion to measure the graph's contribution. Cleanup must remove demonstration data and its index only from the dedicated database; do not use a global graph wipe in a shared deployment.
