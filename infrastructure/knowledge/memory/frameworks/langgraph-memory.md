# LangGraph memory

Official resources: [Memory guide](https://docs.langchain.com/oss/python/langgraph/add-memory), [Persistence](https://docs.langchain.com/oss/python/langgraph/persistence), [Repository](https://github.com/langchain-ai/langgraph).

LangGraph distinguishes thread checkpoints from stores that can hold information across threads. A checkpointer preserves execution state; a store manages separately namespaced data. Semantic search is an optional store capability, not an automatic property of persistence.

Install `langgraph`. The following example writes and retrieves one item without a language model:

```python
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()
namespace = ("workspace-7", "project-r7", "conventions")
store.put(namespace, "spelling", {
    "text": "Use British spelling.",
    "source_message_id": "message-18",
})
item = store.get(namespace, "spelling")
if item is not None:
    print(item.value)
```

This is an in-process demonstration of the documented store interface. A graph can receive the store when compiled and access it from its runtime. Configure a durable store and a durable checkpointer separately when both lifetimes are needed.

For semantic search, configure an embedding function and matching dimension, then query within the permitted namespace. Derive that namespace from authenticated scope. A tuple of strings does not itself enforce access control.

Store corrections and source references explicitly. Checkpoint replay also needs safe external-tool behavior: persisting the fact that a node ran does not make an arbitrary repeated payment or deployment idempotent. Keep durable memory and workflow recovery concerns distinct when designing the surrounding application.
