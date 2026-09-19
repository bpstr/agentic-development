# Recipe: a bounded tool loop

[Handbook](../../README.md) · [Recipes](README.md)

**Goal:** answer a question about a task by querying an authorized tool, then return an answer based on its result. The executable [offline example](../../examples/tool-loop/README.md) uses a scripted model so the sequence and failures can be inspected without network access or model charges.

## The mechanism

1. The application provides a user request and available tool definitions to the model adapter.
2. The adapter returns a final response or one or more requested tool calls.
3. The runtime checks the tool name, call identity, argument shape, and remaining budget.
4. The tool executes with trusted application identity. The model cannot grant itself another user's permissions by changing an argument.
5. The runtime appends a result associated with the call ID and asks for the next response.
6. The loop finishes, fails, is cancelled, or reaches its limit.

Model providers encode these items differently. The example uses an application-owned contract; it is not an MCP server, an OpenAI adapter, or an Anthropic client. Use [provider request/response examples](../03-calling-models/request-response.md) and [tool calling](../03-calling-models/tool-calling.md) to implement those adapters.

## Run it

From the repository root with Node.js 20+:

```sh
node examples/tool-loop/demo.mjs
node --test examples/tool-loop/agent-loop.test.mjs
```

Read the [example README](../../examples/tool-loop/README.md) for the output and tested failure cases. The useful observation is the causal sequence: the tool result must exist before the model can use it in an answer. A final sentence claiming success is not itself an action receipt.

## Extend one boundary at a time

Replace the scripted model with one verified provider adapter. Preserve the provider's required continuation items and tool-call/result relationship. Then replace the in-memory task service with a real authorized application service. Add per-request deadlines and result-size limits before allowing unpredictable external work.

The first example is read-only. For a write, put authorization, validation, and idempotency in the business service. Store a stable action key and receipt so a retry can recover the previous result. Checking that the model produced valid JSON does not establish that the user authorized the operation.

To run longer work, persist the run and its events rather than extending this in-memory demonstration indefinitely. See [background work](background-work.md), [security](../09-evaluation-and-operations/security.md), and [evaluations](../09-evaluation-and-operations/evaluations.md).
