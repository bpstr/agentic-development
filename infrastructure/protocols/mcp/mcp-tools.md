# MCP tools

[Official tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) · [Base message rules](https://modelcontextprotocol.io/specification/2026-07-28/basic)

MCP tools expose named operations with input schemas. A client discovers definitions using `tools/list` and invokes an operation using `tools/call`. Listing may paginate and may depend on the caller's authorization.

A tool definition inside a listing can look like this:

```json
{
  "name": "get_task",
  "description": "Read a task by its exact key.",
  "inputSchema": {
    "type": "object",
    "properties": {"key": {"type": "string"}},
    "required": ["key"],
    "additionalProperties": false
  }
}
```

An illustrative revision 2026-07-28 call and result:

```json
{
  "jsonrpc": "2.0",
  "id": "call-1",
  "method": "tools/call",
  "params": {
    "name": "get_task",
    "arguments": {"key": "TASK-42"},
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
    "content": [{"type": "text", "text": "TASK-42 is in progress."}],
    "isError": false
  }
}
```

The JSON-RPC response ID correlates this exchange. It is separate from any model-provider tool-call ID used by the host.

## Interpret results

Tool results can include structured content and media or resource references. Respect a declared output schema when present. Preserve structured fields that the product needs instead of parsing them back from prose.

A JSON-RPC error represents a protocol-level failure. A handled tool execution failure can instead return `isError: true`. Consequently, `resultType: "complete"` does not alone establish business success.

The server must validate arguments and enforce authorization even when a model follows the schema perfectly. Annotations describing read-only or destructive behavior are hints for consumers, not security enforcement. Multiple servers can expose identical tool names; the host must retain server identity during dispatch.

## Draft out-of-band file transfer

The maintainers' [November 10, 2026 file-transfer proposal](https://blog.modelcontextprotocol.io/posts/exploring-file-uploads-and-downloads-in-mcp/) explores `io.modelcontextprotocol/files` for transferring artifacts without placing the bytes in model context. It is **draft**, not a released or mandatory extension. A schema marks a file argument with `x-mcp-file`; after authorization and quota checks, the server can return `resultType: "upload_required"`, an expiring upload target and `requestState`. The client transfers the bytes directly and retries with the unchanged continuation state. Download targets likewise keep bulk data outside JSON-RPC. Validate file size, MIME type, destination, digest where required, and credential policy; never send MCP credentials to arbitrary storage URLs. A successful upload is not proof the subsequent business operation completed. Treat the proposed wire contract as experimental until its lifecycle and SDK support are confirmed.
