# Token usage

Token usage describes the model input and output consumed by inference. Providers may report cached input, reasoning, audio, or other subcategories. Some fields are subdivisions of totals; adding every field together can count the same usage twice. Consult the selected API's usage definitions before constructing billing metrics.

Record usage per model call and aggregate by run, conversation, and accountable workspace. A single user action can include routing, retrieval interpretation, retries, delegated calls, and a final response. Visible answer length captures only a fraction of this work.

An illustrative accounting record can keep raw counters separate from derived charges:

```json
{
  "run_id": "run_42",
  "provider_request_id": "request_7",
  "input_tokens": 3200,
  "output_tokens": 180,
  "cached_input_tokens": 2400,
  "usage_complete": true
}
```

Here cached input is a subset of input, not an additional 2,400 tokens. This is an application example, not a portable provider schema. [OpenAI's response reference](https://developers.openai.com/api/reference/resources/responses/methods/create) documents its specific usage fields.

Streaming failures may leave usage incomplete. Preserve that uncertainty rather than recording missing usage as zero. Reconcile provider reports where available. For media and managed runtimes, also account for billable units that are not tokens, such as generated seconds, tool executions, or compute time.
