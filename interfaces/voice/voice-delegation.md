# Voice delegation

Voice delegation is the interface pattern for keeping a spoken conversation responsive while separate backend work runs. The voice surface manages listening, speaking, and user feedback; a backend agent or service performs retrieval, reasoning, or domain operations.

A durable application flow is:

1. persist the user's resolved request in the current conversation;
2. create a backend run and associate it with the voice turn;
3. show that work is running without blocking unrelated conversation;
4. save the final result with sources and action receipts;
5. surface the result visually and speak a concise summary when appropriate.

An application-level completion event might look like:

```json
{
  "type": "work.completed",
  "conversationId": "conv_12",
  "runId": "run_8",
  "messageId": "msg_43",
  "spokenSummary": "Three release issues need attention. The details are in this conversation."
}
```

This is not a provider schema. An adapter maps application state to the selected voice API. Keep provider delegation/session identifiers so concurrent requests cannot receive each other's results.

New speech may refine, replace, or cancel a request. Model those relationships explicitly. Stopping playback, interrupting the conversational model, and cancelling backend work are separate operations.

A completion should remain useful after disconnect: persist the detailed result and restore it when the conversation is reopened. The visible voice UI can then summarize current work as **running**, **needs approval**, **completed**, or **failed** rather than leaving the user with an indefinite speaking/thinking indicator.

OpenAI's [GPT-Live delegation guide](https://developers.openai.com/api/docs/guides/live-delegation) is one concrete implementation of this pattern. The application-facing behavior should remain provider-independent. See [voice session states](voice-session-states.md) and [background work](../../patterns/background-work.md).
