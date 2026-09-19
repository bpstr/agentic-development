# Discovery and authentication

**Finding a capability and being allowed to use it are different operations.** An agent can know that a task-management server exists while lacking a token, a required scope, or access to a particular workspace.

## Four things called “discovery”

| Discovery level | Question | Mechanism |
| --- | --- | --- |
| Server directory | Where can I find an implementation? | MCP registry or curated marketplace |
| Server capabilities | Which protocol revisions and features does this endpoint expose? | Modern MCP `server/discover` |
| Tool enumeration | Which tool definitions are available to this caller? | MCP `tools/list` |
| Task-specific selection | Which few tools should the model load now? | Runtime or provider tool search |

The [official MCP Registry](https://modelcontextprotocol.io/registry/about) hosts metadata that points to packages and remote endpoints. It is currently documented as preview. Namespace verification establishes publisher identity; it is not a code audit. The registry delegates code scanning to package registries and downstream services.

[Server discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover) is a protocol request to a known server. It does not search the internet for servers. Likewise, `tools/list` supplies definitions rather than choosing the best operation for a user's task.

Tool search can keep large catalogs out of initial model context. For example, OpenAI supports deferred loading with `defer_loading` and a tool-search facility. This adds a discovery step and depends on retrieval finding the relevant tool. [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search).

## A practical loading strategy

For a small application, keep a few common tools directly available. Introduce deferred discovery after measuring problems caused by catalog size or tool selection. Recommended catalog metadata includes purpose, read/write behavior, required identifiers, and a stable source identity.

Suppose a user says “find yesterday's deployment failure.” A useful discovery result selects log search and deployment lookup. Loading every billing, calendar, and document mutation tool adds little value to this request. Measure whether the required tool appears in the retrieved shortlist and whether the agent actually chooses it.

Cache discovery within the correct authorization boundary. Two users may see different tools, and the server's available tool list can change. Do not let a shared cache expose one workspace's capabilities or descriptions to another principal. The [MCP tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) allows tool visibility to vary with request authorization.

## Authentication is its own exchange

For HTTP-based MCP authorization, the current specification describes OAuth resource servers, protected resource metadata, authorization-server discovery, and scoped access tokens. It treats authorization as optional overall; servers that expose protected operations still need an appropriate implementation. Local `stdio` integrations generally obtain credentials from their environment rather than applying the HTTP OAuth flow. [Authorization specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization).

An **illustrative, unexecuted HTTP challenge** can point a client toward metadata:

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource", scope="tasks:read"
```

Authentication establishes the principal; authorization decides whether that principal may perform this operation on this object. Enforce both in server-side application code. A tool definition's description or a model-generated workspace ID is not permission.

## Inspect before integrating

Use [MCP Inspector](https://modelcontextprotocol.io/docs/2026-07-28/tools/inspector) to inspect tool definitions, send test arguments, and examine returned errors. Test valid access, missing scope, denied object access, pagination, and an unavailable upstream service. Keep credentials out of fixtures and record the actual host/SDK/protocol versions used.

**Review:** official documentation checked **2026-09-19**. The challenge and workflow are explanatory; no OAuth login, package installation, or interoperability test was performed for this page.
