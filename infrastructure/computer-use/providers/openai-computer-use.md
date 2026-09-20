# OpenAI computer use

[Official computer use guide](https://developers.openai.com/api/docs/guides/tools-computer-use).

OpenAI computer use lets models inspect a browser or desktop and request interaction. The guide offers code execution through libraries such as Playwright, or a structured `computer` tool. For GPT-6 Astra, it recommends code execution; the structured tool remains an alternative.

For the structured route, this is a request body for `POST /v1/responses` using the model in the guide:

```json
{
  "model": "gpt-5.6-sol",
  "tools": [{"type": "computer"}],
  "input": "Inspect the current page using the computer tool."
}
```

The application supplies authentication and its own execution environment. A returned `computer_call` contains a `call_id` and ordered `actions`. Execute those actions, then submit a `computer_call_output` with the matching identifier and a `computer_screenshot` result. Use `previous_response_id` to continue the response chain.

An initial action may request only a screenshot. A generated call's `completed` status means generation finished; the executor still has work to do. Preserve screenshot coordinates, enforce action policy, and inspect the resulting state.

Code execution supports richer sequences and conditions but requires an isolated runtime. Neither integration turns a model proposal into an authorized operation automatically. The application owns permissions, confirmations, execution limits, and recovery after uncertain actions.
