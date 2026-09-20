# LangChain retrieval components

Official resources: [Retrieval concepts](https://docs.langchain.com/oss/python/langchain/retrieval), [Vector store implementation](https://github.com/langchain-ai/langchain/blob/master/libs/core/langchain_core/vectorstores/in_memory.py), [Repository](https://github.com/langchain-ai/langchain).

LangChain supplies document, embedding, vector-store, and retriever interfaces that can connect existing sources to a RAG application. Retrieval can be used independently of an agent loop or graph orchestrator.

Install `langchain-core` and `langchain-openai`, then configure `OPENAI_API_KEY`. This example uses an in-memory store and explicit provider embeddings:

```python
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings

store = InMemoryVectorStore(
    embedding=OpenAIEmbeddings(model="text-embedding-3-small")
)
store.add_documents(
    documents=[Document(
        page_content="Pause billing jobs before restoring the snapshot.",
        metadata={"source_id": "runbook-billing", "revision": "12"},
    )],
    ids=["runbook-billing:r12:rollback"],
)
retriever = store.as_retriever(search_kwargs={"k": 3})
for document in retriever.invoke("What happens before rollback?"):
    print(document.page_content, document.metadata)
```

This demonstrates indexing and evidence retrieval; a separate model call can generate an answer from the returned documents.

An in-memory store is suitable for a small example, not restart persistence or multi-user isolation. Store adapters differ in supported filters, scores, deletion behavior, and async operations. Verify those capabilities for the selected backend before relying on a shared abstraction. Keep stable source IDs and authorized query scope in application logic rather than trusting a generated filter expression.
