# LlamaIndex for RAG

Official resources: [Framework documentation](https://developers.llamaindex.ai/python/framework/), [Starter example](https://developers.llamaindex.ai/python/framework/getting_started/starter_example/), [Repository](https://github.com/run-llama/llama_index).

LlamaIndex provides source loaders, document and node abstractions, indexes, retrievers, and response synthesis. Its RAG role is to connect source ingestion to evidence selection and answering; hosted parsing and managed services are separate choices.

Install `llama-index-core` and `llama-index-embeddings-openai` in a virtual environment and set `OPENAI_API_KEY`. This example explicitly selects the documented embedding model, builds an in-memory index, and retrieves passages without generating a final answer:

```python
from llama_index.core import Document, VectorStoreIndex
from llama_index.embeddings.openai import OpenAIEmbedding

embedding = OpenAIEmbedding(model="text-embedding-3-small")
documents = [Document(
    text="Pause billing jobs before restoring the pre-migration snapshot.",
    id_="runbook-billing:r12",
    metadata={"source_id": "runbook-billing", "revision": "12"},
)]
index = VectorStoreIndex.from_documents(documents, embed_model=embedding)
retriever = index.as_retriever(similarity_top_k=3)
for result in retriever.retrieve("What must happen before rollback?"):
    print(result.node.get_content(), result.score)
```

See the [retriever guide](https://developers.llamaindex.ai/python/framework/module_guides/querying/retriever/) for retrieval customization. A query engine adds response synthesis; choosing a retriever keeps evidence inspection separate from answer quality.

Embedding the documents and query calls the configured provider. Persist or use an external store to avoid rebuilding the index on each request. Preserve document IDs, access metadata, and source revisions through transformations; selecting an integration does not establish tenant isolation or a complete deletion policy.
