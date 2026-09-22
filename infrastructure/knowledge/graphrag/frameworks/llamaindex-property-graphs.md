# LlamaIndex property graphs

Official resources: [Property graph guide](https://developers.llamaindex.ai/python/framework/module_guides/indexing/lpg_index_guide/), [LlamaIndex repository](https://github.com/run-llama/llama_index), [Core API reference](https://developers.llamaindex.ai/python/framework-api-reference/indices/property_graph/).

`PropertyGraphIndex` orchestrates graph construction and retrieval around interchangeable extractors, stores, and retrievers. It is useful when the application needs to compose these pieces rather than adopt a single fixed pipeline. It is distinct from older `KnowledgeGraphIndex` examples and from [LlamaIndex's broader RAG components](../../rag/frameworks/llamaindex.md).

## Ingest, inspect evidence, then generate

Use a fresh virtual environment and install the core plus the model integrations selected for the example:

```bash
python -m pip install llama-index-core llama-index-llms-openai llama-index-embeddings-openai
python -m pip freeze > requirements.lock
```

The example follows the `PropertyGraphIndex` API documented on September 22, 2026; lock these separately versioned packages together. Set `OPENAI_API_KEY`, `CHAT_MODEL`, and `EMBEDDING_MODEL` to supported model choices. This executes extraction, embeddings, and generation rather than a free offline demonstration.

```python
import os
from typing import Literal
from llama_index.core import Document, PropertyGraphIndex
from llama_index.core.indices.property_graph import SchemaLLMPathExtractor
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

llm = OpenAI(model=os.environ["CHAT_MODEL"])
embedder = OpenAIEmbedding(model=os.environ["EMBEDDING_MODEL"])
extractor = SchemaLLMPathExtractor(
    llm=llm,
    possible_entities=Literal["TASK", "SERVICE", "DOCUMENT"],
    possible_relations=Literal["AFFECTS", "DOCUMENTS"],
    kg_validation_schema={"TASK": ["AFFECTS"], "DOCUMENT": ["DOCUMENTS"], "SERVICE": []},
    strict=True, num_workers=1, max_triplets_per_chunk=6,
)
source = Document(
    id_="DOC-7:r2",
    text="APP-42 affects billing-eu. DOC-7 documents snapshot verification before billing-eu rollback.",
    metadata={"source_id": "DOC-7", "source_revision": "2", "locator": "rollback"},
)
index = PropertyGraphIndex.from_documents(
    [source], kg_extractors=[extractor], llm=llm, embed_model=embedder,
)
retriever = index.as_retriever(include_text=True, similarity_top_k=3)
for item in retriever.retrieve("Which document helps with APP-42's service?"):
    print(item.node.get_content())
    print(item.node.metadata)
response = index.as_query_engine(include_text=True, similarity_top_k=3).query(
    "What must happen before billing-eu rollback?"
)
print(response)
index.storage_context.persist(persist_dir="./r7-property-graph")
```

The simple validation map constrains predicates by subject type; it is not a complete business ontology or ACL. Inspect endpoint types, identity, and source support as separate checks. A strict schema can reject important evidence if the ontology lacks a necessary predicate. Count rejected and unresolved material rather than interpreting an empty graph as proof that the source contains no facts.

The default local store is suitable for this private example. Persisting the storage context is not a production backup strategy for an external database, nor does the example establish concurrent-write safety.

## Choose extraction and retrieval independently

The documented extractors offer different constraints. `SimpleLLMPathExtractor` extracts model-proposed paths; `ImplicitPathExtractor` reads relationships already attached to source nodes without an extraction LLM; `SchemaLLMPathExtractor` constrains types and paths; `DynamicLLMPathExtractor` allows broader discovery. Use explicit application relationships when they already exist instead of reconstructing them from text.

Retrieval composition can combine LLM-generated synonyms, vector-seeded graph context, fixed Cypher templates, generated Cypher, and custom retrievers. The defaults may include an LLM synonym step: an apparently simple retrieval call is not necessarily vector search alone. Measure retrieval calls separately from answer generation.

`include_text=True` is important when source chunks should accompany graph paths, but verify the resulting source locators and authorization. A graph node's description is still generated or normalized knowledge, not automatically an original passage.

## Use a store matching the application boundary

A `PropertyGraphStore` can be paired with a vector store or use native vector support where available. `from_existing` attaches to an already populated graph store; it does not recreate missing provenance or guarantee compatibility with an arbitrary graph schema.

Choose a backend according to query language, vector support, transactions, isolation, and operational needs. The [Spanner integration](https://docs.cloud.google.com/spanner/docs/llama-index) is a separately documented Preview capability, not a guarantee that every property-graph backend has identical features. See [Spanner Graph](../platforms/google-spanner-graph.md) for the Google deployment boundary.

## Production checks

Keep the ingestion principal separate from the query principal. Generated Cypher must use read-only permissions, validated query shapes, backend limits, and source authorization. `CypherTemplateRetriever` still needs validation of model-inferred parameter values; a fixed template is safer to bound, not automatically safe.

Store application source ID and revision independently of generated node identities. Verify document replacement and deletion against the selected store, including shared entities, vectors, and cached contexts. Changing an embedding model or schema requires an explicit migration and retrieval regression checks.

Use the [R7 fixture](../graphrag-definition.md#a-shared-synthetic-release-example) to compare source-only retrieval, vector-seeded graph retrieval, and synonym expansion independently. Include the ambiguous Billing identities, a missing path, a revoked source, an obsolete decision, and an unanswerable question. Do not attribute an improvement from a larger context or extra LLM rewrite solely to graph structure.
