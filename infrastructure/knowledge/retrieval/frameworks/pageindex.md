# PageIndex

[Official documentation](https://docs.pageindex.ai/) · [Getting started](https://docs.pageindex.ai/getting-started) · [Repository](https://github.com/VectifyAI/PageIndex)

PageIndex implements document retrieval through a hierarchical tree index and an LLM that selects and reads relevant sections. It is useful for questions over long, structured documents where headings, page ranges, and relationships between sections help locate evidence. It provides an alternative retrieval architecture to embedding similarity search; accuracy and cost still require evaluation on the application's documents.

## Indexing and retrieval

An index represents document structure with nodes and page references. The query agent examines that structure and requests relevant content before composing an answer. Avoiding a vector database does not eliminate segmentation, context limits, or inference work: structural nodes and selected pages still determine which evidence reaches the model.

At [revision `2ac8694bf8fe`](https://github.com/VectifyAI/PageIndex/commit/2ac8694bf8fe89a3840dda9bdb88db5119b77fc4), the open-source SDK includes both local indexing and a document-QA agent. Its default local Flash path extracts layout structure and uses model calls for summaries and refinement; a separate standard mode builds the tree through the older model-driven path. The [client implementation](https://github.com/VectifyAI/PageIndex/blob/2ac8694bf8fe89a3840dda9bdb88db5119b77fc4/pageindex/client.py) documents these modes. Describing the current OSS package as tree generation only would omit its retrieval capabilities.

## Local and cloud boundaries

| Surface | Indexing and storage | Source understanding and references |
| --- | --- | --- |
| Local SDK | Builds and stores the tree on the application's machine; model calls use configured credentials. | PDF text-layer processing and page-level citations. |
| PageIndex Cloud | Uploads the document for managed indexing and storage. | Managed OCR and image understanding, with block-level references and cloud features such as folders and MCP. |

“Local” describes the index and storage location. It does not mean the configured LLM runs locally or that document content never reaches a model provider. With an explicit `chat` model, the SDK runs its QA agent against the application's model credentials in either index mode. Cloud indexing needs its own PageIndex credentials and service agreement.

## Minimal index and query

The inspected [Python package metadata](https://github.com/VectifyAI/PageIndex/blob/2ac8694bf8fe89a3840dda9bdb88db5119b77fc4/pyproject.toml) specifies Python 3.10 or newer and the MIT license. Install the inspected source revision in an isolated environment; the command requires Git:

```bash
python3.10 -m venv .venv
source .venv/bin/activate
python -m pip install 'pageindex @ git+https://github.com/VectifyAI/PageIndex.git@2ac8694bf8fe89a3840dda9bdb88db5119b77fc4'
```

Prepare a text-based `report.pdf`. Configure `OPENAI_API_KEY` for the OpenAI provider, and set `INDEX_MODEL` and `CHAT_MODEL` to compatible model IDs available to the application. Those last two names are application configuration used by this example, not SDK-defined environment variables. Other providers and compatible endpoints have their own configuration in the [LLM reference](https://docs.pageindex.ai/sdk/chat).

```python
import os

from pageindex import PageIndexClient

client = PageIndexClient(
    index=os.environ["INDEX_MODEL"],
    chat=os.environ["CHAT_MODEL"],
)
document = client.submit_document("report.pdf", wait=True)
doc_id = document["doc_id"]

answer = client.chat(
    "What are the main findings? Cite the supporting pages.",
    doc_id=doc_id,
    citations=True,
)
print(answer)
```

The [official quickstart](https://docs.pageindex.ai/getting-started) separates submission from questioning. Local submission indexes synchronously. Cloud submission is asynchronous unless `wait=True` is supplied; otherwise inspect `get_document(doc_id)` until processing completes, and handle failure before querying.

Use `get_tree()` to inspect the index, `get_page_content()` to examine selected page text, and `delete_document()` when a stored source must be removed. Persist document IDs and reuse completed indexes. The [local store implementation](https://github.com/VectifyAI/PageIndex/blob/2ac8694bf8fe89a3840dda9bdb88db5119b77fc4/pageindex/local_store.py) writes tree, page, and document JSON files; manage that directory as application data.

## Production boundaries

Local `get_ocr()` returns text extracted during indexing; its name does not mean an OCR model ran. Scanned or image-only pages need a verified OCR/vision path. Local page references also do not imply cloud-style layout bounding boxes or block-level citations.

Measure retrieval failures, answer support, latency, and model usage on representative documents. Tree summaries can omit details, and an agent can choose the wrong branch. Preserve original PDFs and validate cited pages, especially for tables and cross-section comparisons. Limit agent turns and concurrent indexing, and reindex changed sources deliberately.

The inspected package still carries an Alpha development-status classifier. Lock resolved dependencies and test SDK upgrades, storage behavior, and provider compatibility. Vendor benchmarks and cost examples describe their reported workloads; they do not establish a general performance advantage over hybrid or vector retrieval.
