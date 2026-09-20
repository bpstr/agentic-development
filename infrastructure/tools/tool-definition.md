# Tools

A tool is an operation that an agent runtime can invoke through a defined interface. It connects generated decisions to capabilities such as searching records, reading files, calculating values, or updating a task. The model receives a description of the operation; an executor provides its implementation.

A useful definition states the operation's name, purpose, arguments, and expected result. For example, this application-level description separates one exact lookup from a broad search:

```json
{
  "name": "get_task",
  "description": "Read a task by its exact visible key.",
  "input_schema": {
    "type": "object",
    "properties": {"key": {"type": "string"}},
    "required": ["key"],
    "additionalProperties": false
  }
}
```

This is an illustrative application schema, not a universal wire format. Providers and protocols encode definitions differently: [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling) uses `parameters`; [MCP tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools) uses `inputSchema`.

## Design a clear contract

Prefer operations with specific effects and explicit identities. A task lookup should return the task key, relevant fields, and a useful failure when it is unavailable. A status update should state whether it changes only status or also assigns work, triggers notifications, or schedules follow-up actions.

Separate model-supplied arguments from trusted execution context. The authenticated user and workspace usually come from the application, not from arguments the model chooses.

A tool is not inherently a remote service. It may be a local function, a sandboxed command, an HTTP operation, or an MCP call. Its transport and location do not determine whether it is read-only, authorized, or safe to retry.
