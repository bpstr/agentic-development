# MCP architecture

[Official architecture](https://modelcontextprotocol.io/specification/2026-07-28/architecture) · [Base protocol](https://modelcontextprotocol.io/specification/2026-07-28/basic)

MCP separates the host application, its clients, and capability servers. The host owns the user interaction and model integration. A client implements communication with a particular server. The server exposes focused capabilities and enforces access to its underlying systems.

For example, one development host can maintain clients for a task server and a source-code server. The task server should receive the arguments needed for a task lookup, not implicit access to the code server or the full conversation. The host controls what information crosses each boundary.

## Request-scoped capabilities

Under revision 2026-07-28, clients include protocol version and supported client features in request metadata:

```json
{
  "_meta": {
    "io.modelcontextprotocol/protocolVersion": "2026-07-28",
    "io.modelcontextprotocol/clientInfo": {
      "name": "reference-client",
      "version": "1.0.0"
    },
    "io.modelcontextprotocol/clientCapabilities": {}
  }
}
```

This is a request-parameters fragment. Version and client capabilities are required; client identity is recommended and self-reported. Do not use the claimed client name as an authentication mechanism.

Server capabilities are available through `server/discover`. Additional client input, such as elicitation or sampling, follows the revision's `input_required` result mechanism instead of independent server-initiated RPC requests.

## Responsibilities remain local

The host decides how tool descriptions enter model context and how results appear to the user. The server validates arguments and authorizes access. An aggregator additionally needs stable server identities and a collision policy for tools with the same name.

MCP interoperability does not require all servers to run remotely. Local processes and separately deployed services implement the same conceptual roles through different transports.
