# Cognee basic local setup

Official resources: [Installation](https://docs.cognee.ai/getting-started/installation), [Configuration](https://docs.cognee.ai/setup-configuration/overview), [Embedding providers](https://docs.cognee.ai/setup-configuration/embedding-providers), [GLiNER extraction](https://docs.cognee.ai/python-api/cognify#llm-free-extraction-with-gliner).

This setup runs a single-user Python knowledge store with local extraction and embeddings. It uses embedded databases and does not expose an HTTP service. Use a supported Python version; Python 3.12 is a suitable baseline for this pinned example.

```bash
mkdir cognee-demo
cd cognee-demo
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install "cognee[gliner,fastembed]==1.6.0"
```

Create `.env` in this directory with the following values. Replace both path placeholders with absolute paths inside your demo directory before importing Cognee:

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

These access settings describe a private local demonstration, not an authenticated shared service. First use downloads extraction and embedding weights; local inference still consumes memory, CPU, and disk. GLiNER uses a bounded extraction schema and does not support every custom graph or temporal pipeline.

Run `cognee-cli demo` to check the bundled prebuilt-graph example, then run the [Python indexing and retrieval example](cognee.md#quick-start). The CLI demo itself does not validate extraction from new content.

Cognee loads `.env` on import and can override shell values from that file. Restart after configuration changes. Keep the two storage roots together for backup, with the service idle; changing embedding models requires a compatible index migration.

For generated answers, configure an available model and credentials using the [LLM provider guide](https://docs.cognee.ai/setup-configuration/llm-providers). For shared deployment, configure [authentication and dataset handlers](https://docs.cognee.ai/setup-configuration/permissions) and supported external storage before accepting users. Local dataset naming does not provide multi-user isolation.
