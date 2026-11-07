# Dify

[Official documentation](https://docs.dify.ai/en/self-host) · [Repository](https://github.com/langgenius/dify) · [Knowledge retrieval node](https://docs.dify.ai/en/self-host/use-dify/nodes/knowledge-retrieval)

Dify is an application and workflow platform for composing model calls, retrieval, tools, and branching logic. Its visual graph makes the dependencies between these operations explicit. It is useful when a team wants to develop and publish a knowledge-backed application while keeping its ingestion settings, prompts, execution graph, and application interface together. The relevant capability is [workflow orchestration](../workflow-orchestration.md); retrieval is one operation inside that workflow.

## Start a local deployment

The [Docker deployment guide at revision `2f1fd4c`](https://github.com/langgenius/dify/blob/2f1fd4cb897b179847793aa3cdbfca2fde351092/docker/README.md) requires a running Docker daemon, Docker Compose 2.35.0 or later, and OpenSSL. Its configuration differs from older deployment examples:

```bash
git clone https://github.com/langgenius/dify.git
cd dify
git checkout 2f1fd4cb897b179847793aa3cdbfca2fde351092
cd docker
cp .env.example .env
openssl rand -hex 32
```

Paste the generated value into `.env` as `DIFY_AGENT_LOCAL_SANDBOX_AUTH_TOKEN`. Keep `COMPOSE_PROFILES=weaviate,postgresql,collaboration` for this default deployment, then start it:

```bash
docker compose up -d
docker compose ps --all
```

Wait for the long-running services to become healthy; the one-time `init_permissions` service should exit successfully. Open `http://localhost/install` and create the initial administrator. Configure the generation and embedding models needed by the application through [Model Providers](https://docs.dify.ai/en/self-host/use-dify/workspace/model-providers). Credentials and available models depend on the selected provider.

## Index documents, then retrieve them

The [knowledge creation flow](https://docs.dify.ai/en/self-host/use-dify/knowledge/create-knowledge/introduction) separates document processing from application execution:

1. Open **Knowledge → Create → Create a ready-to-use knowledge base**. Upload a small text or Markdown document with a known answer.
2. Configure chunking and preview the resulting chunks. Check that headings and the answer remain associated before indexing.
3. Select an indexing method and retrieval settings, then wait for processing to complete. [High Quality indexing](https://docs.dify.ai/en/self-host/use-dify/knowledge/create-knowledge/setting-indexing-methods) uses embeddings and offers vector, full-text, and hybrid retrieval settings; Economical indexing has different capabilities.
4. Use **Retrieval Testing** to query the known answer and inspect the returned material. Changes made in this test panel apply only to that test session; persist intended settings in the knowledge base or application configuration. See [retrieval testing](https://docs.dify.ai/en/self-host/use-dify/knowledge/test-retrieval).

Build a Chatflow with **User Input → Knowledge Retrieval → LLM → Answer**. Bind the retrieval query to the user's question and select the indexed knowledge base. Set the LLM's Context to the retrieval node's `result`, and reference that context in the prompt. Bind the Answer node to the LLM output. A Workflow uses its own input variable and a final Output node instead. The [retrieval node documentation](https://docs.dify.ai/en/self-host/use-dify/nodes/knowledge-retrieval) explains these bindings and the separate knowledge-base and node-level retrieval settings.

Test both an answerable question and a question absent from the document. Instruct the model to identify missing evidence. Inspect retrieved chunks before changing prompts: a fluent response cannot establish that retrieval found the right passage.

## Publish and operate

Publish the app after testing its graph, and use its generated API documentation for the chosen application type. Dify also supports [publishing an application as an MCP server](https://docs.dify.ai/en/self-host/use-dify/publish/publish-mcp) from the Access Point tab. This is disabled by default. The generated URL contains credentials and must be handled as a secret; regenerating it invalidates the previous address. Publishing an app as a server is separate from using external MCP tools inside an app.

For production, replace bundled credentials, configure HTTPS and trusted proxies, and retain the database, uploaded files, and vector-store data required by the deployment. The pinned Docker guide documents an important migration boundary: changing `VECTOR_STORE` selects the backend for new indexes; existing knowledge bases retain their stored backend. Keep that backend available until data has been migrated deliberately.

Dify uses a [modified Apache 2.0 license](https://github.com/langgenius/dify/blob/2f1fd4cb897b179847793aa3cdbfca2fde351092/LICENSE). Additional conditions govern multi-tenant operation and removal or modification of frontend logos and copyright information. Check those conditions before offering workspaces to separate customers or distributing a customized frontend.

