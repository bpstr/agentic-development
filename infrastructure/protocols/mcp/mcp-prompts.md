# MCP prompts

[Official prompt specification source](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/server/prompts.mdx) · [Base message rules](https://modelcontextprotocol.io/specification/2026-07-28/basic)

MCP prompts expose reusable message templates with optional arguments. They are intended for explicit user selection, such as choosing a review command. The host determines how the user selects and applies them.

Clients discover templates with `prompts/list` and retrieve a resolved prompt with `prompts/get`. An illustrative revision 2026-07-28 request:

```json
{
  "jsonrpc": "2.0",
  "id": "prompt-1",
  "method": "prompts/get",
  "params": {
    "name": "review_task",
    "arguments": {"task_key": "TASK-42"},
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
  "id": "prompt-1",
  "result": {
    "resultType": "complete",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Review TASK-42 for missing acceptance criteria."
        }
      }
    ]
  }
}
```

Fetching this template does not run the review, retrieve the task, or call a model. The host must decide how the returned messages enter an actual model request.

## Trust and composition

Prompt arguments are strings defined by the template contract. Validate them before resolving resources or inserting sensitive content. If prompt resolution reads private data, ordinary authorization still applies.

A server-supplied prompt is not automatically a privileged system instruction. Preserve its source and role when integrating it with application instructions. A template that includes retrieved user content must not let that content override the host's policies.

Prompt templates differ from executable tools and packaged agent skills. They provide message content through MCP, while skills can include broader reusable guidance and supporting files whose loading behavior belongs to a host-specific skill system.
