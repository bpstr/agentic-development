# Anthropic computer use

[Official computer use documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool).

Anthropic computer use lets Claude request desktop observations and input actions. The application supplies the desktop and executes the requested operations; declaring the tool does not provision a computer.

The current toolset uses the standard Messages API without a beta header. A minimal request body for `POST /v1/messages` is:

```json
{
  "model": "claude-opus-5",
  "max_tokens": 1024,
  "tools": [{"type": "computer_toolset_20260801"}],
  "messages": [{"role": "user", "content": "Inspect the current desktop."}]
}
```

Authenticate using the API's normal credentials and version header. Responses contain `tool_use` blocks whose member `name`, such as `screenshot` or `left_click`, is paired with `toolset_name: "computer"`. Execute blocks in order and return one `tool_result` per call, matching `tool_use_id` and echoing the toolset name. Return images for screenshot observations.

The toolset rejects older fields such as `display_width_px` and `name`. Coordinates use the returned screenshot's pixel space. Disable unsupported members through `configs`; zoom is enabled by default.

On failure, stop dependent actions and report unexecuted calls accurately. Isolate the desktop, bound the loop, and verify saved state before announcing success. Page instructions and screenshots remain untrusted inputs.
