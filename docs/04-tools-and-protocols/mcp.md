# MCP: tools and context over a shared protocol

[Handbook](../../README.md) · [Chapter](README.md)

**Model Context Protocol (MCP) standardizes how a host application communicates with servers that expose tools and context.** The host contains MCP clients; each client talks to a server. The model can propose a tool use, while software performs the protocol exchange and the server executes the operation. [MCP architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture).

**Version matters:** the official current revision checked on **2026-09-19** is **2026-07-28**. This revision carries version and capabilities on each request instead of requiring an `initialize` handshake. See [versioning](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning); the older handshake has its own [legacy example](mcp-legacy.md).

## Discover the server

These are **synthetic, unexecuted JSON-RPC messages**. They show the message bodies, not an SDK implementation. A modern client can optionally query server identity and capabilities first:

```json
{
  "jsonrpc": "2.0",
  "id": "discover-1",
  "method": "server/discover",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        "name": "handbook-client",
        "version": "1.0.0"
      },
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": "discover-1",
  "result": {
    "resultType": "complete",
    "supportedVersions": ["2026-07-28"],
    "capabilities": { "tools": {} },
    "_meta": {
      "io.modelcontextprotocol/serverInfo": {
        "name": "task-server",
        "version": "1.0.0"
      }
    }
  }
}
```

Servers must implement `server/discover`; clients need not call it before every operation. A version mismatch produces an error with supported versions so a compatible client can retry. [Discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover).

## Discover a tool, then call it

The following requests omit optional client identity for brevity but retain required version and capability metadata. [Base protocol fields](https://modelcontextprotocol.io/specification/2026-07-28/basic).

```json
{
  "jsonrpc": "2.0",
  "id": "list-1",
  "method": "tools/list",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": "list-1",
  "result": {
    "resultType": "complete",
    "tools": [{
      "name": "get_task",
      "description": "Read one task by its exact key.",
      "inputSchema": {
        "type": "object",
        "properties": { "key": { "type": "string" } },
        "required": ["key"],
        "additionalProperties": false
      }
    }]
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": "call-1",
  "method": "tools/call",
  "params": {
    "name": "get_task",
    "arguments": { "key": "TASK-42" },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": "call-1",
  "result": {
    "resultType": "complete",
    "content": [{ "type": "text", "text": "TASK-42: Repair login; in progress." }],
    "isError": false
  }
}
```

`tools/list` can paginate. Tool results can carry structured content, media, and resource references as well as text. Tool names are unique within a server; an aggregator needs a strategy for duplicate names across servers. [Tool specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools).

## Transport is a separate choice

| Transport | Typical placement | Framing |
| --- | --- | --- |
| `stdio` | A client-launched local process | Newline-delimited JSON-RPC on standard streams |
| Streamable HTTP | A separately deployed server | POST to an MCP endpoint; JSON or request-scoped SSE replies |

These are the current [standard transport bindings](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports). For the HTTP `tools/call` example, include `Content-Type: application/json`, `Accept: application/json, text/event-stream`, `MCP-Protocol-Version: 2026-07-28`, `Mcp-Method: tools/call`, and `Mcp-Name: get_task`. Header values must agree with the body. Authentication is separate. [Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http).

## Completion, notifications, and failures

A request has an ID and expects a matching response. A notification has no request ID and expects no response. Modern servers request additional client input through an `input_required` result rather than initiating their own JSON-RPC request. [Message patterns](https://modelcontextprotocol.io/specification/2026-07-28/basic).

Distinguish a protocol error from a tool's execution failure: invalid RPC parameters can produce a JSON-RPC `error`; a handled business failure can return tool content with `isError: true`. `resultType: "complete"` therefore does not by itself prove the business operation succeeded. [Error handling](https://modelcontextprotocol.io/specification/2026-07-28/server/tools#error-handling).

Use the [MCP Inspector](https://modelcontextprotocol.io/docs/2026-07-28/tools/inspector) and a compatible SDK to inspect actual exchanges. Check the revision supported by your target host; a current specification does not establish that every existing client implements it.
