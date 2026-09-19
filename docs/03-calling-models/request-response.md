# Requests, responses, and structured output

[Handbook](../../README.md) · [Chapter](README.md)

**A model API exchanges structured items, even when the interface looks like a chat box.** Text is one possible item; tools, images, refusals, and reasoning-related items can occupy the same response. Write consumers around item types rather than assuming the first array element contains the answer. OpenAI's [Responses migration guide](https://developers.openai.com/api/docs/guides/migrate-to-responses) explains its item-based representation.

## A minimal inference exchange

The following request body is an **illustrative, unexecuted** OpenAI Responses example, reviewed **2026-09-19**. Send it to `POST https://api.openai.com/v1/responses` with server-side bearer authentication and `Content-Type: application/json`.

```json
{
  "model": "gpt-6-astra",
  "instructions": "Explain software terms in one plain sentence.",
  "input": "What is a tool call?"
}
```

An **abbreviated synthetic response** could contain:

```json
{
  "id": "resp_example_1",
  "status": "completed",
  "output": [
    {
      "id": "msg_example_1",
      "type": "message",
      "role": "assistant",
      "status": "completed",
      "content": [
        {
          "type": "output_text",
          "text": "A tool call requests that software perform an operation and return its result.",
          "annotations": []
        }
      ]
    }
  ]
}
```

Real responses contain additional fields. SDK conveniences such as `response.output_text` collect text for you; they should not be confused with the complete wire representation. Retain the response ID and inspect terminal status, errors, and usage when handling an actual request. [Official response examples](https://developers.openai.com/api/docs/guides/migrate-to-responses).

## The schema is provider-specific

| Concept | OpenAI Responses | Anthropic Messages |
| --- | --- | --- |
| User context | `input` | `messages` |
| Application instructions | `instructions`, or appropriate input roles | Top-level `system` for the basic Messages pattern |
| Generated content | `output` items | `content` blocks |
| Custom tool arguments | JSON string in `arguments` | Object in `input` |
| Tool result correlation | `call_id` | `tool_use_id` |

The [Messages reference](https://platform.claude.com/docs/en/api/messages/create), [Claude tool-use guide](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview), and [OpenAI function-calling guide](https://developers.openai.com/api/docs/guides/function-calling) define these contracts. “OpenAI-compatible” should be treated as an integration claim with a feature scope: verify the endpoint, tool format, streaming events, and supported model settings that your application actually uses.

## Ask for a machine-readable answer

Use structured output when software needs a typed answer, such as a category or extracted fields. Use tool calling when the model needs to request an operation. Neither mechanism makes the answer factually correct by itself.

An **illustrative Responses request** classifying an issue:

```json
{
  "model": "gpt-6-astra",
  "input": "Classify: password reset emails never arrive.",
  "text": {
    "format": {
      "type": "json_schema",
      "name": "issue_category",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "category": {
            "type": "string",
            "enum": ["authentication", "billing", "other"]
          }
        },
        "required": ["category"],
        "additionalProperties": false
      }
    }
  }
}
```

The generated text could be `{"category":"authentication"}`. It remains content inside the provider's response envelope. Validate the returned value and handle refusals or incomplete generation before using it. Supported JSON Schema features and model compatibility are documented in [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

## A useful integration boundary

Keep provider payloads at an adapter boundary and translate them into the few events your application needs. Preserve opaque provider fields required for continuation instead of flattening everything into plain text. Record which adapter and model produced the data so a later migration can be evaluated with fixtures from real workflows.

For example, the product might only need “message appended,” “tool requested,” and “turn failed.” Its database should still retain enough original identity and status information to investigate a tool result attached to the wrong turn.

Continue with [tool calling](tool-calling.md) for the execution loop and [runtime APIs](runtime-api.md) for managed sessions.
