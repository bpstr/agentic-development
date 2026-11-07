# Onyx

[Official documentation](https://docs.onyx.app/) · [Repository](https://github.com/onyx-dot-app/onyx) · [Connector overview](https://docs.onyx.app/overview/core_features/connectors)

Onyx, formerly Danswer, is a knowledge retrieval application that connects organizational sources to search, grounded chat, and agents. Its connectors ingest documents into an index; query-time retrieval finds material for a user or an agent. It is useful when the required product includes source synchronization, document access, search interfaces, and administration around retrieval, rather than only a retrieval library embedded in another application.

## Choose an indexed deployment

The [deployment overview](https://docs.onyx.app/deployment/overview) distinguishes **Standard**, which includes document indexing and background synchronization, from **Lite**, which supports chat and other tools without the indexing services. Choose Standard for a connector-backed knowledge base.

With `uv` installed, the [official installer](https://docs.onyx.app/deployment/getting_started/quickstart) starts a guided Docker Compose deployment:

```bash
uv tool install onyx-cli
onyx-cli deploy install
onyx-cli deploy status
```

Select Standard and an explicit release in the prompts. The installer checks prerequisites, prepares deployment configuration, starts containers, and waits for health checks. Use `onyx-cli deploy logs` for diagnosis. Configure a generation provider and the desired embedding setup before evaluating grounded answers; [connector processing](https://docs.onyx.app/overview/core_features/connectors) can use local models, while selecting external embedding or generation providers changes where content is processed.

Current deployment architecture differs from older descriptions. The [OpenSearch migration guide](https://docs.onyx.app/admins/advanced_configs/opensearch_document_index_migration) identifies OpenSearch as the document index in v5, with Vespa removed in v4. The [object-store migration guide](https://docs.onyx.app/admins/advanced_configs/object_store_migration) describes the transition from bundled MinIO to SeaweedFS. Existing external object storage follows a different path. Follow the release's migration procedure instead of replacing services in an old Compose file by name.

## Ingest a small corpus

Start with a text or Markdown document containing a known procedure. The [File connector](https://docs.onyx.app/admins/connectors/official/file) provides a minimal indexing lifecycle without external-account setup:

1. In the admin panel, open **Connectors → File** and upload the document.
2. Set **Document Access** deliberately, then create the connector. For an initial check, use content appropriate for the selected audience.
3. Inspect its indexing status before searching. A configured connector is not proof that its documents have finished indexing.
4. Open the connector's Files section to add or remove documents later. Onyx indexes additions and removes deleted files.

The File connector can read an `ONYX_METADATA` line in a text file to preserve a source link, title, ownership, or update time. This metadata supports attribution and filtering; an ownership field is not a source-permission synchronization mechanism. Uploaded files have no external permission sync, and everyone with access to the connector's documents can see every uploaded file.

For continuing synchronization from a remote system, select its connector and follow that connector's authentication, scope, and permission instructions. Document sets organize retrieved content and agent scope; they do not prove that source access restrictions were imported correctly.

## Search, then generate an answer

The [CLI](https://docs.onyx.app/overview/onyx_anywhere/cli) can query the deployed server. Create a personal access token under **Settings → Accounts & Access → Access Tokens**. First-run chat setup asks for the server URL and token:

```bash
onyx-cli chat
```

After completing setup and leaving the interactive session:

```bash
onyx-cli validate-config
onyx-cli search "deployment rollback procedure"
onyx-cli ask "What is the documented rollback procedure?"
```

`search` returns ranked documents without generating an answer; `ask` requests a response. Compare the retrieved source with the answer, including an absent-answer question. The CLI also supports agent selection so that a query uses a particular agent's knowledge scope. The [search interface](https://docs.onyx.app/overview/core_features/internal_search) provides source and time filters and citation inspection. An [MCP server](https://docs.onyx.app/overview/onyx_anywhere/mcp_server) makes Onyx knowledge available to external agents through the user's authenticated access.

## Access and production boundaries

The [repository license at revision `a757433`](https://github.com/onyx-dot-app/onyx/blob/a757433ddef3b75a4286e026ee943c6bc63950bc/LICENSE) uses MIT Expat outside enterprise directories and third-party exceptions; `ee` directories have the Onyx Enterprise License. The connector overview documents automatic source permission sync as an Enterprise feature. Availability and behavior also depend on the connector. Do not assume Community Edition mirrors remote ACLs.

[Document visibility and administration permissions](https://docs.onyx.app/admins/permissions/understanding_permissions) are distinct. Group restrictions and custom permissions are plan-dependent. Verify access with representative ordinary users, including after a source permission is revoked, and monitor connector failures and stale indexes.

Back up uploaded file bodies as well as database state and search configuration. The object-store guide notes that PostgreSQL holds file references and the search index does not retain the sole authoritative copy of uploaded files. A rebuildable index cannot replace a lost document corpus.

