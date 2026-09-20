# Protocols in agentic systems

A protocol defines the messages, meanings, and interaction rules shared by independent components. It can specify discovery, request correlation, capabilities, errors, and lifecycle behavior. A transport describes how those messages travel; a schema describes their structure.

Different protocols serve different boundaries:

| Boundary | Representative interface | Meaning of an exchange |
| --- | --- | --- |
| Application to model | Provider inference API | Generate output from context |
| Host to tool or context server | MCP | Discover and invoke capabilities |
| Client to independent agent service | A2A | Delegate work and retrieve its outcome |
| Agent backend to frontend | AG-UI | Present messages, tool progress, and state |
| Web page to a browser agent | WebMCP | Expose operations in a live document |

These categories can coexist. A support backend may delegate research over A2A, let the research service retrieve documents through MCP, and present progress through an AG-UI adapter. The combination is an architectural example, not a requirement to adopt every interface.

## Identify the contract

Record the protocol revision, transport, supported features, authentication scheme, and participating SDK versions. A product that supports MCP tools may not expose MCP resources. A library that parses JSON-RPC does not necessarily implement MCP's capability and authorization rules.

Preserve distinct identities for conversations, runs, requests, tool calls, and business operations. Their scopes differ even when all happen to be strings.

Choose a shared protocol when independent implementations need interoperability. A documented internal API can be sufficient when both ends evolve together. [MCP architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture), [A2A and MCP](https://a2a-protocol.org/latest/topics/a2a-and-mcp/), [AG-UI overview](https://docs.ag-ui.com/introduction).
