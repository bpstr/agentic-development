# Tool calling: from a proposed operation to a result

[Handbook](../../README.md) · [Chapter](README.md)

**A custom function call is a request to execute code.** Registering a schema does not move your implementation into the model. Your application or chosen runtime must dispatch it. Provider-hosted tools are a different execution arrangement: Anthropic explicitly distinguishes [client and server tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview).

## Follow one read operation

All payloads below are **synthetic, unexecuted examples**, reviewed **2026-09-19** against [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling). First include this definition in a Responses request's `tools` array:

```json
{
  "type": "function",
  "name": "get_task",
  "description": "Read one task by its exact visible task key.",
  "strict": true,
  "parameters": {
    "type": "object",
    "properties": { "key": { "type": "string" } },
    "required": ["key"],
    "additionalProperties": false
  }
}
```

The model may return this output item:

```json
{
  "type": "function_call",
  "id": "fc_example_1",
  "call_id": "call_example_1",
  "name": "get_task",
  "arguments": "{\"key\":\"TASK-42\"}"
}
```

The executor parses and validates the arguments, checks access to `TASK-42`, reads the task, and supplies a matching input item on continuation:

```json
{
  "type": "function_call_output",
  "call_id": "call_example_1",
  "output": "{\"key\":\"TASK-42\",\"title\":\"Repair login\",\"status\":\"in_progress\"}"
}
```

Continue using the prior response's ID or a correctly preserved input history, and supply the tools still available for the next step. The matching key is `call_id`, not the output item's `id`. The next response may request more tools or provide the answer; one tool call does not imply that the turn is over.

## Know who executes the operation

| Configuration | Tool execution owner | What your application handles |
| --- | --- | --- |
| Custom function in a model request | Your dispatcher or SDK runtime | Validating, authorizing, executing, returning output |
| Provider-hosted search or execution tool | Provider | Configuration, returned results, cost and policy |
| Provider's remote MCP connector | Provider's MCP client calls your server | MCP server behavior, permissions, credentials, connector events |
| MCP client inside your worker | Your MCP client calls the server | Protocol lifecycle, dispatch, results, continuation |

For the third arrangement, OpenAI documents that its API calls the remote server and returns an `mcp_call` item. This differs from receiving a custom `function_call` that your code must execute. [Remote MCP behavior](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

## Design the executor as ordinary application code

These are recommended implementation checks, independent of provider:

- Dispatch only registered names. Do not convert a requested name into arbitrary code or an unrestricted URL.
- Resolve identity and workspace scope from authenticated application state; validate every referenced object.
- Give each operation a time budget and a bounded result. Prefer a useful excerpt and a retrievable reference over dumping a whole database record set.
- Return actionable errors such as “task no longer exists” or “status transition rejected.” Do not describe an attempted action as completed.
- Protect writes with an application operation key and a stored receipt. A provider call ID helps correlate one exchange; it need not identify the same business action after a retry creates a new call.
- Run independent reads concurrently when useful. Preserve ordering for dependent operations and competing writes.

In a failure drill, interrupt the worker after a write commits but before the model sees the result. A sound executor can recover the receipt and continue without repeating the write. This is more informative than testing only a successful text response.

The [offline tool-loop example](../../examples/tool-loop/) makes the control flow inspectable without credentials. Use live contract tests separately when validating a provider integration.
