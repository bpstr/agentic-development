# Microsoft GraphRAG

Official resources: [Documentation](https://microsoft.github.io/graphrag/), [Getting started](https://microsoft.github.io/graphrag/get_started/), [Repository](https://github.com/microsoft/graphrag).

Microsoft GraphRAG builds retrieval structures from a text corpus, including extracted entities, relationships, and community reports. It supports different query methods for entity-centered and broader collection questions. It is a specific implementation of graph-based RAG.

Create a dedicated project and virtual environment using a Python version supported by the selected release, install `graphrag`, and initialize its configuration:

```bash
mkdir graphrag-demo
cd graphrag-demo
python -m venv .venv
source .venv/bin/activate
python -m pip install graphrag
graphrag init
```

The initializer creates configuration and an input directory. Select available chat and embedding models and configure the credentials referenced by `.env` and `settings.yaml`. Place a small collection of your own text files in `input/`, then index and query:

```bash
graphrag index
graphrag query "Which operational problems recur in these reports?"
graphrag query "Which services are connected to incident INC-17?" --method local
```

Indexing and queries can invoke configured providers, and indexing a large corpus can consume substantial model resources.

Use [local search](https://microsoft.github.io/graphrag/query/local_search/) for connected evidence around entities and [global search](https://microsoft.github.io/graphrag/query/global_search/) for questions suited to community reports. Preserve source mappings and review extraction quality before treating graph links as reliable. A corpus index does not automatically integrate current task state, document permissions, or continuous deletion synchronization.
