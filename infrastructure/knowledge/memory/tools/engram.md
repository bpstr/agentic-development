# Engram

[Official repository](https://github.com/aiconnai/engram) · [Repository integration guide](https://github.com/aiconnai/engram/blob/main/docs/USING_ENGRAM_IN_A_REPO.md) · [MCP tool reference](https://github.com/aiconnai/engram/blob/main/docs/MCP_TOOLS.md)

Engram is an [MIT-licensed](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/LICENSE) Rust memory engine with local SQLite storage, a CLI, and an MCP server. It implements [durable agent memory](../long-term-memory.md): storing decisions, conventions, and other selected knowledge so later sessions can retrieve them.

Use it when coding agents or applications need a persistent, inspectable store alongside their existing model and orchestration system. A memory server does not automatically preserve an entire conversation, choose which facts deserve retention, or resume unfinished work; the surrounding application must define those behaviors.

## Storage and retrieval

Engram uses SQLite with write-ahead logging and combines keyword, vector, and fuzzy retrieval. Its [repository guide](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/docs/USING_ENGRAM_IN_A_REPO.md) describes three embedding choices:

| Configuration | What it supplies | Boundary |
| --- | --- | --- |
| Default `tfidf` | Local text-derived vectors without a model download | A lexical representation, not learned semantic embeddings. |
| `local` | Local neural embeddings | Requires the optional `local-embeddings` build feature and model artifacts. |
| `openai` | Remote embedding generation | Requires credentials and sends embedding inputs to the configured provider. |

The project also exposes graph relationships, retention controls, and conflict-related tools. These complement [memory retrieval](../memory-retrieval.md); they do not make stored claims authoritative or automatically resolve conflicting instructions correctly.

Implementation details below refer to [revision `7ca7a9b8fad6`](https://github.com/aiconnai/engram/commit/7ca7a9b8fad666e099d083622a3d8115c9abdde9). The package manifest declares `engram-core` 0.24.0; this identifies the inspected source, not a claim about the newest published registry release.

## Install the inspected implementation

The [manifest](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/Cargo.toml) defines separate `engram-server` and `engram-cli` binaries. Use the repository's [pinned Rust toolchain](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/rust-toolchain.toml) for this source checkout:

```bash
git clone https://github.com/aiconnai/engram.git
cd engram
git checkout 7ca7a9b8fad666e099d083622a3d8115c9abdde9
cargo install --path . --locked --bin engram-server --bin engram-cli
engram-server --help
engram-cli --version
```

Ensure Cargo's binary directory is on `PATH`. Upstream also documents registry and Homebrew installation; releases can differ from repository head, so confirm commands and enabled features for the version actually installed.

## Store and retrieve a memory

Use a separate database for the example:

```bash
mkdir -p "$HOME/.local/share/engram-reference"
export ENGRAM_DB_PATH="$HOME/.local/share/engram-reference/memories.db"
export ENGRAM_EMBEDDING_MODEL=tfidf

engram-cli create "Use UTC for persisted timestamps." --type decision --tags example,datetime
engram-cli search "persisted timestamps" --limit 8 --explain
engram-cli list --limit 8
```

These commands follow the inspected [CLI argument definitions](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/src/bin/cli/args.rs). The create command is `create`; the README's `store` example and its `--workspace` flag do not match this CLI revision. Use separate database paths for CLI examples requiring project separation, or use the workspace-aware MCP operations.

| CLI operation | Purpose |
| --- | --- |
| `create CONTENT --type decision --tags TAGS` | Store a typed memory with comma-separated tags. |
| `search QUERY --limit 8 --explain` | Retrieve matches and explanations. |
| `get ID` | Read a stored record using its returned identifier. |
| `delete ID` | Delete a selected memory. |
| `stats` | Inspect database statistics. |

Storage and indexing are distinct. [CLI creation queues an embedding job](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/src/bin/cli/core.rs); the [server's background drain](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/src/bin/server.rs) processes queued embeddings. A CLI-only create/search sequence exercises persistence and keyword retrieval, not proof that neural embeddings have been generated or indexed. Keep the server running when relying on that background processing, and inspect its completion and failures.

## Connect an agent through MCP

For a host that accepts the common `mcpServers` JSON format, configure a stdio server. Replace the database path with the same **absolute path** used above; JSON environment values are not shell commands.

```json
{
  "mcpServers": {
    "engram": {
      "command": "engram-server",
      "args": ["--transport", "stdio"],
      "env": {
        "ENGRAM_DB_PATH": "/absolute/path/to/engram-reference/memories.db",
        "ENGRAM_EMBEDDING_MODEL": "tfidf",
        "ENGRAM_TOOL_TIER": "standard"
      }
    }
  }
}
```

The MCP host starts the process and manages protocol initialization. Configure the equivalent server entry in hosts with another configuration format.

The [repository integration guide](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/docs/USING_ENGRAM_IN_A_REPO.md) demonstrates `memory_create` with `content`, `memory_type`, `tags`, and `workspace`, followed by `memory_search` with `query`, `limit`, and the same `workspace`. The CLI example uses its default workspace; pass an explicit project workspace in MCP calls when separating multiple projects.

The server advertises a small `essential` tool profile by default. This example selects `standard` to expose the [`memory_search` tool](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/src/mcp/tools/catalog/search.rs). Use `tools/list` and `discover_tools` to inspect the running build; changing the exposure profile does not compile optional features into it.

Applications can also use the HTTP JSON-RPC endpoint at `POST /mcp`; the server supports `--transport http` and `--transport both`. At the inspected revision, **stdio is the default**. Prefer the verified MCP contract when an SDK example does not match the installed server.

## Operating boundaries

- **Recall quality:** choose what to store, retain source references, and separate observations from accepted decisions. Treat conflict detection and quality scores as signals for review. A memory's `decision` type is distinct from its retention tier; define expiry and correction through the [memory lifecycle](../memory-lifecycle.md).
- **Retrieval cost:** the [server configuration](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/src/bin/server.rs) defaults to an exact vector scan; an in-memory HNSW index is opt-in through `ENGRAM_HNSW_ENABLED`. Measure recall, latency, index freshness, and memory use with the selected mode. Upstream [search measurements](https://github.com/aiconnai/engram/blob/7ca7a9b8fad666e099d083622a3d8115c9abdde9/docs/harness/decisions/phase2-2-search-vector-bottleneck-sqlite-vec-2026-06-07.md) distinguish keyword performance from the costlier vector path; do not transfer one path's timing to another.
- **Locality:** TF-IDF can operate without a remote embedding service. Choosing remote embeddings or cloud backup changes the data flow. The agent's own model provider remains a separate boundary.
- **Access:** stdio inherits the launching user's local authority. For a shared HTTP deployment, configure authentication and transport protection, and enforce which callers may access each workspace. A workspace name alone is not an authorization policy.
- **Durability:** keep the database out of source control, use SQLite-consistent backups, test restoration, and account for replicas and backups in deletion policy. Stored records and derived indexes have different recovery requirements.
- **Compatibility:** verify CLI help, exposed MCP schemas, and build features after upgrades. The upstream documentation contains examples that differ from this inspected implementation; avoid treating the whole feature catalog as enabled and tested in every binary.
