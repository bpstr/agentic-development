# Legacy MCP initialization

[Official 2025-11-25 lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle) · [Modern compatibility rules](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)

MCP revision 2025-11-25 uses an initialization handshake. This remains relevant for clients and servers that implement that revision. It differs from the request-scoped metadata model in revision 2026-07-28.

The client begins with its preferred version and capabilities:

```json
{
  "jsonrpc": "2.0",
  "id": "initialize-1",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {},
    "clientInfo": {"name": "legacy-client", "version": "1.0.0"}
  }
}
```

The server selects a supported version:

```json
{
  "jsonrpc": "2.0",
  "id": "initialize-1",
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {"tools": {}},
    "serverInfo": {"name": "task-server", "version": "1.0.0"}
  }
}
```

If the client supports that version, it completes initialization:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

These are synthetic wire messages. The notification has no request ID and expects no response. Normal tool operations follow the negotiated lifecycle.

## Keep revision rules together

Do not add modern `resultType` requirements or per-request capability rules to a legacy example and assume the mixture represents a third compatible protocol. Likewise, old HTTP session and event-stream behavior should not be carried into a modern implementation without the documented compatibility path.

A protocol revision, an SDK release, and a server package version are independent. Record all three when diagnosing interoperability. Updating a client dependency does not establish that the target host uses the newest wire revision.

Use captured exchanges from a controlled environment to verify negotiation, tool listing, and one actual call. A successful package installation alone tests none of those behaviors.
