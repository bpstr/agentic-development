# AnythingLLM

[Official documentation](https://docs.anythingllm.com/) · [Repository](https://github.com/Mintplex-Labs/anything-llm) · [Document workflow](https://docs.anythingllm.com/chatting-with-documents/introduction)

AnythingLLM is a workspace-based [chat application](../chat-interfaces.md) combining model connections, document retrieval, and agent tools. It packages these capabilities into desktop and server deployments. Use it when users need to organize documents into reusable collections and ask questions without implementing an ingestion service and chat interface from scratch.

## Desktop and server are different deployments

The [edition comparison](https://docs.anythingllm.com/installation-desktop/overview) distinguishes a single-user desktop application from the Docker/server offering. Server mode provides multiple users, invitations, workspace access management, and embeddable chat widgets. Desktop supports local document chat and agents, but does not provide those multi-user permission controls.

The application stores records in SQLite. The default local vector store is LanceDB; uploaded/parsed documents, vectors, model files, and caches are separate parts of the [storage directory](https://docs.anythingllm.com/installation-desktop/storage). External vector providers can be configured. Preserve this distinction when planning backups or moving an installation.

## Configure an installation

For a personal evaluation, install the appropriate [desktop build](https://docs.anythingllm.com/installation-desktop/overview) for the operating system and complete its onboarding:

1. Select an available local model or configure a hosted model provider.
2. Select the embedding provider and vector database. The built-in embedding provider and default LanceDB allow a local retrieval setup.
3. Create a workspace for the example documents.
4. Confirm that a normal chat request succeeds before adding retrieval.

For team use, follow the [Docker setup](https://docs.anythingllm.com/installation-docker/local-docker), persist `/app/server/storage`, and configure authentication and workspace permissions. A model running on the host is not at the container's own `localhost`; use the documented host-network connection settings.

## Ingest and query

Through workspace document management, upload a small text file and add it to that workspace's **embedded documents**. Wait for extraction and embedding to complete, then open a chat in the workspace and ask for a specific fact contained in the file. Inspect the source snippets and verify the answer against the original.

The [document guide](https://docs.anythingllm.com/chatting-with-documents/introduction) separates two paths:

- A chat attachment supplies document text to that thread, subject to context limits.
- An embedded workspace document is chunked and retrieved as relevant passages across the workspace's threads.

In multi-user mode, embedded workspace documents become available to users with access to that workspace. Moving a private attachment into shared retrieval changes its audience. Test that boundary before ingesting sensitive material.

For poor results, inspect extracted text, chunking, relevance thresholds, and retrieved evidence. LanceDB supports an optional reranking search preference. This is a retrieval configuration, not a promise that every vector backend provides identical search behavior.

## Agent tools and MCP

AnythingLLM's [MCP integration](https://docs.anythingllm.com/mcp-compatibility/overview) makes external server tools available to its agents. Servers can be managed through the UI or `anythingllm_mcp_servers.json` in the storage `plugins` directory. Local processes execute where AnythingLLM runs; a Docker deployment does not thereby obtain the desktop user's filesystem or installed runtimes.

MCP tool access is separate from document indexing. A tool connection can read or act on another system, while workspace RAG retrieves previously ingested material. Configure credentials and permitted actions for each connection.

## Operational and licensing limits

[Embedding configuration](https://docs.anythingllm.com/setup/embedder-configuration/overview) is system-wide, even when chat models vary by workspace. Changing the embedder can invalidate retrieval against existing vectors; re-embed the affected documents consistently.

Local installation does not imply every processing step stays local. Hosted models, remote embedders, vector services, and tools change the data flow. The [repository's privacy section](https://github.com/Mintplex-Labs/anything-llm/blob/308b27662b2f6fd4947791d61c797945c609fcbc/README.md) documents telemetry controls through the Privacy UI or `DISABLE_TELEMETRY=true`; disabling telemetry does not disable configured external providers.

The repository is [MIT-licensed](https://github.com/Mintplex-Labs/anything-llm/blob/308b27662b2f6fd4947791d61c797945c609fcbc/LICENSE). Hosted services and optional commercial offerings are separate from that code license. Verify source permissions, document deletion, and restoration across SQLite, parsed files, and the selected vector store.
