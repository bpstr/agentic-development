# MCP transports

[Transport overview](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports) · [stdio](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio) · [Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)

A transport carries MCP's JSON-RPC messages. The standard bindings cover local process communication and separately deployed HTTP servers.

**stdio** sends one newline-delimited JSON-RPC message per line. A host commonly launches the server as a child process. Standard output carries protocol traffic; diagnostic logging belongs on standard error so log messages do not corrupt the stream.

**Streamable HTTP** uses one MCP endpoint. In revision 2026-07-28, each request is a POST and receives either JSON or an SSE stream scoped to that request. This revision removes the older GET stream endpoint and protocol-level sessions.

## HTTP example

This illustrative request lists tools:

```http
POST /mcp HTTP/1.1
Host: tools.example.com
Content-Type: application/json
Accept: application/json, text/event-stream
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/list

{"jsonrpc":"2.0","id":"list-1","method":"tools/list","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}
```

Headers mirror selected body fields and must agree with them. Calls to `tools/call`, `resources/read`, and `prompts/get` also require `Mcp-Name` derived from the relevant name or URI. Protected endpoints require the appropriate authentication.

## Lifecycles differ

In this HTTP revision, closing a request's SSE stream signals cancellation; resumable streams through `Last-Event-ID` are not supported. A cancellation signal still cannot undo a committed business operation.

Long-lived change notifications use `subscriptions/listen`. Configure reverse proxies to avoid buffering events, and validate Origin as specified. Record the protocol revision explicitly when integrating older clients: transport names can remain the same while lifecycle behavior changes.
