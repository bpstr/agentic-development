# Haystack

[Official documentation](https://docs.haystack.deepset.ai/docs/intro) · [Pipelines](https://docs.haystack.deepset.ai/docs/pipelines) · [Repository](https://github.com/deepset-ai/haystack)

Haystack is an Apache-2.0 Python framework for composing retrieval and generation components into explicit execution pipelines. In a RAG application, it connects document conversion, indexing, retrieval, prompt construction, and model calls while allowing each component and storage integration to be selected independently. It is useful when the application needs inspectable data flow and control over intermediate results.

The open-source `haystack-ai` package is distinct from the managed Haystack Enterprise Platform. Installing the framework does not provision a production document database, model service, or application hosting.

## Mechanism

Keep indexing and answering as separate pipelines. Indexing converts sources into `Document` objects, cleans and splits content, optionally embeds it, and writes it to a document store. A query pipeline retrieves matching documents, optionally reranks them, builds model context, and invokes a generator. Keyword retrieval does not require embeddings; dense retrieval requires compatible document and query embedding models.

Components expose named inputs and outputs. `Pipeline.add_component()` registers them, `Pipeline.connect()` connects compatible sockets, and `Pipeline.run()` supplies runtime inputs. This makes the retrieval results available for inspection before introducing answer generation. See the [pipeline documentation](https://docs.haystack.deepset.ai/docs/pipelines) for branches, loops, serialization, and asynchronous execution.

## Minimal indexing and retrieval

The inspected [package metadata](https://github.com/deepset-ai/haystack/blob/0ad74747ffd7d9f9b092db97ba2e222080992c2e/pyproject.toml) requires Python 3.11 or newer. Install `haystack-ai` in a clean environment and pin the release and integrations that pass the application's compatibility checks:

```bash
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install haystack-ai
```

This example indexes two illustrative text records and searches them without a model API:

```python
from haystack import Document, Pipeline
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.document_stores.in_memory import InMemoryDocumentStore

store = InMemoryDocumentStore()
store.write_documents([
    Document(content="Backups are retained for 32 days."),
    Document(content="Download links expire after 8 hours."),
])

query_pipeline = Pipeline()
query_pipeline.add_component(
    name="retriever",
    instance=InMemoryBM25Retriever(document_store=store, top_k=2),
)
result = query_pipeline.run({"retriever": {"query": "backup retention"}})
for document in result["retriever"]["documents"]:
    print(document.content)
```

The API follows the [official BM25 example](https://docs.haystack.deepset.ai/docs/inmemorybm25retriever) and [retriever implementation at revision `0ad74747ffd7`](https://github.com/deepset-ai/haystack/blob/0ad74747ffd7d9f9b092db97ba2e222080992c2e/haystack/components/retrievers/in_memory/bm25_retriever.py). BM25 scores word overlap; this example establishes retrieval plumbing, not semantic understanding or answer quality.

To add generation, connect retrieved documents to a prompt builder, then connect its output to the chosen generator. The official BM25 page includes a complete chat-generation pipeline. Configure the generator's credentials independently and preserve document IDs and source metadata in the resulting answer. File conversion, OCR, and embedding integrations have their own dependencies and configuration.

## Production boundaries

- **Storage:** the example keeps its corpus in process memory. Select a persistent document-store integration for shared serving, and plan document replacement, deletion, backups, and embedding migrations. Serializing a pipeline does not establish a corpus backup strategy.
- **Authorization:** apply mandatory tenant and document restrictions at the service boundary. The inspected BM25 retriever defaults to `FilterPolicy.REPLACE`, so runtime filters can replace constructor filters. Do not use a replaceable initialization filter as the sole access-control mechanism.
- **Source fidelity:** a converter accepting a PDF does not establish that scanned text, figures, or tables were analyzed. Choose the required OCR or multimodal integration and inspect its output, including retained page references.
- **Resource use:** bound retrieved context, concurrent model calls, and expensive enrichment. Reuse configured stores and clients instead of rebuilding the corpus for each request.
- **Evaluation:** test document recall and ranking before judging generated answers. Include missing evidence, conflicting sources, and access-restricted records; reject unsupported answers even when the generation completes successfully.

Haystack supplies composable execution. Application code remains responsible for durable ingestion state, authorization, source freshness, and the policy governing what retrieved material can authorize.
