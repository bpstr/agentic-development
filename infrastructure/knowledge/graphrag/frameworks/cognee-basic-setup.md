# Cognee basic local setup

Official resources: [Installation](https://docs.cognee.ai/getting-started/installation), [Configuration](https://docs.cognee.ai/setup-configuration/overview), [Embedding providers](https://docs.cognee.ai/setup-configuration/embedding-providers), [GLiNER extraction](https://docs.cognee.ai/python-api/cognify#llm-free-extraction-with-gliner).

This is a private, single-user Python demonstration with embedded storage. It does not expose an HTTP service. Python 3.12 and Cognee 1.6.0 are the pinned baseline; do not silently upgrade the package while retaining an old index and configuration.

```bash
mkdir cognee-demo
cd cognee-demo
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install "cognee[gliner,fastembed]==1.6.0"
python -c 'from importlib.metadata import version; print(version("cognee"))'
```

Create `.env` in this directory before importing Cognee. Replace both paths with absolute locations inside this demo directory:

```dotenv
SYSTEM_ROOT_DIRECTORY="/absolute/path/to/cognee-demo/.cognee_system"
DATA_ROOT_DIRECTORY="/absolute/path/to/cognee-demo/.data_storage"
DB_PROVIDER=sqlite
VECTOR_DB_PROVIDER=lancedb
GRAPH_DATABASE_PROVIDER=ladybug
ENABLE_BACKEND_ACCESS_CONTROL=false
REQUIRE_AUTHENTICATION=false
CACHING=false
TELEMETRY_DISABLED=true
LLM_API_KEY=""
GRAPH_EXTRACTOR=gliner_demo
CONTRADICTION_DETECTION=false
EMBEDDING_PROVIDER=fastembed
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
EMBEDDING_DIMENSIONS=384
```

These disabled access settings are not a shared-service template. Keep the directory private, do not publish a network listener with these settings, and do not ingest another user's data into the demonstration.

## Verify the actual work

Run `cognee-cli demo` to inspect the bundled prebuilt-graph flow, then execute the [ingestion and retrieval example](cognee.md#quick-start). The CLI demonstration does not prove extraction from new documents works. Test a new source containing a distinctive marker, retrieve it, restart the process, and retrieve it again from the same storage roots.

Verify the installed package version, loaded configuration, populated sources, and selected search mode. A healthy process is not proof that the data was indexed, and a generated answer is not proof that the correct source was retrieved.

GLiNER uses a bounded extraction schema and does not support every custom-graph or temporal pipeline. Disabling cloud answer generation does not make all processing free: first use may download model weights, and local extraction and embeddings consume CPU, RAM, and storage. The [graph-store documentation](https://docs.cognee.ai/setup-configuration/graph-stores) also describes embedded-engine extensions and buffer-pool sizing. Check these against the pinned release before assuming an air-gapped deployment works; documentation describing the next release is not a guarantee for 1.6.0.

## Keep configuration and storage reproducible

Cognee's environment-loading behavior can override shell values from `.env`; inspect effective settings without printing secrets and restart after configuration changes. Keep storage roots outside disposable virtual environments and containers. Changing working directories or rebuilding a virtual environment should not silently select an empty database.

Record the embedding provider, model, dimensions, and normalization/preprocessing policy with the index. Equal dimensions do not make two embedding models compatible. Use a deliberate migration and a retrieval check when any of these change.

Back up metadata, source storage, graph, and vectors together while writes are quiescent, or use a coordinated backend snapshot procedure. Restore into an isolated environment and retrieve a known source before accepting the backup as usable. Do not put a global prune operation into ordinary startup code.

For generated answers, configure a model using the [LLM provider guide](https://docs.cognee.ai/setup-configuration/llm-providers). For sharing, move to the [production integration boundary](../integrations/cognee-production-integration.md): authenticated principals, explicit backend access control, compatible dataset handlers, and negative permission tests. Adding a dataset name to this local example does not provide isolation.
