# Batch inference

Batch inference submits many independent model requests for asynchronous processing. It suits offline classification, evaluation, enrichment, and embedding generation when immediate responses are unnecessary. It differs from placing many prompts into one conversation and from a long-running agent that chooses its next action after each result.

A batch needs stable item identities:

```json
{
  "custom_id": "issue-42-v3",
  "method": "POST",
  "url": "/v1/responses",
  "body": {
    "model": "gpt-6-astra",
    "input": "Classify this issue: password reset emails never arrive."
  }
}
```

This illustrative item follows the [OpenAI Batch input format](https://developers.openai.com/api/docs/guides/batch). A real input file is JSONL: one complete object per line, using an endpoint and model supported by the batch service.

## Reconcile results

Persist the batch ID, each item ID, its source version, and processing status. Match outputs by item identity rather than output order. Separate successful results from validation failures, expired requests, and provider errors; retry only the remaining items.

For example, if an issue changes while its classification is pending, compare its current version with `issue-42-v3` before applying the result. A valid classification of an old document can still be an invalid update to a new one.

Batch submission does not establish atomicity across items or exactly-once application writes. Make importing results idempotent. A batch that requests tool calls also does not execute application functions automatically; dependent tool loops need their own orchestration.

Consult each provider's completion window, capacity rules, cancellation semantics, and pricing before choosing batch processing for a deadline-sensitive workload.
