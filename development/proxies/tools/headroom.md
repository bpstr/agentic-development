# Headroom

Canonical repository: [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom). Official documentation: [docs.headroomlabs.ai](https://docs.headroomlabs.ai/).

Headroom is a local-first context optimization layer for LLM applications and coding agents. It reduces the amount of context sent to a model by compressing tool output, logs, database results, file reads, retrieval results, API responses, and other verbose inputs before inference.

The important distinction is that Headroom is not a model and does not replace the agent runtime. It sits between an agent or application and the model provider, transforming context so the provider receives fewer tokens.

## What it does

Headroom can be used in several ways:

| Mode | Purpose |
| --- | --- |
| Local proxy | Intercepts OpenAI- or Anthropic-style model traffic and compresses context without changing application code |
| Agent wrapper | Starts supported coding agents through the Headroom proxy |
| Python / TypeScript library | Calls compression directly from application code |
| MCP server | Exposes compression, retrieval, and statistics capabilities to MCP clients |
| SDK middleware | Wraps supported model SDKs and framework integrations |
| Shared memory | Stores reusable context across agents with deduplication |
| Failure learning | Mines failed coding-agent sessions and writes reusable corrections into agent instruction files |

Compression is most valuable when an agent repeatedly produces large, redundant tool results. Short prompts, already-dense inputs, or small conversations may see little benefit.

## How context compression works

Headroom routes different content types to specialized compression strategies. Its documented pipeline includes handling for structured JSON, logs, search results, plain text, and optionally source code.

A typical local flow is:

```text
coding agent / application
        |
        | tool output, files, logs, retrieved context
        v
     Headroom
        |
        | compressed context
        v
   model provider
```

Headroom's current design compresses the new or "live" portion of context rather than dropping the complete conversation history. This helps preserve provider-side prompt caching while reducing large newly generated tool payloads.

Compression can also be reversible through Headroom's CCR mechanism: original content is cached locally and can be retrieved when the compressed representation is insufficient.

## Basic local setup

The CLI is distributed through the Python package. The project recommends an isolated `uv` tool install for local development:

```bash
uv tool install --python 3.13 "headroom-ai[all]"
headroom --version
```

Start the local proxy:

```bash
headroom proxy --port 8787
```

An OpenAI-compatible application can then use the local endpoint:

```bash
OPENAI_BASE_URL=http://localhost:8787/v1 your-app
```

For an Anthropic-compatible client:

```bash
ANTHROPIC_BASE_URL=http://localhost:8787 your-app
```

Check runtime statistics through the local proxy:

```bash
curl http://localhost:8787/stats
```

The proxy performs context optimization locally, while the actual model inference may still happen at the configured remote provider.

## Coding-agent wrappers

Headroom can wrap supported coding tools so their model traffic passes through the local compression layer. The repository currently documents integrations for tools including Claude Code, Codex, Cursor, GitHub Copilot, Aider, OpenCode, Cline, Continue, Goose, OpenHands, and others.

The general form is:

```bash
headroom wrap codex
```

or:

```bash
headroom wrap claude
```

Use the matching unwrap command to restore the tool configuration:

```bash
headroom unwrap codex
```

Wrapper support varies by client. Verify authentication, streaming, tool calls, model selection, and cancellation behavior before depending on a wrapper in production workflows.

## MCP mode

Headroom can also run as an MCP server. Its documented MCP surface includes operations for compression, retrieval of original content, and compression statistics.

This is useful when the agent host supports MCP but its provider traffic cannot or should not be routed through a transparent proxy.

For Codex and other clients that do not inherit the interactive shell's `PATH`, configure the absolute path returned by:

```bash
command -v headroom
```

rather than assuming the MCP host can resolve `headroom` automatically.

## Application integration

Python applications can use Headroom directly:

```bash
pip install headroom-ai
```

TypeScript applications can install the SDK with:

```bash
npm install headroom-ai
```

The TypeScript SDK uses a local Headroom proxy for the compression pipeline, so the proxy must be available while the application runs.

Headroom also documents integrations for the OpenAI and Anthropic SDKs, Vercel AI SDK, LiteLLM, LangChain, Agno, Strands, ASGI applications, and other agent stacks.

## Shared memory and learning

Headroom provides two features beyond request compression:

- **Cross-agent memory** can keep reusable context in a shared local store across supported agents while deduplicating repeated information.
- **`headroom learn`** can inspect failed agent sessions and write learned corrections to files such as `CLAUDE.local.md`, `CLAUDE.md`, `AGENTS.md`, or `GEMINI.md`.

These features change Headroom from a pure proxy into part of the local agent-development environment. Treat generated instruction updates as code changes: review them before sharing or committing them.

## When it is useful

Headroom is particularly relevant for:

- coding agents that repeatedly read large files or command output;
- long-running sessions with large tool-result payloads;
- retrieval-heavy agents;
- workflows using multiple coding agents against similar context;
- local development where token usage, latency, and provider context limits are becoming bottlenecks;
- debugging how much context a tool-heavy agent actually sends to the model.

It is less useful for small conversational prompts or workloads where context is already compact.

## Operational considerations

Headroom is local-first, but a local proxy does not imply local inference. Provider-bound requests still leave the machine unless the configured model itself runs locally.

The project enables an anonymous telemetry beacon by default for compression statistics and environment metadata. According to its documentation, it does not send prompts, completions, code, or file paths. It can be disabled with:

```bash
HEADROOM_BEACON=off
```

or:

```bash
DO_NOT_TRACK=1
```

When evaluating Headroom, measure more than token reduction. Compare answer quality, tool-call correctness, latency, cache behavior, retrieval fidelity, and total request cost against an uncompressed baseline.

## Related concepts

- [Model and agent proxies](../proxy-definition.md)
- [Context compaction](../../../infrastructure/context/context-compaction.md)
- [Context budgets](../../../infrastructure/context/context-budget.md)
- [Context caching](../../../infrastructure/inference/context-caching.md)
- [Agent cost](../../../operations/performance/cost.md)
- [Token usage](../../../operations/observability/token-usage.md)
- [Model Context Protocol](../../../infrastructure/protocols/mcp/mcp-definition.md)
