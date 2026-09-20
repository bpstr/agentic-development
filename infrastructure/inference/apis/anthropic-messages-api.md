# Anthropic Messages API

[Official Messages reference](https://platform.claude.com/docs/en/api/messages/create) · [Python SDK](https://github.com/anthropics/anthropic-sdk-python) · [Tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)

The Messages API generates Claude responses from structured messages. Content is represented as blocks, which can include text, tool use, and supported media. A normal Messages integration owns its conversation history and any client-side tool execution.

## Minimal setup

Install `anthropic` in a Python environment. Configure `ANTHROPIC_API_KEY` and an available `ANTHROPIC_MODEL` in the backend environment:

```python
import os
from anthropic import Anthropic

client = Anthropic()
message = client.messages.create(
    model=os.environ["ANTHROPIC_MODEL"],
    max_tokens=256,
    system="Explain technical terms in one sentence.",
    messages=[{"role": "user", "content": "What is idempotency?"}],
)

print(message.stop_reason)
for block in message.content:
    if block.type == "text":
        print(block.text)
```

This performs a live request when run. The basic pattern places system instructions in top-level `system`; do not mechanically translate every provider's role array into this contract.

## Tool continuation

When a client tool is requested, an assistant content block identifies its `id`, `name`, and structured `input`. After execution, return a user content block of type `tool_result` with the matching `tool_use_id`. Include the assistant response in history before its result.

Inspect `stop_reason`: reaching an output limit differs from finishing a turn or requesting a tool. Preserve provider-required thinking and signature blocks without alteration during continuation.

Server tools execute through Anthropic's service, while client tools require application execution. Use the selected tool's own reference for versioned definitions, compatible models, and result handling. A model-generated description of success is not an operation receipt.
