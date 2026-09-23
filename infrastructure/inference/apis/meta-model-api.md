# Meta Model API and Muse Spark

Official documentation: [quickstart](https://dev.meta.ai/docs/quickstart), [protocol selection](https://dev.meta.ai/docs/protocols), [Responses](https://dev.meta.ai/docs/protocols/responses), [tool calling](https://dev.meta.ai/docs/tool-calling), and [pricing](https://dev.meta.ai/docs/pricing-rate-limits).

Meta Model API exposes hosted [Muse models](../../models/providers/meta-ai.md). An application still owns its business state, tool execution, permissions, and completion criteria. It is not the API for provisioning a Muse personal-agent desktop session.

## Connection and protocol choice

The OpenAI-compatible base URL is `https://api.meta.ai/v1`. Meta's examples read a bearer key from `MODEL_API_KEY`.

- `POST /v1/responses`: the preferred new-agent integration, including reasoning continuity, file inputs, search grounding, and background inference.
- `POST /v1/chat/completions`: compatible messages-array integration; do not assume cross-turn reasoning is preserved.
- `POST /v1/messages`: Anthropic-compatible format with thinking replay. An Anthropic SDK client uses the host `https://api.meta.ai`, without appending `/v1` itself in the configured base URL.

These distinctions come from [protocol selection](https://dev.meta.ai/docs/protocols). Wire compatibility is not a guarantee that every provider-specific SDK option, hosted tool, or managed agent service works unchanged. Verify the framework adapter's actual endpoint and request serialization.

## Minimal bounded tool loop

Install the OpenAI Python client in a virtual environment and supply `MODEL_API_KEY` through a secret manager or local environment. Do not embed the key in source or a browser application.

```bash
python -m pip install openai
```

This complete example uses an intentionally synthetic, read-only release policy. It demonstrates the inference → tool → result → continuation lifecycle, not an integration with a real release system. Interface shapes follow Meta's [quickstart](https://dev.meta.ai/docs/quickstart), [Responses guide](https://dev.meta.ai/docs/protocols/responses), and [tool-calling guide](https://dev.meta.ai/docs/tool-calling).

```python
import json
import os
from openai import APIError, OpenAI


def main() -> None:
    key = os.environ.get("MODEL_API_KEY")
    if not key:
        raise SystemExit("Set MODEL_API_KEY before running this example.")

    client = OpenAI(
        base_url="https://api.meta.ai/v1",
        api_key=key,
        timeout=60.0,
        max_retries=2,
    )
    tools = [{
        "type": "function",
        "name": "release_policy",
        "description": "Read the synthetic release acceptance policy.",
        "parameters": {
            "type": "object", "properties": {},
            "required": [], "additionalProperties": False,
        },
    }]
    history = [{
        "role": "user",
        "content": "Read the release policy and explain its acceptance criteria.",
    }]

    for _ in range(8):
        response = client.responses.create(
            model="muse-spark-1.3",  # Standard: never silently switch data tiers.
            input=history,
            tools=tools,
            max_output_tokens=512,
            store=False,
            include=["reasoning.encrypted_content"],
        )
        if response.status != "completed":
            raise RuntimeError(f"Generation did not complete: {response.status}")

        calls = [item for item in response.output if item.type == "function_call"]
        if not calls:
            if not response.output_text.strip():
                raise RuntimeError("No tool call or final text was returned.")
            print(response.output_text)
            return

        # Keep typed outputs, commentary phases, and encrypted reasoning intact.
        history.extend(item.model_dump(exclude_none=True) for item in response.output)
        for call in calls:
            # Allowlist the function and validate arguments before execution.
            if call.name != "release_policy" or json.loads(call.arguments) != {}:
                raise ValueError("Unexpected tool name or arguments.")
            result = {"synthetic": True, "requires": ["tests pass", "review approved"]}
            history.append({
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(result),
            })
    raise RuntimeError("Stopped at the eight-turn limit.")


if __name__ == "__main__":
    try:
        main()
    except APIError as exc:
        # Avoid dumping credentials, request content, or provider error bodies.
        raise SystemExit(f"Meta request failed: {type(exc).__name__}") from None
```

Real tools need authorization against the authenticated user and workspace, schema validation, bounded result sizes, and idempotency for writes. A model-selected workspace ID is not authorization. This example has no external write tool and is not a production permission system.


## Parallel tool calls

Parallel function calling is enabled by default when function tools are supplied on both Chat Completions and Responses. Muse Spark may therefore return several independent calls in one model turn. Execute every returned call, preserve each call identifier, append one matching result per call, and only then continue inference. Set `parallel_tool_calls: false` when operations must be serialized.

This matters beyond latency. Parallel reads are usually straightforward; parallel writes need explicit conflict and authorization rules. A batch of tool calls is not a transaction, and one successful side effect must not be repeated merely because another call in the same batch failed. Give each mutating operation an idempotency key or durable receipt, and define whether partial success is acceptable.

Meta's current tool-calling documentation also notes that each guarded call in a Muse Code parallel batch can have its own approval prompt. Treat approval as per-operation authority rather than approval for the batch as a whole.

For an agent loop, useful acceptance cases are: three independent reads returned in one turn; mixed read/write calls; one rejected call among successful siblings; one slow or timed-out call; duplicate/retried results; and `parallel_tool_calls: false` as the serial control. Measure wall-clock gain separately from correctness and duplicate effects.

See [tool calling](https://dev.meta.ai/docs/tool-calling) and the [Chat Completions schema](https://dev.meta.ai/docs/api-reference/chat-completions/schemas#parallel-tool-calls).

## Reasoning, streaming, and state

For stateless continuation, request encrypted reasoning explicitly and replay retained typed output items unchanged. `store=False` controls response-history storage; it does not by itself establish a universal zero-retention policy. Alternatively, use stored responses and `previous_response_id`; resend request-level `instructions` when needed.

Preserve tool-call/result pairing and intermediate message phases. Do not flatten all output into assistant text. Encrypted reasoning is opaque context, not text to display or summarize. The [Responses guide](https://dev.meta.ai/docs/protocols/responses) also documents rejected automatic truncation and over-context requests: budget and compact history deliberately.

For streaming, assemble arguments until a tool call is complete before validating or executing it. Treat transport completion, model completion, and successful business execution as separate states. A disconnected stream must not cause an already-committed mutation to run again. The same application-owned receipt and idempotency rules apply to background inference.

## Standard versus Contributor

The [pricing page](https://dev.meta.ai/docs/pricing-rate-limits), checked September 23, 2026, lists these USD rates per million tokens:

- **Standard `muse-spark-1.3`:** input $1.25; cached input $0.15; output $4.25. Prompts and completions are not used for training.
- **Contributor `muse-spark-1.3-contributor`:** input $0.10; cached input $0.002; output $0.20. Prompts and completions may be used for training.

Tool charges and quotas are separate considerations. Rate limits are team-scoped; adding API keys does not establish independent capacity. Training permission and retention are different questions.

For a multi-tenant application, a defensible policy is Standard by default, with explicit authorized opt-in before Contributor use. This is application guidance, not a Meta workspace-setting API:

1. Resolve an allowlisted model ID server-side from the workspace's approved data mode.
2. Apply that decision to delegated calls, tool results, background jobs, retries, and summaries—not just the initial user message.
3. Reject ineligible data or return a clear policy error; never silently downgrade to Contributor after a quota or billing failure.
4. Audit the selected model/data mode without retaining sensitive prompts unnecessarily. Review cached and previously stored context when policy changes.

Measure the cost of accepted outcomes, including failed runs, repeated context, tool charges, and latency—not output-token price alone.

## Compatibility acceptance tests

Before switching providers, exercise single and multiple tool calls, streamed argument assembly, malformed arguments, schema-constrained outputs, history replay, context overflow, cancellation, and retryable failures. Include framework-generated tool names: Meta documents restrictions on dotted function names in its [tool guide](https://dev.meta.ai/docs/tool-calling).

Use synthetic fixtures first, separate read-only from mutating cases, and assert authorization independently of the model's response. These are recommended tests; the example's presence is not a claim of a live API benchmark.
