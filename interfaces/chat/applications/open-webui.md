# Open WebUI

[Official documentation](https://docs.openwebui.com/) · [Repository](https://github.com/open-webui/open-webui) · [Knowledge documentation](https://docs.openwebui.com/features/workspace/knowledge/)

Open WebUI is a self-hosted [chat application](../chat-interfaces.md) connecting users to local or remote model services. Its Knowledge features add document ingestion and retrieval to that interface. Use it when users need a ready-made document-chat experience, model configuration, and controlled tool access.

## Knowledge and retrieval

Documents are extracted, split, embedded, and searched through the configured retrieval backend. The [RAG pipeline](https://docs.openwebui.com/features/chat-conversations/rag/) includes optional BM25 keyword/vector hybrid retrieval and cross-encoder reranking through `ENABLE_RAG_HYBRID_SEARCH`; it is not limited to vector-only search.

Focused retrieval selects passages. Full Context supplies complete file content instead, subject to attachment and function-calling mode. In native function-calling mode, a capable model uses knowledge tools to access the sources. Uploading a file and having the model actually retrieve it are separate outcomes.

## Local setup

The [Docker quick start](https://docs.openwebui.com/getting-started/quick-start/) persists application data in a volume. Generate the secret once, retain it securely, and reuse it when recreating the container:

```bash
export WEBUI_SECRET_KEY="$(openssl rand -hex 32)"
docker run -d --name open-webui \
  -p 127.0.0.1:3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  -e WEBUI_SECRET_KEY \
  --restart unless-stopped \
  ghcr.io/open-webui/open-webui:main
```

Open `http://localhost:3000`, complete initial account setup, and connect a model through the admin configuration. The standard image includes local embedding dependencies; the slim image delegates those capabilities to external services. Select a working embedding provider before ingesting documents. For deployment, replace the moving image tag with a tested release tag or digest.

## Ingest and ask

The documented [knowledge workflow](https://docs.openwebui.com/features/workspace/knowledge/) is:

1. Open **Workspace → Knowledge → Create** and name a collection.
2. Upload a small text document and wait for processing to finish.
3. Select the collection in chat using `#`, or attach it to a model configuration.
4. Ask for a specific fact in the document and inspect the retrieved evidence against the original.

For native retrieval, enable the model's Builtin Tools and Knowledge Base category, and use a model that can call those tools. A response produced without accessing the document does not verify ingestion or grounding. Start with text sources before adding scans or complex layouts; extraction-engine support determines what is actually readable.

## Tool and access boundaries

Open WebUI acts as an [MCP client over Streamable HTTP](https://docs.openwebui.com/features/extensibility/mcp/). Administrators add external MCP servers through **Admin → Integrations**. Native MCP connectivity does not directly launch a stdio server on the user's computer. Tool permissions and credentials remain separate from document retrieval and model configuration.

Review knowledge-sharing permissions and enabled tools before giving other users access. A local interface can still send document content to remote embedding, extraction, or inference providers.

## Persistence and license

Default application storage uses SQLite, and the default vector backend is local ChromaDB. The [scaling guidance](https://docs.openwebui.com/getting-started/advanced-topics/scaling/) requires suitable external databases and shared services for multiple workers or replicas; sharing the default local database directory is not a scaling design. Back up uploaded sources, application state, and derived vector data together, and verify reindexing after embedding changes.

The [Open WebUI License at revision `c38885a1a737`](https://github.com/open-webui/open-webui/blob/c38885a1a737da4968f157092f304f3b5481d0bf/LICENSE) contains branding-preservation requirements. Exceptions include deployments with no more than 50 end users in a rolling 30-day period, specific written permission, or an applicable enterprise license. Prior contributions retain their original licenses. Evaluate the actual terms when modifying branding; this release is not simply MIT-licensed.
