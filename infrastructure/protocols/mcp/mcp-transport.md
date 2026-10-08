# MCP transports

[Transport overview](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports) · [stdio](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/stdio) · [Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http) · [Subscriptions](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/subscriptions)

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

## Change-notification subscriptions

In revision 2026-07-28, `subscriptions/listen` replaces the old `resources/subscribe` operation and HTTP GET notification stream. Its explicit filter selects tool, prompt, or resource-list changes and individual resource URIs. Omitted types are not subscribed.

This synthetic exchange watches one resource. Over HTTP, send the request body to the MCP endpoint with `Mcp-Method: subscriptions/listen` and the revision headers shown above; the response is SSE. On stdio, serialize each object on one line.

```json
{
  "jsonrpc": "2.0",
  "id": "watch-42",
  "method": "subscriptions/listen",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientCapabilities": {}
    },
    "notifications": {"resourceSubscriptions": ["task://TASK-42"]}
  }
}
```

The first notification for that subscription acknowledges the supported subset, not necessarily everything requested:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/subscriptions/acknowledged",
  "params": {
    "_meta": {"io.modelcontextprotocol/subscriptionId": "watch-42"},
    "notifications": {"resourceSubscriptions": ["task://TASK-42"]}
  }
}
```

Compare the acknowledged filter with the request. Every delivered notification carries the originating request ID as `io.modelcontextprotocol/subscriptionId`; correlate by that value, especially on stdio where subscriptions interleave. A resource update identifies a URI, not replacement content: [refresh the resource separately](mcp-resources.md#resource-change-notifications).

Progress and logging for an individual operation remain on that operation's response stream, not this change-notification subscription.

## Cancellation and reconnects

Closing an HTTP SSE stream signals cancellation. For a stdio subscription, send `notifications/cancelled` referencing the listen request ID. A server ending a subscription gracefully can send its correlated `resultType: "complete"` response before closing; an abrupt disconnect has no such completion response. These behaviors are described by the [subscription lifecycle](https://go.sdk.modelcontextprotocol.io/protocol/).

Reestablish subscriptions after reconnecting; do not assume they survive a transport loss. This HTTP revision does not support `Last-Event-ID` replay. As an application recovery policy, reconcile current resource/catalog state after a gap rather than interpreting silence as proof nothing changed. Cancellation cannot undo a committed business operation.

Configure reverse proxies to avoid SSE buffering, use appropriate timeouts and heartbeat handling, and validate Origin as specified. Record the protocol revision explicitly when integrating older clients: transport names can remain the same while lifecycle behavior changes.

The [proposed Events extension](mcp-resources.md#proposed-events-extension) adds a separate upstream-event delivery contract. Its draft cursor/replay design does not change the guarantees of these released core subscriptions.
