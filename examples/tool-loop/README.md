# Offline tool-loop example

[Handbook](../../README.md) · [Orchestration](../../docs/05-orchestration/README.md)

This example demonstrates the application code between a model's proposed tool call and an authorized tool result. It runs entirely offline using deterministic, scripted replies. **There is no real model inference, provider API request, dependency installation, API key, or paid call.** The message objects are a small educational application protocol, not OpenAI, Anthropic, or MCP wire formats.

## Run it

Use Node.js **20 or later**, from the repository root:

```sh
node examples/tool-loop/demo.mjs
node --test examples/tool-loop/agent-loop.test.mjs
```

The demo prints a completed result with this answer and usage:

```json
{
  "status": "completed",
  "output": "TASK-1: Review login flow — todo.",
  "usage": { "modelTurns": 2, "toolCalls": 1 }
}
```

The actual output also includes the conversation records, letting you inspect the proposed call and the result whose `call_id` is `lookup-1`.

## Read the implementation

| File | Responsibility |
| --- | --- |
| [agent-loop.mjs](agent-loop.mjs) | Bounded loop, tool allowlist, JSON/schema validation, call-ID correspondence, cancellation, sanitized errors |
| [demo.mjs](demo.mjs) | Scripted model adapter and a read-only task service with workspace access checks |
| [agent-loop.test.mjs](agent-loop.test.mjs) | Behavioral tests for successful calls, invalid input, denied access, limits, and cancellation |

The model first requests `get_task` with a JSON argument string. The loop finds the tool in an explicit registry and parses and validates the arguments. The service receives trusted `userId` and `workspaceId` values separately; the model cannot supply either through this tool's schema. The service checks both workspace membership and task ownership, returning the same public error for missing and inaccessible tasks.

After execution, the loop appends a success or error result under the original call ID and requests the next model reply. In this demo, a deterministic function turns the returned task fields into a final sentence.

## Deliberate limits

- Model turns and tool-call attempts have separate limits. Invalid or unknown tools consume the call budget. A limit can stop midway through a batch; the result contains completed calls and a terminal limit status, with no further model call.
- Cancellation is checked before the next action. A signal is also passed to adapters, but this example cannot forcibly terminate an adapter that ignores it. Already completed work remains completed.
- Call IDs must be unique within the run. This catches malformed/repeated calls; it is **not durable idempotency** across runs or restarts.
- Everything lives in memory. There are no request deadlines, retries, persistent checkpoints, distributed locks, streaming, token accounting, or authentication server. The caller must derive identity from an authenticated application context.
- The service only reads records. Real writes need current authorization, appropriate approval policy, stable operation keys, and recovery for uncertain outcomes. See [execution and state](../../docs/05-orchestration/execution-and-state.md).
- Tool validators are explicit JavaScript predicates alongside descriptive schemas. A production application should prevent those two representations from drifting. A live provider adapter must validate and translate its actual response format before using this loop.

## Verification record

**Locally tested:** 2026-09-19 with Node.js **v24.19.0**. The two commands above passed: the demo produced the expected answer and usage, and all **13 tests** passed. Node 20 is the intended minimum; this session did not run a separate Node 20 compatibility check.

The tests exercise application control flow and the local service. They do not evaluate model intelligence or prove compatibility with a hosted provider. See [evaluation layers](../../docs/09-evaluation-and-operations/evaluations.md) for that distinction.
