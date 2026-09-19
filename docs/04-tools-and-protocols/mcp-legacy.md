# Legacy MCP initialization

[Handbook](../../README.md) · [Chapter](README.md)

**This page documents revision 2025-11-25, not the current 2026-07-28 request model.** It exists because integrations and tutorials using the initialization handshake remain relevant when connecting older clients. See the [current MCP chapter](mcp.md) before copying a wire example.

Under the legacy lifecycle, the client first sends `initialize` with its preferred supported protocol version, capabilities, and implementation identity. The server answers with a selected version and its capabilities. The client verifies compatibility and sends `notifications/initialized` before normal operations. [Official 2025-11-25 lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle).

The following is a **synthetic, unexecuted legacy exchange**:

```json
{
  "jsonrpc": "2.0",
  "id": "initialize-1",
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {},
    "clientInfo": { "name": "legacy-client", "version": "1.0.0" }
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": "initialize-1",
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": { "tools": {} },
    "serverInfo": { "name": "task-server", "version": "1.0.0" }
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

The notification has no ID because it does not request a reply. After initialization, the client may use the negotiated capabilities, for example `tools/list` and `tools/call`. If the returned protocol version is unsupported by the client, it should disconnect rather than interpret messages using an assumed format.

## Do not mix revision-specific rules

| Concern | Legacy 2025-11-25 | Modern 2026-07-28 |
| --- | --- | --- |
| Version and capabilities | Initialization handshake | Per-request `_meta` |
| Initial server discovery | Initialization result | Optional `server/discover` request |
| Completed result marker | No modern `resultType` requirement | `resultType: "complete"` |
| Additional client input | Negotiated server-initiated request features | `input_required` result pattern |

The [current compatibility rules](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning) describe implementations that support both eras and the transport-specific fallback behavior. Do not implement a blanket fallback on every error: a recognized modern version error should be handled as a version mismatch, not mistaken for an older server.

For maintenance, record three independent versions in an integration note: the protocol revision, the client SDK package, and the server package. Updating the package number does not by itself tell a reviewer which protocol revision the target host negotiated. Keep a short captured exchange from your own test environment when establishing interoperability.

**Review:** source-checked **2026-09-19**. This repository has not run this handshake against a server; the example explains the legacy contract.
