# Agent service discovery

Agent service discovery is the process of finding content, capabilities, tools, or independently executing agents that may help complete a task.

Discovery should answer **what exists and how to inspect it**. It should not silently imply permission to execute the discovered capability.

## Different artifacts discover different things

| Mechanism | Primarily discovers |
| --- | --- |
| [llms.txt](formats/llms-txt.md) | Useful site content and references |
| Markdown alternate representation | A machine-friendly form of one resource |
| [Structured web data](formats/structured-data.md) | Semantic facts and relationships |
| OpenAPI | HTTP operations and schemas |
| [MCP discovery](../infrastructure/protocols/mcp/mcp-discovery.md) | MCP servers, tools, resources, and prompts |
| A2A Agent Card | An agent service, capabilities, endpoint, and authentication metadata |
| WebMCP | Tools registered by the currently open document |
| UCP business profile | Commerce services, capabilities, versions, and transports |

These mechanisms are complementary. A documentation index should not be used as if it were an authenticated tool manifest, and a callable interface does not necessarily describe how a public client should locate it.

## Separate location, capability, and authorization

A practical discovery flow is:

1. locate a candidate service or resource;
2. obtain its capability metadata;
3. negotiate a compatible protocol or representation where needed;
4. authenticate if required;
5. enumerate only the operations available to the current caller;
6. select a task-relevant subset.

This keeps public service discovery separate from account-specific authorization.

For example, UCP businesses publish a profile at `/.well-known/ucp` that advertises versions, services, capabilities, schemas, and transports. The profile helps a platform determine how commerce interaction can proceed; the actual operation still uses the authorization and state rules of that business. See the [UCP specification](https://ucp.dev/specification/overview/).

## Cache discovery carefully

Discovery metadata often changes more slowly than transactional state and can usually be cached, but retain revision or version identity. Revalidate when a protocol version changes, an endpoint fails, authentication requirements change, or a capability disappears.

Do not send every discovered definition to a model. Discovery can produce a large catalog; [tool discovery](../infrastructure/tools/tool-discovery.md) and tool-context selection should narrow that catalog before inference.
