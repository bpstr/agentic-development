# MCP discovery

[Official server discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover) · [Versioning](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)

MCP server discovery inspects a known endpoint's supported protocol versions, capabilities, and identity. It differs from searching a registry for a server and from listing the tools available on that server.

Under revision 2026-07-28, servers implement `server/discover`. Clients can call it before another operation:

```json
{
  "jsonrpc": "2.0",
  "id": "discover-1",
  "method": "server/discover",
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
  "id": "discover-1",
  "result": {
    "resultType": "complete",
    "supportedVersions": ["2026-07-28"],
    "capabilities": {"tools": {}, "resources": {}},
    "_meta": {
      "io.modelcontextprotocol/serverInfo": {
        "name": "task-server",
        "version": "1.0.0"
      }
    }
  }
}
```

This synthetic response advertises tools and resources; the client still calls their listing operations to learn the actual available objects.

## Compatibility is explicit

Clients do not have to discover before every request. They can make an operation request and handle a supported-version error. Clients bridging modern and legacy stdio servers use the documented discovery probe and fallback rules.

Do not treat every connection error as evidence of an older protocol. Invalid credentials, a missing endpoint, and a recognized version mismatch require different responses.

Server identity in `serverInfo` is self-reported. It is useful for display and diagnosis, but does not verify the publisher or authorize a connection.

Cache capabilities according to the server's cache contract and the relevant identity boundary. A capability flag says a feature exists; it does not guarantee that a particular user can read every resource or call every tool.
