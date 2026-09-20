# Voice delegation

Voice delegation separates an ongoing spoken conversation from the work needed to answer or act. The voice layer manages listening and speaking; a backend agent or service performs retrieval, reasoning, and domain operations. This is useful when work takes longer than a natural conversational pause.

A durable application flow is:

1. Persist the user's request in the current conversation.
2. Create a backend run and associate it with the voice delegation.
3. Let the voice layer acknowledge observed progress while work continues.
4. Save the final result with sources and action receipts.
5. Notify the live session and speak the useful part at an appropriate moment.

An illustrative application completion event is:

```json
{
  "type": "work.completed",
  "conversationId": "conv_12",
  "runId": "run_8",
  "messageId": "msg_43",
  "spokenSummary": "Three release issues need attention. The details are in this conversation."
}
```

The completion event is not a provider schema. An adapter maps it to the selected voice API and retains the provider delegation identifier. That mapping prevents two concurrent requests from receiving each other's result.

New speech may refine, replace, or cancel a request. Store the relationship explicitly; a delayed mutation must recheck permissions and preconditions before committing. Stopping audio and cancelling work are independent operations.

Choose who owns backend context. A managed delegation service may prepare requests and return results automatically. An application-managed bridge can control history, routing, budgets, validation, and redaction. [GPT-Live's delegation guide](https://developers.openai.com/api/docs/guides/live-delegation) documents both approaches, including the distinction between a completed backend response and spoken output.

On disconnect, finish or cancel each run according to policy. Persist results so that their usefulness does not depend on the user remaining on the call.
