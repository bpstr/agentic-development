# Tool discovery

Tool discovery finds operations that might help with a task. It has several distinct levels:

- **Implementation discovery:** find a server or package in a registry.
- **Capability discovery:** inspect what a known server supports.
- **Tool enumeration:** retrieve definitions available to the current caller.
- **Task-specific selection:** choose a useful subset for the model's current context.

A directory search does not establish that a server is reachable or authorized. Likewise, enumerating five hundred tools does not identify which one should handle a request.

## Select a useful working set

For “why did yesterday's deployment fail?”, a useful shortlist might contain deployment lookup and log search. Billing mutations and calendar tools add little. Keep a small core catalog directly available; introduce deferred loading when catalog size or selection quality justifies the additional retrieval step.

Each searchable record should include a precise purpose, required identifiers, source server, and effect. Preserve the exact schema when a tool is selected: an abbreviated search description is not enough to execute it.

OpenAI's [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) and Claude's [tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) provide concrete deferred-discovery approaches. MCP separates [server discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover) from [tool listing](https://modelcontextprotocol.io/specification/2026-07-28/server/tools).

## Measure missed capabilities

Evaluate whether the required tool appears in the shortlist and whether the model then selects it correctly. A failure to find a tool differs from invalid arguments to a correctly selected tool.

Cache catalogs within their authorization boundary, refresh changed definitions, and namespace duplicate tool names across servers. Loading a definition never grants permission to execute it.
