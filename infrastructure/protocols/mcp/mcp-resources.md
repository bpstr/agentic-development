# MCP resources

[Official resources specification](https://modelcontextprotocol.io/specification/2026-07-28/server/resources)

MCP resources expose contextual data identified by URIs. Examples include a document, database schema, or project configuration. Resources are application-driven: the host decides whether to offer a picker, attach relevant data automatically, or otherwise make it available as context.

Clients use `resources/list` to enumerate resources and `resources/read` to retrieve one. Resource templates describe parameterized URIs separately. An illustrative read:

```json
{
  "jsonrpc": "2.0",
  "id": "read-1",
  "method": "resources/read",
  "params": {
    "uri": "task://TASK-42",
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
  "id": "read-1",
  "result": {
    "resultType": "complete",
    "contents": [
      {
        "uri": "task://TASK-42",
        "mimeType": "text/plain",
        "text": "Repair login. Current status: in progress."
      }
    ]
  }
}
```

This is synthetic resource content, not a fetched task.

## Identity and access

A URI identifies the resource; it does not grant permission or require that the client fetch it through ordinary HTTP. Custom schemes can represent application entities whose contents are served through MCP.

Use MIME types to describe returned content and bound large reads. For evolving documents, preserve version or freshness information in the application representation so the host can distinguish an old excerpt from current state.

Resource listing can vary with request authorization. A server supporting update notifications can advertise subscriptions, which clients consume through the revision's subscription mechanism. Receiving a change event does not itself refresh previously inserted model context.

Resources provide data; tools perform operations. A task may reasonably have both a readable resource representation and tools for controlled mutations.
