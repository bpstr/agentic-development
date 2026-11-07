# RAGFlow

[Official documentation](https://ragflow.io/docs/dev/) · [Repository](https://github.com/infiniflow/ragflow) · [HTTP API](https://ragflow.io/docs/dev/http_api_reference) · [Python API](https://ragflow.io/docs/dev/python_api_reference)

RAGFlow is an Apache-2.0 document-ingestion and RAG platform with a web interface, retrieval APIs, chat applications, and agent workflows. It is useful when document parsing, chunk inspection, dataset management, and citation-bearing answers need to be operated together. Its SDK is a client for the platform, not an embedded replacement for the server.

## Architecture and release boundary

The [v1.0.0 release](https://github.com/infiniflow/ragflow/releases/tag/v1.0.0) uses a Go backend. The [deployment guide at release revision `db1cd5929a78`](https://github.com/infiniflow/ragflow/blob/db1cd5929a7885a3074547791f5ecc4d2f891739/docker/README.md) describes API, Admin, Ingestor, and Syncer modes of one server binary. Its default dependency profile includes Elasticsearch, MySQL, MinIO, Kvrocks, NATS, and ClickHouse. Selected alternatives change that dependency set.

DeepDoc layout analysis, OCR, and table recognition run in-process through ONNX Runtime; the open-source 1.0 release uses CPU inference for these operations. This is a materially different deployment from older Python-backend instructions. Follow the chosen release's documentation, image, SDK, and migrations together.

Ingestion uploads a source, parses it into chunks, embeds searchable content, and stores indexing state. Retrieval selects evidence; a configured chat model then generates an answer from that evidence. Parsing success and answer quality are separate checks.

## Setup

Use the release's supported Linux deployment. Before startup, configure `docker/.env`, replace dependency and administrator passwords, and restrict management ports. For the default Elasticsearch engine, the Docker host needs `vm.max_map_count` of at least `262144`. Keep `RAGFLOW_IMAGE` aligned with the checkout:

```bash
git clone https://github.com/infiniflow/ragflow.git
cd ragflow
git checkout v1.0.0
cd docker
docker compose -f docker-compose.yml up -d
```

The [quickstart](https://github.com/infiniflow/ragflow/blob/db1cd5929a7885a3074547791f5ecc4d2f891739/docs/quickstart.mdx) explains host preparation and verifies readiness with `http://localhost/api/v1/system/healthz`. In the UI, configure and verify an embedding model and a chat model. Select the embedding model before parsing the dataset, then obtain an API key.

The inspected [1.0 SDK metadata](https://github.com/infiniflow/ragflow/blob/db1cd5929a7885a3074547791f5ecc4d2f891739/sdk/python/pyproject.toml) requires Python `>=3.13,<3.14`. From the repository root, use a Python 3.13 virtual environment and install the matching client with `python -m pip install ./sdk/python`. Set `RAGFLOW_API_KEY` and `RAGFLOW_BASE_URL` for the application; these are environment variables read by the example below.

## Upload, parse, and retrieve

This example uses a fresh dataset name and the configured default embedding model:

```python
import os

from ragflow_sdk import RAGFlow

client = RAGFlow(
    api_key=os.environ["RAGFLOW_API_KEY"],
    base_url=os.environ["RAGFLOW_BASE_URL"],
)
dataset = client.create_dataset(name="retention-example")
documents = dataset.upload_documents([
    {
        "display_name": "retention.txt",
        "blob": b"Backups are retained for 32 days.",
    }
])
document_ids = [document.id for document in documents]
finished = dataset.parse_documents(document_ids)
if not finished or any(status != "DONE" or chunks == 0
                       for _, status, chunks, _ in finished):
    raise RuntimeError(f"Parsing did not produce usable chunks: {finished}")

for chunk in client.retrieve(
    dataset_ids=[dataset.id],
    document_ids=document_ids,
    question="How long are backups retained?",
    page_size=4,
):
    print(chunk)
```

The [dataset client](https://github.com/infiniflow/ragflow/blob/db1cd5929a7885a3074547791f5ecc4d2f891739/sdk/python/ragflow_sdk/modules/dataset.py) confirms that `parse_documents()` starts parsing and polls for completion. `async_parse_documents()` only submits the work. The synchronous helper has no overall deadline in the inspected implementation; production jobs need an application timeout and failure policy.

After inspecting retrieval results, create a Chat bound to the dataset and enable citations, or use the documented chat/session APIs. Check cited source content rather than treating the presence of a citation as proof that an answer is correct.

## Production boundaries

- **Parsing fidelity:** choose and inspect the appropriate parsing pipeline. OCR text, layout interpretation, table reconstruction, and image understanding are different operations. Check retained page positions and chunk previews against representative source documents.
- **Retrieval consistency:** documents searched together must use a compatible embedding model. Model or parser changes can require reprocessing; preserve source files and maintain explicit index versions.
- **Operations:** back up metadata and object storage alongside the search index. Bound parsing concurrency and embedding batches; the multi-service deployment and CPU document analysis have real resource requirements.
- **Access:** keep datasets scoped to the intended user or team, protect API keys, and restrict Admin access. A hosted RAGFlow service is a separate operational arrangement from running the open-source stack.
- **Migration:** keep production downgrade checks enabled. Development flags that bypass migration-version checks are not a substitute for a tested upgrade and restore procedure.
