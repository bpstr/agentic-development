# R2R

[Canonical repository and guide](https://github.com/SciPhi-AI/R2R) · [Repository documentation](https://github.com/SciPhi-AI/R2R/tree/main/docs) · [Releases](https://github.com/SciPhi-AI/R2R/releases)

R2R is an MIT-licensed retrieval and RAG server with a REST API, Python and JavaScript clients, document management, and configurable ingestion and search. It is useful when an application wants ingestion, collections, retrieval, and answer generation behind a service boundary instead of assembling every operation inside its application process.

## Architecture and scope

The inspected [configuration](https://github.com/SciPhi-AI/R2R/blob/9c5a94d151f90876bd7eb860f300a8fd662dc481/py/r2r/r2r.toml) separates model completion, embeddings, ingestion, file storage, database access, authentication, and orchestration. Its default file provider stores source files in PostgreSQL; the deployment includes a pgvector-enabled PostgreSQL option. Vector, keyword, and graph retrieval are configurable capabilities rather than interchangeable names for one search operation.

The [full configuration](https://github.com/SciPhi-AI/R2R/blob/9c5a94d151f90876bd7eb860f300a8fd662dc481/py/core/configs/full.toml) selects Unstructured ingestion and Hatchet orchestration. That introduces additional deployment and worker responsibilities. Graph extraction creates model-derived entities and relationships; those results need provenance and validation just as generated answers do.

The `r2r` Python client talks to a running server. Installing the client does not create a database, start workers, or supply model credentials. The repository's MIT license also does not cover hosted-model usage charges.

## Server setup

At [revision `9c5a94d151f9`](https://github.com/SciPhi-AI/R2R/commit/9c5a94d151f90876bd7eb860f300a8fd662dc481), the [Python package](https://github.com/SciPhi-AI/R2R/blob/9c5a94d151f90876bd7eb860f300a8fd662dc481/py/pyproject.toml) declares Python `>=3.10,<3.13`. Its server needs the `core` dependency extra; the [entry point](https://github.com/SciPhi-AI/R2R/blob/9c5a94d151f90876bd7eb860f300a8fd662dc481/py/r2r/serve.py) explicitly reports that requirement when imports fail.

Provision PostgreSQL with the required extensions and configure `R2R_POSTGRES_USER`, `R2R_POSTGRES_PASSWORD`, `R2R_POSTGRES_HOST`, `R2R_POSTGRES_PORT`, and `R2R_POSTGRES_DBNAME`, or the equivalent database settings in a TOML configuration. These names are checked by the [PostgreSQL provider](https://github.com/SciPhi-AI/R2R/blob/9c5a94d151f90876bd7eb860f300a8fd662dc481/py/core/providers/database/postgres.py). Configure current model IDs and provider credentials, including `OPENAI_API_KEY` if retaining OpenAI-backed defaults. Use `R2R_CONFIG_PATH` for an application configuration.

For an isolated local server after those prerequisites, install the inspected source revision. This command requires Git and selects the repository's `py` package directory:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install 'r2r[core] @ git+https://github.com/SciPhi-AI/R2R.git@9c5a94d151f90876bd7eb860f300a8fd662dc481#subdirectory=py'
python -m r2r.serve --host 127.0.0.1
```

Alternatively, adapt the repository's [Compose deployment](https://github.com/SciPhi-AI/R2R/blob/9c5a94d151f90876bd7eb860f300a8fd662dc481/docker/compose.yaml), pinning images and configuring its environment files. Keep client, server, configuration, and migrations from a compatible revision or release set, and lock the resolved dependencies after validation.

## Ingest, search, and generate

The following uses the verified v3 resource methods. It assumes a configured local server and an isolated development collection:

```python
from r2r import R2RClient

client = R2RClient(base_url="http://127.0.0.1:7272")
created = client.documents.create(
    raw_text="Backups are retained for 32 days.",
    metadata={"title": "Retention example"},
    run_with_orchestration=False,
)
print(created)

question = "How long are backups retained?"
print(client.retrieval.search(query=question))
print(client.retrieval.rag(query=question))
```

The [document endpoint](https://github.com/SciPhi-AI/R2R/blob/9c5a94d151f90876bd7eb860f300a8fd662dc481/py/core/main/api/v3/documents_router.py) runs ingestion synchronously when `run_with_orchestration=False`; the example therefore does not query immediately after merely queuing a job. Normal orchestrated ingestion requires monitoring completion and handling failure before querying. `documents.create(file_path=...)` uploads a file; `documents.retrieve()`, `documents.list_chunks()`, and `documents.delete()` support its lifecycle.

The [retrieval client](https://github.com/SciPhi-AI/R2R/blob/9c5a94d151f90876bd7eb860f300a8fd662dc481/py/sdk/sync_methods/retrieval.py) separates search results from RAG generation. Inspect search evidence first. Apply collection/document filters and authentication for real workloads rather than relying on the example's development scope.

## Operational boundaries

The inspected default configuration disables required authentication and contains a development administrator password. Enable authentication, replace credentials, and verify collection permissions before network deployment. Bound ingestion size, worker concurrency, graph extraction, and model calls; retained defaults are configuration examples, not workload sizing advice.

PDF OCR, image interpretation, and audio transcription depend on the selected parser and model providers. A successful upload does not prove that figures were interpreted or that page geometry and speaker timestamps survived ingestion. Preserve original sources and inspect parser outputs for the modalities actually required.

Maintenance needs explicit review: the latest published GitHub release checked was [v3.6.5](https://github.com/SciPhi-AI/R2R/releases/tag/v3.6.5), while the inspected source declares `3.6.6`. Some repository examples use older SDK layouts. Validate dependency support and model configuration against the exact release being deployed rather than treating every repository example as a current runnable setup.
