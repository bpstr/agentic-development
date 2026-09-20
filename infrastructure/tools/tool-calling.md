# Tool calling

Tool calling is the model's production of a structured request for an operation. Execution happens in application code, an agent runtime, or a provider service. Receiving a call is therefore a control-flow transition, not proof of success.

## One complete correlation

In OpenAI Responses, a model can emit this abbreviated output item:

```json
{
  "type": "function_call",
  "id": "fc_example",
  "call_id": "call_example",
  "name": "get_task",
  "arguments": "{\"key\":\"TASK-42\"}"
}
```

After validating arguments and checking access, the executor supplies a matching continuation item:

```json
{
  "type": "function_call_output",
  "call_id": "call_example",
  "output": "{\"key\":\"TASK-42\",\"status\":\"in_progress\"}"
}
```

These are synthetic items, not complete requests. The correlation key is `call_id`, not the function-call item's `id`. Continue with the previous response or correctly preserved history, including the tools available for another step. [Official function-calling flow](https://developers.openai.com/api/docs/guides/function-calling).

## More than one call

The model may request several operations or return another call after seeing results. Process all relevant output items and enforce a bounded loop. Run independent reads concurrently when their contracts permit it; preserve order when a later operation depends on an earlier result.

Distinguish arguments that are incomplete because they are still streaming from completed arguments that fail validation. The former require buffering; the latter require a controlled failure or clarification.

Provider-hosted tools and remote MCP connectors have their own event types and execution owners. Route only custom function requests to a local dispatcher. Tool-choice settings influence whether a call is generated; they do not replace authorization at execution time.
