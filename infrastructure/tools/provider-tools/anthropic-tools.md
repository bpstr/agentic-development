# Anthropic tool execution

[Official tool overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview) · [Handling tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) · [Web search](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)

Claude distinguishes client tools, implemented by the application, from server tools executed by Anthropic. Both participate in structured message content, but their execution owners and result types differ.

## Define a client tool

This illustrative definition belongs in a Messages request's `tools` array:

```json
{
  "name": "get_task",
  "description": "Read a task by its exact key.",
  "input_schema": {
    "type": "object",
    "properties": {"key": {"type": "string"}},
    "required": ["key"],
    "additionalProperties": false
  }
}
```

When Claude returns a `tool_use` block, validate its structured input and execute the corresponding allowlisted handler. Return a `tool_result` with the matching `tool_use_id`. Preserve the assistant's full content before adding the result message.

The `anthropic` SDK supplies the Messages client; the application still owns its credentials, authenticated user context, and function implementation. SDK tool runners can automate dispatch, but do not know the application's object-level permissions.

## Server tools

Anthropic's hosted search and execution capabilities have versioned tool definitions, model compatibility rules, and specific output blocks. Follow the selected tool's guide rather than copying an old type identifier into a new integration.

Some branded tools, including interfaces to application-controlled computers or shells, require local execution. Do not infer hosting from the tool's name.

Handle output limits and tool errors explicitly. A stopped generation, a successful tool invocation, and a successfully completed business operation are separate outcomes.
