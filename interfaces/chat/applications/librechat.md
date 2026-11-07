# LibreChat

[Official documentation](https://www.librechat.ai/docs) · [Repository](https://github.com/LibreChat-AI/LibreChat) · [Document RAG configuration](https://www.librechat.ai/docs/configuration/rag_api)

LibreChat is an MIT-licensed, self-hosted [chat application](../chat-interfaces.md) with model-provider integrations, agents, and external tools. Document question answering is an application feature backed by a separate retrieval service. It is useful when a team needs a configurable chat interface without building the account, conversation, and tool-selection experience itself.

## Separate the storage systems

The [inspected Compose configuration](https://github.com/LibreChat-AI/LibreChat/blob/f4154b649efa37e1345ccc517a4d8d1ed2178c82/docker-compose.yml) wires distinct services together:

| Component | Responsibility |
| --- | --- |
| MongoDB | Application records, including conversations and user-related state. |
| Meilisearch | Search over conversation and message history. |
| RAG API with PostgreSQL/pgvector | Uploaded-document extraction, indexing, and passage retrieval. |

[Meilisearch conversation search](https://www.librechat.ai/docs/configuration/meilisearch) is not the document vector database. A working chat-history search does not prove that file ingestion or document retrieval works.

## Start a local instance

Follow the [Docker installation](https://www.librechat.ai/docs/local/docker):

```bash
git clone https://github.com/LibreChat-AI/LibreChat.git
cd LibreChat
cp .env.example .env
```

Configure the selected chat provider and embedding provider in `.env` before starting. The RAG service's default embedding provider is OpenAI; `RAG_OPENAI_API_KEY` can supply a separate embedding credential. Configure an alternative provider when needed rather than assuming the chat model also supplies embeddings.

```bash
docker compose up -d
```

Open `http://localhost:3080` and create an account. The default Compose setup includes the RAG service and its database. Its lite image uses remote embedding services; in-process local embedding dependencies require the full RAG image described in the [RAG API guide](https://www.librechat.ai/docs/configuration/rag_api). Pin compatible images and configuration for a maintained deployment.

## Index files and retrieve evidence

Use the [file-search workflow](https://www.librechat.ai/docs/features/rag_api):

1. Select a configured model and open the message composer's **+** palette.
2. Choose **More upload options → Upload for File Search** and select a short text document.
3. Wait for indexing to complete, then ask a question about a specific passage.
4. Inspect the file-search tool activity and source references, and compare the answer with the document.

File Search exposes a tool the model calls when needed. **Upload as Text** instead places extracted text into context; it does not perform the same selective retrieval. Files attached through an OpenAI Assistants endpoint follow that provider's storage/retrieval path and cannot simply be reused as RAG API files.

For a reusable agent knowledge base, save an agent, enable File Search, and add its files in the Agent Builder. Users who can chat with that agent can query its attached knowledge, so sharing the agent is also a data-access decision.

## MCP integration

LibreChat is an [MCP client](https://www.librechat.ai/docs/features/mcp): users can enable permitted external servers in chat or attach tools to agents. Deployment-defined stdio processes belong in `librechat.yaml`; the UI-created server workflow registers remote endpoints. Choose scoped credentials and role grants independently of file-search permission. MCP connectivity does not replace the RAG API or automatically index external tool output.

## Production boundaries

Protect MongoDB, Meilisearch, and PostgreSQL as internal services. Back up application records, uploads, and vector data; a conversation export alone is not a complete recovery plan. Validate file access using different users and agent-sharing settings, including after a document is removed.

Measure extraction quality and retrieved passages before tuning generation. Scans, tables, and complex document layouts depend on the configured parsers or OCR path. Changing embedding models requires a consistent reindexing plan. A returned citation identifies evidence to inspect, not a guarantee of factual correctness.

The repository uses the [MIT license](https://github.com/LibreChat-AI/LibreChat/blob/f4154b649efa37e1345ccc517a4d8d1ed2178c82/LICENSE). Model services, external tools, and deployed dependencies retain their own terms and operational requirements.
