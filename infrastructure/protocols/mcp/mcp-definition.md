# Model Context Protocol

[Official specification](https://modelcontextprotocol.io/specification/2026-07-28) · [Canonical repository](https://github.com/modelcontextprotocol/modelcontextprotocol)

Model Context Protocol (MCP) standardizes communication between an application host and servers that expose tools and contextual information. It lets different hosts integrate the same capability without adopting a custom protocol for each server.

Three server primitives serve different purposes:

- **Tools** expose callable operations, such as `get_task`.
- **Resources** expose addressable context, such as `task://TASK-42`.
- **Prompts** expose reusable message templates, such as a task-review request.

A host can present a resource picker, let the model request a tool, or allow a user to select a prompt. The protocol defines the objects and exchanges; the host chooses the product interaction.

## A concrete integration

A task server can expose a lookup tool and a project-document resource. A coding assistant uses its MCP client to list the server's tools, invoke the lookup, and attach the returned information to model context. The model does not open the network connection itself.

MCP does not supply the model, define a full agent loop, or automatically share the host's entire conversation. Nor does exposing a tool authorize every caller to use it.

The examples in this subtree use protocol revision **2026-07-28** unless explicitly marked legacy. That revision carries protocol version and client capabilities on each request and provides `server/discover` for capability inspection. Earlier revisions used an initialization handshake. Check the actual host's supported revision before copying wire examples. [Versioning and compatibility](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning).
